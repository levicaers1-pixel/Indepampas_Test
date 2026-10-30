import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  courseId: z.string().uuid(),
  voterId: z.string().uuid(),
  answer: z.enum(["course", "clubhouse", "no"]),
});

/**
 * "Mag je hond mee?" votes. The pawprint is only certified when enough *different*
 * visitors agree, and a voter_id costs nothing to fake, so every vote is stored with the
 * hashed IP it came from; the database counts one vote per IP per course.
 */
export const castDogVote = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const { enforceRateLimit, visitorKey } = await import("@/lib/rateLimit.server");
    await enforceRateLimit(`dog-${data.courseId}`, 10, 86400);
    await enforceRateLimit("dog", 60);

    const ipHash = await visitorKey("dog");
    if (!ipHash) throw new Error("Stemmen is tijdelijk niet beschikbaar");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.rpc("cast_dog_vote", {
      _course_id: data.courseId,
      _voter_id: data.voterId,
      _ip_hash: ipHash,
      _answer: data.answer,
    });
    if (error) {
      console.error("cast_dog_vote failed", error);
      throw new Error("Stem opslaan mislukt");
    }
    return { answer: data.answer };
  });
