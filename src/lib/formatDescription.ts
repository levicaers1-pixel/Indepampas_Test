/**
 * Spotify episode descriptions often arrive without a space after sentence
 * punctuation ("(EIGCA).We praten", "Ternesse.Verder in deze aflevering").
 * Insert the missing space, but only when the character before the punctuation
 * is a lowercase letter, digit or closing bracket/quote and the next character
 * is a capital — so abbreviations like "U.S.Open" and domains like "golf.be"
 * are left alone.
 */
export function formatDescription(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .replace(/([a-zà-ÿ0-9)\]"”’])([.!?])(?=[A-ZÀ-Þ])/g, "$1$2 ")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}
