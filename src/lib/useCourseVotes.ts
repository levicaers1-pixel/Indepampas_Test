import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { castVote, fetchMyVotes, getVoterId, weightedCommunityScore } from "./communityVotes";

type VoteRow = { id: string; course_id: string; score: number };

let cache: Map<string, VoteRow[]> | null = null;
let inflight: Promise<Map<string, VoteRow[]>> | null = null;
let myVotes: Map<string, number> | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

async function loadAll(): Promise<Map<string, VoteRow[]>> {
  if (cache) return cache;
  if (!inflight) {
    inflight = (async () => {
      const { data, error } = await supabase.from("community_votes").select("id,course_id,score");
      if (error) throw new Error(error.message);
      const map = new Map<string, VoteRow[]>();
      for (const row of (data ?? []) as VoteRow[]) {
        const list = map.get(row.course_id) ?? [];
        list.push(row);
        map.set(row.course_id, list);
      }
      cache = map;
      inflight = null;
      return map;
    })().catch((e) => {
      inflight = null;
      throw e;
    });
  }
  return inflight;
}

async function loadMine(voterId: string) {
  if (myVotes) return myVotes;
  myVotes = await fetchMyVotes(voterId);
  notify();
  return myVotes;
}

function applyVote(courseId: string, score: number, previous: number | null) {
  if (!cache) cache = new Map();
  const list = [...(cache.get(courseId) ?? [])];
  if (previous != null) {
    const idx = list.findIndex((r) => r.score === previous);
    if (idx >= 0) list.splice(idx, 1);
  }
  list.push({ id: `local-${courseId}`, course_id: courseId, score });
  cache.set(courseId, list);
  if (!myVotes) myVotes = new Map();
  myVotes.set(courseId, score);
  notify();
}

/** Gedeelde community-stemmen per baan (één query voor alle banen). */
export function useCourseVotes(courseId: string) {
  const [, setTick] = useState(0);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState<string | null>(null);
  const [voterId, setVoterId] = useState<string | null>(null);

  useEffect(() => {
    const id = getVoterId();
    setVoterId(id);
    const listener = () => setTick((t) => t + 1);
    listeners.add(listener);
    let active = true;
    if (id) loadMine(id).catch(() => undefined);
    loadAll()
      .then(() => active && setLoading(false))
      .catch((e) => {
        if (!active) return;
        setError(e instanceof Error ? e.message : "Laden mislukt");
        setLoading(false);
      })
      .finally(() => active && listener());
    return () => {
      active = false;
      listeners.delete(listener);
    };
  }, []);

  const rows = cache?.get(courseId) ?? [];
  const scores = rows.map((r) => r.score);
  const myVote = myVotes?.get(courseId) ?? null;

  const vote = useCallback(
    async (score: number) => {
      const id = voterId ?? getVoterId();
      if (!id) throw new Error("Geen voter-id beschikbaar");
      const previous = myVotes?.get(courseId) ?? null;
      const clean = await castVote(courseId, id, score);
      applyVote(courseId, clean, previous);
      return clean;
    },
    [courseId, voterId],
  );

  return { loading, error, scores, myVote, vote };
}

/**
 * Gedeelde gewogen score (hosts 10x + community 1x) voor alle banen.
 * Gebruik dit overal waar gesorteerd/gerangschikt wordt, zodat de volgorde
 * overeenkomt met het getoonde hoofdcijfer.
 */
export function useCombinedScore() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.add(listener);
    loadAll()
      .then(listener)
      .catch(() => undefined);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return useCallback(
    (course: {
      id: string;
      pampasScore: number | null;
      ratings: { host_score: number | string | null }[];
    }): number | null => {
      const communityScores = (cache?.get(course.id) ?? []).map((r) => r.score);
      const hostScores = course.ratings
        .map((r) => Number(r.host_score))
        .filter((n) => Number.isFinite(n));
      return weightedCommunityScore(hostScores, communityScores) ?? course.pampasScore;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tick],

  );
}

