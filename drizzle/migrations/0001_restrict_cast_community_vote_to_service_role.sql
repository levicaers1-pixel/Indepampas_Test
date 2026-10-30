REVOKE EXECUTE ON FUNCTION public.cast_community_vote(uuid, uuid, integer) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.cast_community_vote(uuid, uuid, integer) TO service_role;