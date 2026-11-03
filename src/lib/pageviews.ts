/**
 * Rules for the anonymous visit counter. Pure functions, shared by the browser (to decide
 * whether to send a count at all) and by the server (which re-checks everything: a count
 * request is just a POST anyone can make).
 */
export const PRODUCTION_HOST = /(^|\.)indepampas\.be$/;

const ROOTS = new Set([
  "blog",
  "afleveringen",
  "ratings",
  "courses",
  "golfbanen",
  "hosts",
  "vrienden",
  "contact",
  "privacy",
  "disclaimer",
]);
/** Roots with a detail page: /courses/<slug>. */
const DETAIL_ROOTS = new Set(["blog", "afleveringen", "ratings", "courses"]);
const SLUG = /^[a-z0-9-]{1,80}$/;

/**
 * The path to count, without query string or hash, or null for anything that is never counted
 * (the admin area, unknown pages, malformed input). Only real page shapes get through, so a
 * forged request cannot fill the table with arbitrary paths.
 */
export function countablePath(raw: string): string | null {
  const path = raw.split(/[?#]/)[0].toLowerCase().replace(/\/+$/, "") || "/";
  if (path === "/") return path;
  const parts = path.slice(1).split("/");
  if (!ROOTS.has(parts[0]) || parts.length > 2) return null;
  if (parts.length === 2 && (!DETAIL_ROOTS.has(parts[0]) || !SLUG.test(parts[1]))) return null;
  return path;
}

const SOURCE_ALIASES: [RegExp, string][] = [
  [/^google\.[a-z.]+$/, "google.com"],
  [/^(l\.|m\.)?instagram\.com$/, "instagram.com"],
  [/^(l\.|lm\.|m\.)?facebook\.com$/, "facebook.com"],
  [/^(open\.)?spotify\.com$/, "spotify.com"],
  [/^(t\.co|twitter\.com|x\.com)$/, "x.com"],
  [/^(lnkd\.in|linkedin\.com)$/, "linkedin.com"],
  [/^(com\.google\.android\.gm|mail\.google\.com)$/, "gmail.com"],
];
const SOURCE_LABEL = /^[a-z0-9.-]{1,100}$/;

/**
 * Where the visit came from, as one short label:
 * "intern" (moving around the site), a campaign tag (?utm_source=), the referring website, or "direct".
 */
export function classifySource(input: {
  internal?: boolean;
  referrer?: string;
  utm?: string;
}): string {
  if (input.internal) return "intern";
  const utm = (input.utm ?? "").trim().toLowerCase();
  if (/^[a-z0-9.-]{1,40}$/.test(utm)) return utm;
  try {
    const host = new URL(input.referrer ?? "").hostname.toLowerCase().replace(/^www\./, "");
    if (!host) return "direct";
    if (PRODUCTION_HOST.test(host)) return "intern";
    for (const [pattern, label] of SOURCE_ALIASES) if (pattern.test(host)) return label;
    return SOURCE_LABEL.test(host) ? host : "direct";
  } catch {
    return "direct";
  }
}

export function deviceOf(userAgent: string): "mobile" | "tablet" | "desktop" {
  if (
    /ipad|tablet|kindle|silk/i.test(userAgent) ||
    (/android/i.test(userAgent) && !/mobile/i.test(userAgent))
  )
    return "tablet";
  if (/mobi|iphone|ipod|android/i.test(userAgent)) return "mobile";
  return "desktop";
}

const BOT =
  /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|gtmetrix|pingdom|uptime|monitor|facebookexternalhit|whatsapp|telegram|preview|scanner|python|curl|wget|java\/|go-http|axios|node-fetch|okhttp|libwww|httpclient|ahrefs|semrush|mj12|yandex|baidu|duckduck/i;

/** Crawlers, link-preview fetchers and scripts; anything without a believable browser string. */
export const isBot = (userAgent: string) => userAgent.length < 20 || BOT.test(userAgent);

/** Two-letter country from Cloudflare (XX = unknown, T1 = Tor), "XX" for anything else. */
export const countryOf = (header: string | null) =>
  /^[A-Za-z0-9]{2}$/.test(header ?? "") ? (header as string).toUpperCase() : "XX";
