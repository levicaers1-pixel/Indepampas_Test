import { getRequest } from "@tanstack/react-start/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const RATE_LIMIT_MESSAGE = "Te veel verzoeken. Probeer het later opnieuw.";

type RpcClient = {
  rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;
};

/** One key per function and visitor. The IP is hashed (with a server secret), never stored. */
export async function visitorKey(name: string): Promise<string | null> {
  const headers = getRequest()?.headers;
  const ip =
    headers?.get("cf-connecting-ip") ?? headers?.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!ip) return null;
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${secret}:${name}:${ip}`),
  );
  const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${name}:${hex}`;
}

/**
 * Throws RATE_LIMIT_MESSAGE when this visitor has made more than `max` calls to `name`
 * within the window. Fails open: if the counter itself is unavailable the call goes through,
 * so a database hiccup never blocks the forms.
 */
export async function enforceRateLimit(name: string, max: number, windowSeconds = 3600) {
  let allowed = true;
  try {
    const key = await visitorKey(name);
    if (key) {
      const { data, error } = await (supabaseAdmin as unknown as RpcClient).rpc("rate_limit_hit", {
        _key: key,
        _window_seconds: windowSeconds,
        _max: max,
      });
      if (error) console.error("rate_limit_hit failed", error);
      else allowed = data !== false;
    }
  } catch (e) {
    console.error("rate limit check failed", e);
  }
  if (!allowed) throw new Error(RATE_LIMIT_MESSAGE);
}
