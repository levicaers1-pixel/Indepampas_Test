CREATE TABLE public.community_votes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  voter_id uuid NOT NULL,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (course_id, voter_id)
);

GRANT SELECT, INSERT, UPDATE ON public.community_votes TO anon;
GRANT SELECT, INSERT, UPDATE ON public.community_votes TO authenticated;
GRANT ALL ON public.community_votes TO service_role;

ALTER TABLE public.community_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view community votes"
  ON public.community_votes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can cast a community vote"
  ON public.community_votes FOR INSERT
  WITH CHECK (score >= 0 AND score <= 100);

CREATE POLICY "Anyone can update a community vote"
  ON public.community_votes FOR UPDATE
  USING (true)
  WITH CHECK (score >= 0 AND score <= 100);

CREATE POLICY "Admins can delete community votes"
  ON public.community_votes FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX community_votes_course_id_idx ON public.community_votes(course_id);

CREATE TRIGGER community_votes_set_updated_at
  BEFORE UPDATE ON public.community_votes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();