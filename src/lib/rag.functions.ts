import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { embedText } from "./ai-gateway.server";

type CourseRow = {
  id: string;
  slug: string | null;
  name: string;
  region: string | null;
  country_code: string | null;
  type: string | null;
  greenfee: number | null;
  fee_band: string | null;
  pampas_score: number | null;
  verdict: string | null;
  notes: string | null;
  host_lars: number | null;
  host_levi: number | null;
  host_niels: number | null;
  c_ontwerp: number | null;
  c_onderhoud: number | null;
  c_uitdaging: number | null;
  c_landschap: number | null;
  c_faciliteiten: number | null;
  c_prijs_kwaliteit: number | null;
  c_gastvrijheid: number | null;
  played_on: string | null;
  findings: unknown;
};

type RatingRow = {
  id: string;
  course_id: string;
  host: string;
  host_score: number | null;
  hole_of_day: string | null;
  would_return: string | null;
  one_word: string | null;
  review: string | null;
};

function courseText(c: CourseRow): string {
  const parts: string[] = [];
  parts.push(`Baan: ${c.name}`);
  if (c.region) parts.push(`Regio: ${c.region}`);
  if (c.country_code) parts.push(`Land: ${c.country_code}`);
  if (c.type) parts.push(`Type: ${c.type}`);
  if (c.greenfee != null) parts.push(`Greenfee: €${c.greenfee} (${c.fee_band ?? ""})`);
  if (c.pampas_score != null) parts.push(`PAMPAS Score: ${c.pampas_score}/100`);
  if (c.verdict) parts.push(`Verdict: ${c.verdict}`);
  const hostScores = [
    c.host_lars != null ? `Lars ${c.host_lars}` : null,
    c.host_levi != null ? `Levi ${c.host_levi}` : null,
    c.host_niels != null ? `Niels ${c.host_niels}` : null,
  ].filter(Boolean);
  if (hostScores.length) parts.push(`Host scores: ${hostScores.join(", ")}`);
  const crits = [
    c.c_ontwerp != null ? `ontwerp ${c.c_ontwerp}` : null,
    c.c_onderhoud != null ? `onderhoud ${c.c_onderhoud}` : null,
    c.c_uitdaging != null ? `uitdaging ${c.c_uitdaging}` : null,
    c.c_landschap != null ? `landschap ${c.c_landschap}` : null,
    c.c_faciliteiten != null ? `faciliteiten ${c.c_faciliteiten}` : null,
    c.c_prijs_kwaliteit != null ? `prijs-kwaliteit ${c.c_prijs_kwaliteit}` : null,
    c.c_gastvrijheid != null ? `gastvrijheid ${c.c_gastvrijheid}` : null,
  ].filter(Boolean);
  if (crits.length) parts.push(`Criteria: ${crits.join(", ")}`);
  if (c.notes) parts.push(`Notities: ${c.notes}`);
  if (c.played_on) parts.push(`Gespeeld op: ${c.played_on}`);
  if (Array.isArray(c.findings) && c.findings.length) {
    parts.push(`Bevindingen: ${(c.findings as string[]).join(" · ")}`);
  }
  return parts.join("\n");
}

function ratingText(r: RatingRow, courseName: string): string {
  const parts: string[] = [];
  parts.push(`Review van ${r.host} over ${courseName}`);
  if (r.host_score != null) parts.push(`Score: ${r.host_score}/100`);
  if (r.one_word) parts.push(`In één woord: "${r.one_word}"`);
  if (r.would_return) parts.push(`Kom je terug? ${r.would_return}`);
  if (r.hole_of_day) parts.push(`Hole van de dag: ${r.hole_of_day}`);
  if (r.review) parts.push(`Review: ${r.review}`);
  return parts.join("\n");
}

async function assertAdmin(context: {
  supabase: import("@supabase/supabase-js").SupabaseClient;
  userId: string;
}) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden");
}

export const reindexRag = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as any);
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Fetch all courses (from view course_ratings which has aggregated data)
    const { data: courses, error: courseErr } = await supabaseAdmin
      .from("course_ratings")
      .select(
        "id, slug, name, region, country_code, type, greenfee, fee_band, pampas_score, verdict, notes, host_lars, host_levi, host_niels, c_ontwerp, c_onderhoud, c_uitdaging, c_landschap, c_faciliteiten, c_prijs_kwaliteit, c_gastvrijheid, played_on, findings",
      );
    if (courseErr) throw new Error(`Courses fetch failed: ${courseErr.message}`);

    // 2. Fetch all ratings with course name
    const { data: ratings, error: ratingErr } = await supabaseAdmin
      .from("ratings")
      .select("id, course_id, host, host_score, hole_of_day, would_return, one_word, review");
    if (ratingErr) throw new Error(`Ratings fetch failed: ${ratingErr.message}`);

    const courseById = new Map<string, CourseRow>();
    (courses ?? []).forEach((c: any) => courseById.set(c.id, c));

    // 3. Build chunks
    type Chunk = {
      source_type: "course" | "rating";
      source_id: string;
      course_slug: string | null;
      course_name: string;
      content: string;
      metadata: Record<string, unknown>;
    };
    const chunks: Chunk[] = [];

    for (const c of (courses ?? []) as CourseRow[]) {
      chunks.push({
        source_type: "course",
        source_id: c.id,
        course_slug: c.slug,
        course_name: c.name,
        content: courseText(c),
        metadata: {
          region: c.region,
          country_code: c.country_code,
          greenfee: c.greenfee,
          pampas_score: c.pampas_score,
          type: c.type,
        },
      });
    }

    for (const r of (ratings ?? []) as RatingRow[]) {
      const c = courseById.get(r.course_id);
      if (!c) continue;
      chunks.push({
        source_type: "rating",
        source_id: r.id,
        course_slug: c.slug,
        course_name: c.name,
        content: ratingText(r, c.name),
        metadata: {
          host: r.host,
          host_score: r.host_score,
          course_id: r.course_id,
        },
      });
    }

    // 4. Wipe existing chunks
    const { error: delErr } = await supabaseAdmin
      .from("rag_chunks")
      .delete()
      .not("id", "is", null);
    if (delErr) throw new Error(`Delete failed: ${delErr.message}`);

    // 5. Embed in batches of 96 (safe under 100 limit) and insert
    const BATCH = 64;
    let inserted = 0;
    for (let i = 0; i < chunks.length; i += BATCH) {
      const batch = chunks.slice(i, i + BATCH);
      const vectors = await embedText(
        batch.map((c) => c.content),
        apiKey,
      );
      const rows = batch.map((c, idx) => ({
        source_type: c.source_type,
        source_id: c.source_id,
        course_slug: c.course_slug,
        course_name: c.course_name,
        content: c.content,
        metadata: c.metadata,
        embedding: vectors[idx] as unknown as string,
      }));
      const { error: insErr } = await supabaseAdmin.from("rag_chunks").insert(rows);
      if (insErr) throw new Error(`Insert failed at batch ${i}: ${insErr.message}`);
      inserted += rows.length;
    }

    return { chunks: inserted, courses: courses?.length ?? 0, ratings: ratings?.length ?? 0 };
  });
