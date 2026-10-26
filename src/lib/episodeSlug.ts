import { slugifyName } from "@/lib/courseSlug";
import type { Episode } from "@/data/episodes";

const MAX_LENGTH = 70;

function baseSlug(title: string): string {
  const full = slugifyName(title);
  if (full.length <= MAX_LENGTH) return full;
  const cut = full.slice(0, MAX_LENGTH);
  return cut.slice(0, Math.max(cut.lastIndexOf("-"), 20));
}

/**
 * Stable URL slug per episode, from its title. Titles that would collide get the
 * start of their Spotify id appended.
 */
export function buildEpisodeSlugs(list: readonly Pick<Episode, "title" | "spotifyId">[]): Map<string, string> {
  const counts = new Map<string, number>();
  for (const e of list) counts.set(baseSlug(e.title), (counts.get(baseSlug(e.title)) ?? 0) + 1);
  return new Map(
    list.map((e) => {
      const base = baseSlug(e.title) || "aflevering";
      return [e.spotifyId, (counts.get(base) ?? 0) > 1 ? `${base}-${e.spotifyId.slice(0, 6).toLowerCase()}` : base];
    }),
  );
}

/** "1u 5min" → "PT1H5M", "42 min" → "PT42M"; undefined when the format is not recognised. */
export function isoDuration(duration: string): string | undefined {
  const h = /(\d+)\s*u/.exec(duration)?.[1];
  const m = /(\d+)\s*min/.exec(duration)?.[1];
  if (!h && !m) return undefined;
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}`;
}

/** Episode release as YYYY-MM-DD (from release_date, else the dd/mm/yyyy display date). */
export function episodeIsoDate(ep: Pick<Episode, "date" | "releaseDate">): string | undefined {
  if (ep.releaseDate && /^\d{4}-\d{2}-\d{2}/.test(ep.releaseDate)) return ep.releaseDate.slice(0, 10);
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(ep.date);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : undefined;
}
