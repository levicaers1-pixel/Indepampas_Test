import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { castVote, getVoterId } from "./communityVotes";

type VoteRow = { course_id: string; voter_id: string; score: number };

let cache: Map<string, VoteRow[]> | null = null;
let inflight: Promise<Map<string, VoteRow[]>> | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

async function loadAll(): Promise<Map<string, VoteRow[]>> {
  if (cache) return cache;
  if (!inflight) {
    inflight = (async () => {
      const { data, error } = await supabase
        .from("community_votes")
        .select("course_id,voter_id,score");
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

function applyVote(courseId: string, voterId: string, score: number) {
  if (!cache) cache = new Map();
  const list = (cache.get(courseId) ?? []).filter((r) => r.voter_id !== voterId);
  list.push({ course_id: courseId, voter_id: voterId, score });
  cache.set(courseId, list);
  notify();
}

/** Gedeelde community-stemmen per baan (één query voor alle banen). */
export function useCourseVotes(courseId: string) {
  const [, setTick] = useState(0);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState<string | null>(null);
  const [voterId, setVoterId] = useState<string | null>(null);

  useEffect(() => {
    setVoterId(getVoterId());
    const listener = () => setTick((t) => t + 1);
    listeners.add(listener);
    let active = true;
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
  const myVote = voterId ? (rows.find((r) => r.voter_id === voterId)?.score ?? null) : null;

  const vote = useCallback(
    async (score: number) => {
      const id = voterId ?? getVoterId();
      if (!id) throw new Error("Geen voter-id beschikbaar");
      const clean = await castVote(courseId, id, score);
      applyVote(courseId, id, clean);
      return clean;
    },
    [courseId, voterId],
  );

  return { loading, error, scores, myVote, vote };
}
