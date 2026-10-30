import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { castDogVote } from "@/lib/dogVotes.functions";
import { getVoterId } from "@/lib/communityVotes";

export type DogAnswer = "course" | "clubhouse" | "no";
export type DogStatus = DogAnswer | "unknown";

/** Different visitors needed before a status counts. The 75% share lives in get_dog_status(). */
export const DOG_MIN_VOTES = 3;

export const DOG_STATUS_LABEL: Record<DogAnswer, string> = {
  course: "Honden welkom op de baan",
  clubhouse: "Honden welkom in clubhuis en op het terras, niet op de baan",
  no: "Honden niet toegelaten",
};

export const DOG_ANSWER_LABEL: Record<DogAnswer, string> = {
  course: "Ja, ook op de baan",
  clubhouse: "Alleen clubhuis en terras",
  no: "Nee",
};

export type DogInfo = {
  status: DogStatus;
  /** Decided by the hosts in the admin; goes above the votes. */
  hostConfirmed: boolean;
  votesCourse: number;
  votesClubhouse: number;
  votesNo: number;
  votesTotal: number;
};

const UNKNOWN: DogInfo = {
  status: "unknown",
  hostConfirmed: false,
  votesCourse: 0,
  votesClubhouse: 0,
  votesNo: 0,
  votesTotal: 0,
};

let cache: Map<string, DogInfo> | null = null;
let inflight: Promise<Map<string, DogInfo>> | null = null;
let myVotes: Map<string, DogAnswer> | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

async function fetchStatus(): Promise<Map<string, DogInfo>> {
  const map = new Map<string, DogInfo>();
  const { data, error } = await supabase.rpc("get_dog_status");
  // The pawprints are an extra: if they cannot load, the course pages just show none.
  if (error) {
    console.error("get_dog_status failed", error.message);
    return map;
  }
  for (const r of data ?? []) {
    map.set(r.course_id, {
      status: (r.status as DogStatus) ?? "unknown",
      hostConfirmed: r.host_confirmed,
      votesCourse: r.votes_course,
      votesClubhouse: r.votes_clubhouse,
      votesNo: r.votes_no,
      votesTotal: r.votes_total,
    });
  }
  return map;
}

function loadAll(): Promise<Map<string, DogInfo>> {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = fetchStatus().then((map) => {
      cache = map;
      inflight = null;
      return map;
    });
  }
  return inflight;
}

let mineLoading = false;

async function loadMine(voterId: string) {
  // Every course card mounts this hook: only the first one asks the database.
  if (myVotes || mineLoading) return;
  mineLoading = true;
  const { data, error } = await supabase.rpc("get_my_dog_votes", { _voter_id: voterId });
  const map = new Map<string, DogAnswer>();
  if (error) console.error("get_my_dog_votes failed", error.message);
  for (const r of data ?? []) map.set(r.course_id, r.answer as DogAnswer);
  myVotes = map;
  mineLoading = false;
  notify();
}

/** Dog status and the visitor's own answer for one course. */
export function useDogInfo(courseId: string) {
  const [, setTick] = useState(0);
  const [loading, setLoading] = useState(!cache);
  const [voterId, setVoterId] = useState<string | null>(null);

  useEffect(() => {
    const id = getVoterId();
    setVoterId(id);
    const listener = () => setTick((t) => t + 1);
    listeners.add(listener);
    let active = true;
    if (id) loadMine(id);
    loadAll().then(() => {
      if (!active) return;
      setLoading(false);
      listener();
    });
    return () => {
      active = false;
      listeners.delete(listener);
    };
  }, []);

  const info = cache?.get(courseId) ?? UNKNOWN;
  const myAnswer = myVotes?.get(courseId) ?? null;

  const vote = useCallback(
    async (answer: DogAnswer) => {
      const id = voterId ?? getVoterId();
      if (!id) throw new Error("Geen voter-id beschikbaar");
      await castDogVote({ data: { courseId, voterId: id, answer } });
      if (!myVotes) myVotes = new Map();
      myVotes.set(courseId, answer);
      // The tally is one vote per visitor, worked out in the database: ask it again.
      cache = await fetchStatus();
      notify();
    },
    [courseId, voterId],
  );

  return { loading, info, myAnswer, vote };
}

/** Lookup for lists and filters: the status of any course. */
export function useDogStatuses() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.add(listener);
    loadAll().then(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return useCallback(
    (courseId: string): DogInfo => cache?.get(courseId) ?? UNKNOWN,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tick],
  );
}
