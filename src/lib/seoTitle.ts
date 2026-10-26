/** Longest <title> we aim for; Google starts cutting titles off around this width. */
export const MAX_TITLE = 60;

const BRAND = "PAMPAS";

/** The first candidate that fits, else the last (shortest) one. */
function firstThatFits(candidates: string[]): string {
  return candidates.find((c) => c.length <= MAX_TITLE) ?? candidates[candidates.length - 1];
}

/** Course page title: the name stays whole, the extras are dropped from the back until it fits. */
export function courseSeoTitle(c: { name: string; region?: string | null; pampasScore?: number | null; rated: boolean }): string {
  if (c.rated && c.pampasScore != null) {
    const s = `Pampas Score ${c.pampasScore}/100`;
    return firstThatFits([
      `${c.name} — ${s} | ${BRAND}`,
      `${c.name} — ${s}`,
      `${c.name} — score ${c.pampasScore}/100 | ${BRAND}`,
      `${c.name} — score ${c.pampasScore}/100`,
      `${c.name} | ${BRAND}`,
      c.name,
    ]);
  }
  const where = c.region ? `golfbaan in ${c.region}` : "golfbaan";
  return firstThatFits([
    `${c.name} — ${where} | ${BRAND}`,
    `${c.name} — ${where}`,
    `${c.name} — golfbaan | ${BRAND}`,
    `${c.name} — golfbaan`,
    `${c.name} | ${BRAND}`,
    c.name,
  ]);
}

const TRAILING_FILLER = /[\s,;:|–—-]+(de|het|een|van|en|op|in|met|over|naar|voor|te|die|dat|of|bij|aan|om)$/i;

/** Episode titles are long sentences; keep the start, cut on a word boundary, never end on a filler word. */
export function episodeSeoTitle(title: string): string {
  const clean = title
    .replace(/\p{Extended_Pictographic}|️/gu, "")
    .replace(/\s+/g, " ")
    .trim();
  const withBrand = `${clean} | ${BRAND}`;
  if (withBrand.length <= MAX_TITLE) return withBrand;
  if (clean.length <= MAX_TITLE) return clean;

  let cut = clean.slice(0, MAX_TITLE - 1);
  cut = cut.slice(0, cut.lastIndexOf(" "));
  while (TRAILING_FILLER.test(cut)) cut = cut.replace(TRAILING_FILLER, "");
  return `${cut.replace(/[\s,;:|–—-]+$/, "")}…`;
}
