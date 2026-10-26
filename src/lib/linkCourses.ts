import { buildSlugMap } from "@/lib/courseSlug";
import type { Post } from "@/data/posts";

/** A piece of text that should link to a course page. */
export type CourseLinkTarget = { text: string; slug: string };

export type TextSegment = string | { text: string; slug: string };

/** Names used in articles that differ from the database name. */
const ALIASES: Record<string, string> = {
  "Royal Golf Club Belgium - Ravenstein": "Royal Golf Club Belgium Ravenstein",
  "Golf de Sept Fontaines": "Golf Club de Sept Fontaines",
  "Golfclub Kampenhout": "Golf & Business Club Kampenhout",
};

const decode = (s: string) => s.replace(/&amp;/g, "&");

function postTexts(post: Post): string[] {
  return (post.richContent ?? []).flatMap((b) => (b.type === "p" || b.type === "h2" ? [decode(b.text)] : []));
}

/**
 * The course names that actually occur in this article, mapped to their course page.
 * Longest names first so "Royal Golf Club Belgium - Ravenstein" wins over shorter overlaps.
 */
export function courseLinkTargets(post: Post, courses: Array<{ id: string; name: string }>): CourseLinkTarget[] {
  const texts = postTexts(post);
  if (!texts.length) return [];
  const slugMap = buildSlugMap(courses);
  const candidates = new Map<string, string>(); // text in article → slug
  for (const c of courses) candidates.set(c.name, slugMap.get(c.id)!);
  for (const [alias, dbName] of Object.entries(ALIASES)) {
    const course = courses.find((c) => c.name === dbName);
    if (course) candidates.set(alias, slugMap.get(course.id)!);
  }
  return [...candidates.entries()]
    .filter(([text]) => texts.some((t) => matchAt(t, text, 0) >= 0))
    .map(([text, slug]) => ({ text, slug }))
    .sort((a, b) => b.text.length - a.text.length);
}

const isLetter = (ch: string | undefined) => !!ch && /[\p{L}\p{N}]/u.test(ch);

/** Index of the first whole-word occurrence of needle in text at or after `from`, else -1. */
function matchAt(text: string, needle: string, from: number): number {
  let i = text.indexOf(needle, from);
  while (i >= 0) {
    if (!isLetter(text[i - 1]) && !isLetter(text[i + needle.length])) return i;
    i = text.indexOf(needle, i + 1);
  }
  return -1;
}

/**
 * Split plain text into text and link segments. Every course is linked at most once per
 * article: `used` is shared across all calls for one article.
 */
export function linkifyText(text: string, targets: CourseLinkTarget[], used: Set<string>): TextSegment[] {
  const hits: Array<{ start: number; end: number; text: string; slug: string }> = [];
  for (const t of targets) {
    if (used.has(t.slug)) continue;
    const start = matchAt(text, t.text, 0);
    if (start < 0) continue;
    const end = start + t.text.length;
    if (hits.some((h) => start < h.end && end > h.start)) continue;
    hits.push({ start, end, text: t.text, slug: t.slug });
    used.add(t.slug);
  }
  hits.sort((a, b) => a.start - b.start);
  const out: TextSegment[] = [];
  let pos = 0;
  for (const h of hits) {
    if (h.start > pos) out.push(text.slice(pos, h.start));
    out.push({ text: text.slice(h.start, h.end), slug: h.slug });
    pos = h.end;
  }
  if (pos < text.length) out.push(text.slice(pos));
  return out;
}

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Same as linkifyText, for an HTML fragment: tags and existing links are left alone. */
export function linkifyHtml(html: string, targets: CourseLinkTarget[], used: Set<string>): string {
  if (!targets.length) return html;
  let inAnchor = 0;
  return html
    .split(/(<[^>]+>)/)
    .map((part) => {
      if (part.startsWith("<")) {
        if (/^<a[\s>]/i.test(part)) inAnchor++;
        else if (/^<\/a\s*>/i.test(part)) inAnchor = Math.max(0, inAnchor - 1);
        return part;
      }
      // Leave text with other HTML entities (&nbsp; …) untouched rather than risk double-encoding it.
      if (inAnchor || !part || /&(?!amp;)[#\w]+;/.test(part)) return part;
      const segments = linkifyText(decode(part), targets, used);
      if (segments.length === 1 && typeof segments[0] === "string") return part;
      return segments
        .map((seg) =>
          typeof seg === "string"
            ? escapeHtml(seg)
            : `<a href="/courses/${seg.slug}" class="text-[#1A3D2B] underline decoration-[#8CB84A] underline-offset-4 hover:text-[#3D7A52]">${escapeHtml(seg.text)}</a>`,
        )
        .join("");
    })
    .join("");
}
