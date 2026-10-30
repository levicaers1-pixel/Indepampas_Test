CREATE OR REPLACE FUNCTION public.admin_vote_stats()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Geen toegang';
  END IF;
  WITH per_voter AS (
    SELECT voter_id,
           count(*) AS votes,
           count(DISTINCT date_trunc('week', created_at AT TIME ZONE 'UTC')) AS weeks
    FROM public.community_votes
    GROUP BY voter_id
  ),
  weekly AS (
    SELECT to_char(date_trunc('week', created_at AT TIME ZONE 'UTC'), 'YYYY-MM-DD') AS week,
           count(*) AS votes,
           count(DISTINCT voter_id) AS voters
    FROM public.community_votes
    GROUP BY 1
  )
  SELECT jsonb_build_object(
    'total_votes', (SELECT count(*) FROM public.community_votes),
    'voters', (SELECT count(*) FROM per_voter),
    'voters_2plus', (SELECT count(*) FROM per_voter WHERE votes >= 2),
    'voters_5plus', (SELECT count(*) FROM per_voter WHERE votes >= 5),
    'voters_multi_week', (SELECT count(*) FROM per_voter WHERE weeks >= 2),
    'max_votes_per_voter', (SELECT COALESCE(max(votes), 0) FROM per_voter),
    'weekly', COALESCE((SELECT jsonb_agg(jsonb_build_object('week', week, 'votes', votes, 'voters', voters) ORDER BY week) FROM weekly), '[]'::jsonb),
    'dog_votes', (SELECT count(*) FROM public.dog_votes),
    'dog_voters', (SELECT count(DISTINCT ip_hash) FROM public.dog_votes)
  ) INTO result;
  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_vote_stats() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_vote_stats() TO authenticated;