import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "get_course_rating",
  title: "Get course rating detail",
  description:
    "Get the full PAMPAS review for one golf course: per-host criteria scores, review text, hole of the day, plus the community vote average.",
  inputSchema: {
    course: z.string().trim().min(2).describe("Course name (or part of it), e.g. 'Royal Antwerp'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ course }) => {
    const supabase = supabaseAnon();
    const { data, error } = await supabase
      .from("courses")
      .select(
        "id,name,country,region,type,greenfee,holes,website,episode_url,ratings(host,played_on,score_design,score_condition,score_challenge,score_scenery,score_facilities,score_value,score_hospitality,host_score,hole_of_day,would_return,one_word,review)",
      )
      .ilike("name", `%${course}%`)
      .limit(5);

    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const rows = data ?? [];
    if (rows.length === 0)
      return { content: [{ type: "text", text: `No course found matching "${course}".` }], isError: true };
    if (rows.length > 1)
      return {
        content: [
          {
            type: "text",
            text: `Multiple matches: ${rows.map((r) => (r as { name: string }).name).join(", ")}. Please be more specific.`,
          },
        ],
        isError: true,
      };

    const c = rows[0] as { id: string; name: string; ratings: { host_score: number }[] | null };

    const { data: votes } = await supabase
      .from("community_votes")
      .select("score")
      .eq("course_id", c.id);

    const voteScores = (votes ?? []).map((v) => Number((v as { score: number }).score));
    const communityAvg = voteScores.length
      ? Math.round((voteScores.reduce((a, b) => a + b, 0) / voteScores.length) * 10) / 10
      : null;
    const hostScores = (c.ratings ?? []).map((r) => Number(r.host_score));
    const hostAvg = hostScores.length
      ? Math.round((hostScores.reduce((a, b) => a + b, 0) / hostScores.length) * 10) / 10
      : null;

    const result = {
      ...c,
      host_score_avg: hostAvg,
      community_score_avg: communityAvg,
      community_vote_count: voteScores.length,
    };

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: { course: result },
    };
  },
});
