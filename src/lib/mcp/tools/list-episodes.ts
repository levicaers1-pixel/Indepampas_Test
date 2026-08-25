import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "list_episodes",
  title: "List podcast episodes",
  description:
    "List PAMPAS podcast episodes, newest first, with title, description, duration, topics and Spotify link.",
  inputSchema: {
    query: z.string().trim().min(1).optional().describe("Filter on words in the title or description."),
    limit: z.number().int().min(1).max(50).optional().describe("Max episodes to return (default 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, limit }) => {
    const supabase = supabaseAnon();
    let q = supabase
      .from("episodes")
      .select("spotify_id,number,season,title,description,date,duration,topics,release_date")
      .order("release_date", { ascending: false });

    if (query) q = q.or(`title.ilike.%${query}%,description.ilike.%${query}%`);

    const { data, error } = await q.limit(limit ?? 10);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    const episodes = (data ?? []).map((e) => {
      const ep = e as { spotify_id: string } & Record<string, unknown>;
      return { ...ep, spotify_url: `https://open.spotify.com/episode/${ep.spotify_id}` };
    });

    return {
      content: [{ type: "text", text: JSON.stringify(episodes, null, 2) }],
      structuredContent: { count: episodes.length, episodes },
    };
  },
});
