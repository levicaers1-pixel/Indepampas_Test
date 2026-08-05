CREATE TABLE public.course_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  storage_path text,
  caption text,
  credit text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.course_photos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_photos TO authenticated;
GRANT ALL ON public.course_photos TO service_role;

ALTER TABLE public.course_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view course photos" ON public.course_photos FOR SELECT USING (true);
CREATE POLICY "Admins can insert course photos" ON public.course_photos FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update course photos" ON public.course_photos FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete course photos" ON public.course_photos FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX course_photos_course_id_idx ON public.course_photos(course_id, sort_order);

CREATE TRIGGER course_photos_set_updated_at BEFORE UPDATE ON public.course_photos FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();