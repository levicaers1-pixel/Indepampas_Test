import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/brevo";

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  source: z.string().trim().max(120).optional(),
});

export const subscribeToBrevo = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    // 1. Always persist in our own database first, so no signup is ever lost.
    let stored = false;
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await supabaseAdmin
        .from("subscribers")
        .upsert(
          { email: data.email, source: data.source ?? "unknown" },
          { onConflict: "email", ignoreDuplicates: true },
        );
      if (!error) stored = true;
    } catch {
      stored = false;
    }

    const lovableKey = process.env.LOVABLE_API_KEY;
    const brevoKey = process.env.BREVO_API_KEY;
    if (!lovableKey || !brevoKey) {
      if (stored) return { ok: true as const, stored, brevo: false as const };
      throw new Error("Brevo connector not configured");
    }


    const res = await fetch(`${GATEWAY_URL}/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": brevoKey,
      },
      body: JSON.stringify({
        email: data.email,
        listIds: [3],
        updateEnabled: true,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      // Brevo returns 400 "Contact already exist" — treat as success since updateEnabled is true
      if (res.status === 400 && body.includes("already")) {
        return { ok: true as const, alreadySubscribed: true };
      }
      throw new Error(`Brevo error ${res.status}: ${body.slice(0, 200)}`);
    }

    return { ok: true as const };
  });
