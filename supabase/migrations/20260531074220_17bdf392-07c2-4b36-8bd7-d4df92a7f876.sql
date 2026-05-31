-- New courses + ratings tables for the rebuilt parcours system

CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text NOT NULL DEFAULT 'België',
  region text,
  type text,
  greenfee numeric,
  fee_category text,
  holes integer NOT NULL DEFAULT 18,
  website text,
  episode_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.courses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view courses"
  ON public.courses FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert courses"
  ON public.courses FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update courses"
  ON public.courses FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete courses"
  ON public.courses FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER courses_set_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Derive fee_category from greenfee
CREATE OR REPLACE FUNCTION public.derive_fee_category()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.greenfee IS NULL THEN
    NEW.fee_category := NULL;
  ELSIF NEW.greenfee < 60 THEN
    NEW.fee_category := '€';
  ELSIF NEW.greenfee < 85 THEN
    NEW.fee_category := '€€';
  ELSIF NEW.greenfee < 120 THEN
    NEW.fee_category := '€€€';
  ELSE
    NEW.fee_category := '€€€€';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER courses_fee_category
  BEFORE INSERT OR UPDATE OF greenfee ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.derive_fee_category();

CREATE TABLE public.ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  host text NOT NULL CHECK (host IN ('Lars', 'Levi', 'Niels')),
  played_on date,
  score_design numeric NOT NULL CHECK (score_design BETWEEN 1 AND 10),
  score_condition numeric NOT NULL CHECK (score_condition BETWEEN 1 AND 10),
  score_challenge numeric NOT NULL CHECK (score_challenge BETWEEN 1 AND 10),
  score_scenery numeric NOT NULL CHECK (score_scenery BETWEEN 1 AND 10),
  score_facilities numeric NOT NULL CHECK (score_facilities BETWEEN 1 AND 10),
  score_value numeric NOT NULL CHECK (score_value BETWEEN 1 AND 10),
  score_hospitality numeric NOT NULL CHECK (score_hospitality BETWEEN 1 AND 10),
  host_score numeric GENERATED ALWAYS AS (
    round((
      score_design * 0.20 +
      score_condition * 0.20 +
      score_challenge * 0.15 +
      score_scenery * 0.15 +
      score_facilities * 0.10 +
      score_value * 0.10 +
      score_hospitality * 0.10
    ) * 10, 1)
  ) STORED,
  hole_of_day text,
  would_return text,
  one_word text,
  review text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (course_id, host)
);

GRANT SELECT ON public.ratings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ratings TO authenticated;
GRANT ALL ON public.ratings TO service_role;

ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ratings"
  ON public.ratings FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert ratings"
  ON public.ratings FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update ratings"
  ON public.ratings FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete ratings"
  ON public.ratings FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER ratings_set_updated_at
  BEFORE UPDATE ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX ratings_course_id_idx ON public.ratings(course_id);