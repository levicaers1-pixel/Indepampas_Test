import { getRequest } from "@tanstack/react-start/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { enforceRateLimit } from "@/lib/rateLimit.server";
import {
  PRODUCTION_HOST,
  classifySource,
  countablePath,
  countryOf,
  deviceOf,
  isBot,
} from "@/lib/pageviews";

export type PageviewInput = { path: string; referrer?: string; utm?: string; internal?: boolean };

async function sha256Hex(text: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Counts one page view without keeping anything about the visitor. What is stored is a day
 * total per page, source, country and device. The only per-visitor value is a hash of
 * secret + date + IP + browser, used to count unique visitors per day; it changes every day
 * and the database deletes it after two days. Nothing is written for the admin area, bots,
 * other hostnames, or visitors who send Do Not Track / Global Privacy Control.
 */
export async function countPageview(data: PageviewInput): Promise<void> {
  const request = getRequest();
  if (!request) return;
  if (!PRODUCTION_HOST.test(new URL(request.url).hostname)) return;

  const headers = request.headers;
  if (headers.get("dnt") === "1" || headers.get("sec-gpc") === "1") return;

  const path = countablePath(data.path);
  const userAgent = headers.get("user-agent") ?? "";
  if (!path || isBot(userAgent)) return;

  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) return;

  await enforceRateLimit("pv", 240);

  const ip =
    headers.get("cf-connecting-ip") ?? headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  const day = new Date().toISOString().slice(0, 10);
  const { error } = await supabaseAdmin.rpc("track_pageview", {
    _path: path,
    _source: classifySource(data),
    _country: countryOf(headers.get("cf-ipcountry")),
    _device: deviceOf(userAgent),
    _visitor_hash: await sha256Hex(`${secret}:pv:${day}:${ip}:${userAgent}`),
  });
  if (error) console.error("track_pageview failed", error);
}
