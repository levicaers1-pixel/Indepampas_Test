import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "pampas_voter_id";

/** Host-ratings wegen 10x zwaarder dan community-stemmen. */
export const HOST_WEIGHT = 10;
export const COMMUNITY_WEIGHT = 1;

export type CommunityVote = {
  id: string;
  course_id: string;
  voter_id: string;
  score: number;
};

export function getVoterId(): string | null {
  if (typeof window === "undefined") return null;
  let id = window.localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}

export async function fetchCourseVotes(courseId: string): Promise<CommunityVote[]> {
  const { data, error } = await supabase
    .from("community_votes")
    .select("id,course_id,score")
    .eq("course_id", courseId);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({ ...r, voter_id: "" }));
}

export async function castVote(courseId: string, voterId: string, score: number) {
  const clean = Math.max(0, Math.min(100, Math.round(score)));
  const { data, error } = await supabase.rpc("cast_community_vote", {
    _course_id: courseId,
    _voter_id: voterId,
    _score: clean,
  });
  if (error) throw new Error(error.message);
  return typeof data === "number" ? data : clean;
}

export async function fetchMyVotes(voterId: string): Promise<Map<string, number>> {
  const { data, error } = await supabase.rpc("get_my_community_votes", { _voter_id: voterId });
  if (error) throw new Error(error.message);
  const map = new Map<string, number>();
  for (const row of (data ?? []) as { course_id: string; score: number }[]) {
    map.set(row.course_id, row.score);
  }
  return map;
}


/**
 * Gewogen gemiddelde over host-ratings + community-stemmen.
 * (SUM(host)*10 + SUM(community)*1) / (COUNT(host)*10 + COUNT(community)*1)
 */
export function weightedCommunityScore(
  hostScores: number[],
  communityScores: number[],
): number | null {
  const num =
    hostScores.reduce((s, v) => s + v, 0) * HOST_WEIGHT +
    communityScores.reduce((s, v) => s + v, 0) * COMMUNITY_WEIGHT;
  const den = hostScores.length * HOST_WEIGHT + communityScores.length * COMMUNITY_WEIGHT;
  if (den === 0) return null;
  return Math.round((num / den) * 10) / 10;
}
