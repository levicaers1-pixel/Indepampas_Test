ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS dog_override text
  CHECK (dog_override IN ('course', 'clubhouse', 'no'));

CREATE TABLE IF NOT EXISTS public.dog_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  voter_id uuid NOT NULL,
  ip_hash text NOT NULL,
  answer text NOT NULL CHECK (answer IN ('course', 'clubhouse', 'no')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (course_id, voter_id)
);
CREATE INDEX IF NOT EXISTS dog_votes_course_idx ON public.dog_votes (course_id);

ALTER TABLE public.dog_votes ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.dog_votes FROM anon, authenticated;
GRANT ALL ON public.dog_votes TO service_role;

CREATE OR REPLACE FUNCTION public.cast_dog_vote(_course_id uuid, _voter_id uuid, _ip_hash text, _answer text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _course_id IS NULL OR _voter_id IS NULL OR _ip_hash IS NULL OR _answer IS NULL
     OR _answer NOT IN ('course', 'clubhouse', 'no') THEN
    RAISE EXCEPTION 'Ongeldige stem';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.courses c WHERE c.id = _course_id) THEN
    RAISE EXCEPTION 'Onbekende baan';
  END IF;
  INSERT INTO public.dog_votes (course_id, voter_id, ip_hash, answer)
  VALUES (_course_id, _voter_id, _ip_hash, _answer)
  ON CONFLICT (course_id, voter_id)
  DO UPDATE SET answer = EXCLUDED.answer, ip_hash = EXCLUDED.ip_hash, updated_at = now();
END;
$$;
REVOKE ALL ON FUNCTION public.cast_dog_vote(uuid, uuid, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cast_dog_vote(uuid, uuid, text, text) TO service_role;

CREATE OR REPLACE FUNCTION public.get_dog_status()
RETURNS TABLE (
  course_id uuid, status text, host_confirmed boolean,
  votes_course integer, votes_clubhouse integer, votes_no integer, votes_total integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH latest AS (
    SELECT DISTINCT ON (v.course_id, v.ip_hash) v.course_id, v.answer
    FROM public.dog_votes v
    ORDER BY v.course_id, v.ip_hash, v.updated_at DESC
  ),
  tally AS (
    SELECT l.course_id,
           count(*) FILTER (WHERE l.answer = 'course')::int AS votes_course,
           count(*) FILTER (WHERE l.answer = 'clubhouse')::int AS votes_clubhouse,
           count(*) FILTER (WHERE l.answer = 'no')::int AS votes_no,
           count(*)::int AS votes_total
    FROM latest l
    GROUP BY l.course_id
  )
  SELECT c.id,
         CASE
           WHEN c.dog_override IS NOT NULL THEN c.dog_override
           WHEN t.votes_total >= 3 AND t.votes_course * 4 >= t.votes_total * 3 THEN 'course'
           WHEN t.votes_total >= 3 AND t.votes_clubhouse * 4 >= t.votes_total * 3 THEN 'clubhouse'
           WHEN t.votes_total >= 3 AND t.votes_no * 4 >= t.votes_total * 3 THEN 'no'
           ELSE 'unknown'
         END,
         c.dog_override IS NOT NULL,
         COALESCE(t.votes_course, 0),
         COALESCE(t.votes_clubhouse, 0),
         COALESCE(t.votes_no, 0),
         COALESCE(t.votes_total, 0)
  FROM public.courses c
  LEFT JOIN tally t ON t.course_id = c.id
  WHERE t.course_id IS NOT NULL OR c.dog_override IS NOT NULL;
$$;
REVOKE ALL ON FUNCTION public.get_dog_status() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_dog_status() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_my_dog_votes(_voter_id uuid)
RETURNS TABLE (course_id uuid, answer text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT v.course_id, v.answer FROM public.dog_votes v WHERE v.voter_id = _voter_id;
$$;
REVOKE ALL ON FUNCTION public.get_my_dog_votes(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_my_dog_votes(uuid) TO anon, authenticated;