import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "search_courses",
  title: "Search golf courses",
  description:
    "Search the PAMPAS golf course database by name, country, region, course type or green fee. Returns basic course info plus the average PAMPAS host score.",
  inputSchema: {
    query: z.string().trim().min(1).optional().describe("Part of the course name."),
    country: z.string().trim().min(1).optional().describe("Country, e.g. 'Belgie' or 'Nederland'."),
    region: z.string().trim().min(1).optional().describe("Region or province."),
    type: z.string().trim().min(1).optional().describe("Course type, e.g. 'links', 'parkland', 'heide'."),
    max_greenfee: z.number().positive().optional().describe("Maximum green fee in euros."),
    rated_only: z.boolean().optional().describe("Only return courses that have PAMPAS host ratings."),
    limit: z.number().int().min(1).max(100).optional().describe("Max results (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, country, region, type, max_greenfee, rated_only, limit }) => {
    const supabase = supabaseAnon();
    let q = supabase
      .from("courses")
      .select("id,name,country,region,type,greenfee,holes,website,episode_url,ratings(host,host_score)")
      .order("name");

    if (query) q = q.ilike("name", `%${query}%`);
    if (country) q = q.ilike("country", `%${country}%`);
    if (region) q = q.ilike("region", `%${region}%`);
    if (type) q = q.ilike("type", `%${type}%`);
    if (max_greenfee !== undefined) q = q.lte("greenfee", max_greenfee);

    const { data, error } = await q.limit(rated_only ? 500 : (limit ?? 20));
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    type Row = {
      id: string; name: string; country: string; region: string | null; type: string | null;
      greenfee: number | null; holes: number; website: string | null; episode_url: string | null;
      ratings: { host: string; host_score: number }[] | null;
    };

    let courses = (data as Row[] | null ?? []).map((c) => {
      const scores = (c.ratings ?? []).map((r) => Number(r.host_score));
      const avg = scores.length
        ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
        : null;
      return {
        id: c.id,
        name: c.name,
        country: c.country,
        region: c.region,
        type: c.type,
        greenfee: c.greenfee,
        holes: c.holes,
        website: c.website,
        episode_url: c.episode_url,
        host_score_avg: avg,
        host_rating_count: scores.length,
      };
    });

    if (rated_only) courses = courses.filter((c) => c.host_rating_count > 0);
    courses = courses
      .sort((a, b) => (b.host_score_avg ?? -1) - (a.host_score_avg ?? -1))
      .slice(0, limit ?? 20);

    return {
      content: [{ type: "text", text: JSON.stringify(courses, null, 2) }],
      structuredContent: { count: courses.length, courses },
    };
  },
});
