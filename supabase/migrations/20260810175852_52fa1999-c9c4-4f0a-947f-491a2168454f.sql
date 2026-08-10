-- 1. Remove permissive write policies
DROP POLICY IF EXISTS "Anyone can cast a community vote" ON public.community_votes;
DROP POLICY IF EXISTS "Anyone can update a community vote" ON public.community_votes;
DROP POLICY IF EXISTS "Anyone can view community votes" ON public.community_votes;

-- 2. Hide voter_id from public reads (column-level grants)
REVOKE ALL ON public.community_votes FROM anon, authenticated;
GRANT SELECT (id, course_id, score, created_at, updated_at) ON public.community_votes TO anon, authenticated;
GRANT ALL ON public.community_votes TO service_role;

CREATE POLICY "Anyone can view community vote scores"
  ON public.community_votes FOR SELECT
  TO anon, authenticated
  USING (true);

-- 3. Controlled write path: can only ever touch the caller's own (course, voter) row
CREATE OR REPLACE FUNCTION public.cast_community_vote(_course_id uuid, _voter_id uuid, _score integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  clean integer;
BEGIN
  IF _course_id IS NULL OR _voter_id IS NULL OR _score IS NULL THEN
    RAISE EXCEPTION 'Ongeldige stem';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.courses c WHERE c.id = _course_id) THEN
    RAISE EXCEPTION 'Onbekende baan';
  END IF;
  clean := GREATEST(0, LEAST(100, _score));

  INSERT INTO public.community_votes (course_id, voter_id, score)
  VALUES (_course_id, _voter_id, clean)
  ON CONFLICT (course_id, voter_id)
  DO UPDATE SET score = EXCLUDED.score, updated_at = now()
  WHERE public.community_votes.voter_id = _voter_id;

  RETURN clean;
END;
$$;

REVOKE ALL ON FUNCTION public.cast_community_vote(uuid, uuid, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cast_community_vote(uuid, uuid, integer) TO anon, authenticated;

-- 4. Read back only your own votes
CREATE OR REPLACE FUNCTION public.get_my_community_votes(_voter_id uuid)
RETURNS TABLE(course_id uuid, score integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT v.course_id, v.score
  FROM public.community_votes v
  WHERE v.voter_id = _voter_id;
$$;

REVOKE ALL ON FUNCTION public.get_my_community_votes(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_my_community_votes(uuid) TO anon, authenticated;