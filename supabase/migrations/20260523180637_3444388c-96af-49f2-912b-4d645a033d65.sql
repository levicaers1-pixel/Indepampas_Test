ALTER TABLE public.course_ratings
  ADD COLUMN country_code text NOT NULL DEFAULT 'BE',
  ADD COLUMN latitude double precision,
  ADD COLUMN longitude double precision;