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
    .select("id,course_id,voter_id,score")
    .eq("course_id", courseId);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function castVote(courseId: string, voterId: string, score: number) {
  const clean = Math.max(0, Math.min(100, Math.round(score)));
  const { error } = await supabase
    .from("community_votes")
    .upsert(
      { course_id: courseId, voter_id: voterId, score: clean },
      { onConflict: "course_id,voter_id" },
    );
  if (error) throw new Error(error.message);
  return clean;
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
