import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  courseId: z.string().uuid(),
  voterId: z.string().uuid(),
  score: z.number().int().min(0).max(100),
});

/**
 * Community votes go through the server so they can be rate limited per visitor:
 * a new voter_id is free to make, so the IP is the only thing a stuffing script cannot fake.
 */
export const castCommunityVote = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const { enforceRateLimit } = await import("@/lib/rateLimit.server");
    // Per course first, so one course cannot be pushed up from a single connection;
    // a whole club on the same wifi still has room for ten votes a day.
    await enforceRateLimit(`vote-${data.courseId}`, 10, 86400);
    await enforceRateLimit("vote", 120);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: score, error } = await supabaseAdmin.rpc("cast_community_vote", {
      _course_id: data.courseId,
      _voter_id: data.voterId,
      _score: data.score,
    });
    if (error) {
      console.error("cast_community_vote failed", error);
      throw new Error("Stem opslaan mislukt");
    }
    return { score: typeof score === "number" ? score : data.score };
  });
