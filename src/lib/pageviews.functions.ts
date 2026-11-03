import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  path: z.string().max(200),
  referrer: z.string().max(500).optional(),
  utm: z.string().max(60).optional(),
  internal: z.boolean().optional(),
});

/** Anonymous visit counter, see pageviews.server.ts. A count that fails is dropped, never shown. */
export const recordPageview = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    try {
      const { countPageview } = await import("@/lib/pageviews.server");
      await countPageview(data);
    } catch (e) {
      // Over the rate limit or the database is unavailable: nothing to tell the visitor.
      console.warn("pageview not counted", e instanceof Error ? e.message : e);
    }
    return { ok: true as const };
  });
