import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { CourseRating } from "@/data/ratings";

type Row = Tables<"course_ratings">;

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
    hostScores: { lars: r.host_lars, levi: r.host_levi, niels: r.host_niels },
    pampasScore: r.pampas_score,
    verdict: r.verdict,
    notes: r.notes,
    findings: Array.isArray(r.findings) ? (r.findings as string[]) : [],
  };
}

export async function fetchRatings(): Promise<CourseRating[]> {
  const { data, error } = await supabase
    .from("course_ratings")
    .select("*")
    .order("rank", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRow);
}
