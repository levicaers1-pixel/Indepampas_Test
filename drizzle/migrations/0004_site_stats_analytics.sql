-- 1. Tabellen
CREATE TABLE IF NOT EXISTS public.site_stats_daily (
  day date NOT NULL,
  path text NOT NULL CHECK (path ~ '^/[a-z0-9/_.-]{0,119}$'),
  source text NOT NULL CHECK (source ~ '^[a-z0-9.-]{1,100}$'),
  country text NOT NULL CHECK (country ~ '^[A-Z0-9]{2}$'),
  device text NOT NULL CHECK (device IN ('mobile', 'tablet', 'desktop', 'other')),
  views integer NOT NULL DEFAULT 0,
  PRIMARY KEY (day, path, source, country, device)
);

CREATE TABLE IF NOT EXISTS public.site_stats_totals (
  day date PRIMARY KEY,
  views integer NOT NULL DEFAULT 0,
  visitors integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.site_visitors_daily (
  day date NOT NULL,
  visitor_hash text NOT NULL CHECK (visitor_hash ~ '^[a-f0-9]{64}$'),
  PRIMARY KEY (day, visitor_hash)
);

ALTER TABLE public.site_stats_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_stats_totals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_visitors_daily ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.site_stats_daily FROM anon, authenticated;
REVOKE ALL ON public.site_stats_totals FROM anon, authenticated;
REVOKE ALL ON public.site_visitors_daily FROM anon, authenticated;
GRANT ALL ON public.site_stats_daily TO service_role;
GRANT ALL ON public.site_stats_totals TO service_role;
GRANT ALL ON public.site_visitors_daily TO service_role;

-- 2. Meting registreren (enkel service_role)
CREATE OR REPLACE FUNCTION public.track_pageview(
  _path text, _source text, _country text, _device text, _visitor_hash text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _day date := (now() AT TIME ZONE 'UTC')::date;
  _new_visitor integer := 0;
BEGIN
  IF _path IS NULL OR _source IS NULL OR _country IS NULL OR _device IS NULL OR _visitor_hash IS NULL THEN
    RAISE EXCEPTION 'Ongeldige meting';
  END IF;

  INSERT INTO public.site_visitors_daily (day, visitor_hash)
  VALUES (_day, _visitor_hash)
  ON CONFLICT DO NOTHING;
  GET DIAGNOSTICS _new_visitor = ROW_COUNT;

  INSERT INTO public.site_stats_totals (day, views, visitors)
  VALUES (_day, 1, _new_visitor)
  ON CONFLICT (day) DO UPDATE
    SET views = public.site_stats_totals.views + 1,
        visitors = public.site_stats_totals.visitors + EXCLUDED.visitors;

  INSERT INTO public.site_stats_daily (day, path, source, country, device, views)
  VALUES (_day, _path, _source, _country, _device, 1)
  ON CONFLICT (day, path, source, country, device) DO UPDATE
    SET views = public.site_stats_daily.views + 1;
END;
$$;

REVOKE ALL ON FUNCTION public.track_pageview(text, text, text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.track_pageview(text, text, text, text, text) TO service_role;

-- 3. Overzicht voor het admin-gedeelte
CREATE OR REPLACE FUNCTION public.admin_site_stats(_days integer DEFAULT 30)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _from date := (now() AT TIME ZONE 'UTC')::date - (GREATEST(LEAST(COALESCE(_days, 30), 730), 1) - 1);
  result jsonb;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Geen toegang';
  END IF;
  SELECT jsonb_build_object(
    'from', _from,
    'views', COALESCE((SELECT sum(views) FROM public.site_stats_totals WHERE day >= _from), 0),
    'visitors', COALESCE((SELECT sum(visitors) FROM public.site_stats_totals WHERE day >= _from), 0),
    'daily', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('day', day, 'views', views, 'visitors', visitors) ORDER BY day)
      FROM public.site_stats_totals WHERE day >= _from), '[]'::jsonb),
    'pages', COALESCE((
      SELECT jsonb_agg(to_jsonb(t) ORDER BY t.views DESC) FROM (
        SELECT path, sum(views)::int AS views FROM public.site_stats_daily
        WHERE day >= _from GROUP BY path ORDER BY 2 DESC LIMIT 30) t), '[]'::jsonb),
    'courses', COALESCE((
      SELECT jsonb_agg(to_jsonb(t) ORDER BY t.views DESC) FROM (
        SELECT path, sum(views)::int AS views FROM public.site_stats_daily
        WHERE day >= _from AND path LIKE '/courses/%' GROUP BY path ORDER BY 2 DESC LIMIT 30) t), '[]'::jsonb),
    'sources', COALESCE((
      SELECT jsonb_agg(to_jsonb(t) ORDER BY t.views DESC) FROM (
        SELECT source, sum(views)::int AS views FROM public.site_stats_daily
        WHERE day >= _from GROUP BY source ORDER BY 2 DESC LIMIT 20) t), '[]'::jsonb),
    'countries', COALESCE((
      SELECT jsonb_agg(to_jsonb(t) ORDER BY t.views DESC) FROM (
        SELECT country, sum(views)::int AS views FROM public.site_stats_daily
        WHERE day >= _from GROUP BY country ORDER BY 2 DESC LIMIT 20) t), '[]'::jsonb),
    'devices', COALESCE((
      SELECT jsonb_agg(to_jsonb(t) ORDER BY t.views DESC) FROM (
        SELECT device, sum(views)::int AS views FROM public.site_stats_daily
        WHERE day >= _from GROUP BY device ORDER BY 2 DESC) t), '[]'::jsonb)
  ) INTO result;
  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_site_stats(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_site_stats(integer) TO authenticated;

-- 4. Dagafdrukken na twee dagen verwijderen (de totalen blijven, die bevatten geen persoonsgegevens)
CREATE OR REPLACE FUNCTION public.purge_old_site_visitors()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  removed integer;
BEGIN
  DELETE FROM public.site_visitors_daily
  WHERE day < (now() AT TIME ZONE 'UTC')::date - 1;
  GET DIAGNOSTICS removed = ROW_COUNT;
  RETURN removed;
END;
$$;

REVOKE ALL ON FUNCTION public.purge_old_site_visitors() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.purge_old_site_visitors() TO service_role;