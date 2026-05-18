
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Course ratings
CREATE TABLE public.course_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  rank INTEGER NOT NULL,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  type TEXT NOT NULL,
  greenfee INTEGER NOT NULL,
  fee_band TEXT NOT NULL,
  played_on TEXT,
  -- criteria (each /10)
  c_ontwerp INTEGER NOT NULL DEFAULT 0,
  c_onderhoud INTEGER NOT NULL DEFAULT 0,
  c_uitdaging INTEGER NOT NULL DEFAULT 0,
  c_landschap INTEGER NOT NULL DEFAULT 0,
  c_faciliteiten INTEGER NOT NULL DEFAULT 0,
  c_prijs_kwaliteit INTEGER NOT NULL DEFAULT 0,
  c_gastvrijheid INTEGER NOT NULL DEFAULT 0,
  -- host scores (/100)
  host_lars INTEGER NOT NULL DEFAULT 0,
  host_levi INTEGER NOT NULL DEFAULT 0,
  host_niels INTEGER NOT NULL DEFAULT 0,
  pampas_score INTEGER NOT NULL,
  verdict TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  findings JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.course_ratings ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Anyone can view course ratings"
  ON public.course_ratings FOR SELECT
  USING (true);

-- Admin write
CREATE POLICY "Admins can insert course ratings"
  ON public.course_ratings FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update course ratings"
  ON public.course_ratings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete course ratings"
  ON public.course_ratings FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER course_ratings_set_updated_at
  BEFORE UPDATE ON public.course_ratings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
