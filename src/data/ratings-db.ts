import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { CourseRating, HostDetail } from "@/data/ratings";

type Row = Tables<"course_ratings">;
type CourseRow = Tables<"courses">;
type RatingRow = Tables<"ratings">;

function normalizeName(n: string) {
  return n.trim().toLowerCase().replace(/\s+/g, " ");
}

function mapRow(r: Row): CourseRating {
  return {
    slug: r.slug,
    rank: r.rank,
    name: r.name,
    region: r.region,
    type: r.type,
    greenfee: r.greenfee,
    feeBand: r.fee_band,
    playedOn: r.played_on ?? undefined,
    criteria: {
      ontwerp: r.c_ontwerp,
      onderhoud: r.c_onderhoud,
      uitdaging: r.c_uitdaging,
      landschap: r.c_landschap,
      faciliteiten: r.c_faciliteiten,
      prijsKwaliteit: r.c_prijs_kwaliteit,
      gastvrijheid: r.c_gastvrijheid,
    },
    countryCode: r.country_code,
    latitude: r.latitude,
    longitude: r.longitude,
    hostScores: { lars: r.host_lars, levi: r.host_levi, niels: r.host_niels },

    pampasScore: r.pampas_score,
    verdict: r.verdict,
    notes: r.notes,
    findings: Array.isArray(r.findings) ? (r.findings as string[]) : [],
  };
}

function toHostDetail(r: RatingRow): HostDetail {
  return {
    review: r.review,
    holeOfDay: r.hole_of_day,
    oneWord: r.one_word,
    wouldReturn: r.would_return,
  };
}

export async function fetchRatings(): Promise<CourseRating[]> {
  const [{ data: ratingsData, error: ratingsErr }, { data: coursesData, error: coursesErr }, { data: hostRatings, error: hostErr }] = await Promise.all([
    supabase.from("course_ratings").select("*").order("rank", { ascending: true }),
    supabase.from("courses").select("id,name"),
    supabase.from("ratings").select("*"),
  ]);
  if (ratingsErr) throw new Error(ratingsErr.message);
  if (coursesErr) throw new Error(coursesErr.message);
  if (hostErr) throw new Error(hostErr.message);

  // map course id -> normalized name
  const idToName = new Map<string, string>();
  (coursesData ?? []).forEach((c: Pick<CourseRow, "id" | "name">) => {
    idToName.set(c.id, normalizeName(c.name));
  });

  // group host ratings by normalized course name + host
  const byName = new Map<string, { lars?: HostDetail; levi?: HostDetail; niels?: HostDetail }>();
  (hostRatings ?? []).forEach((r: RatingRow) => {
    const name = idToName.get(r.course_id);
    if (!name) return;
    const entry = byName.get(name) ?? {};
    const host = (r.host || "").toLowerCase();
    if (host === "lars" || host === "levi" || host === "niels") {
      entry[host] = toHostDetail(r);
    }
    byName.set(name, entry);
  });

  return (ratingsData ?? []).map((r) => {
    const mapped = mapRow(r);
    const details = byName.get(normalizeName(mapped.name));
    if (details) mapped.hostDetails = details;
    return mapped;
  });
}
