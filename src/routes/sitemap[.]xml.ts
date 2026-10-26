import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { posts } from "@/data/posts";
import { buildSlugMap } from "@/lib/courseSlug";
import { SITE_URL } from "@/lib/site";

/**
 * Only final, indexable URLs are listed (no redirecting ones), each with a real
 * <lastmod> where we know one. Google ignores <priority> and <changefreq>, so
 * they are not emitted.
 */
interface SitemapEntry {
  path: string;
  lastmod?: string; // YYYY-MM-DD
}

type CourseRow = { id: string; name: string; updated_at?: string; ratings?: Array<{ updated_at?: string }> };

const isoDay = (v?: string | null) => (v && /^\d{4}-\d{2}-\d{2}/.test(v) ? v.slice(0, 10) : undefined);
const maxDay = (...days: Array<string | undefined>) => days.filter(Boolean).sort().pop();

/** Posts store dates as dd/mm/yyyy. */
function postDay(date: string): string | undefined {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(date);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : isoDay(date);
}

async function rest<T>(path: string): Promise<T | null> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  try {
    const res = await fetch(`${url}/rest/v1/${path}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const [courses, latestEpisode, latestGuest] = await Promise.all([
          rest<CourseRow[]>("courses?select=id,name,updated_at,ratings(updated_at)&order=name.asc"),
          rest<Array<{ release_date?: string }>>("episodes?select=release_date&order=release_date.desc&limit=1"),
          rest<Array<{ updated_at?: string }>>("guests?select=updated_at&order=updated_at.desc&limit=1"),
        ]);
        const courseList = courses ?? [];
        const slugMap = buildSlugMap(courseList);

        const courseDay = (c: CourseRow) =>
          maxDay(isoDay(c.updated_at), ...(c.ratings ?? []).map((r) => isoDay(r.updated_at)));
        const newestPost = maxDay(...posts.map((p) => postDay(p.date)));
        const newestRating = maxDay(...courseList.flatMap((c) => (c.ratings ?? []).map((r) => isoDay(r.updated_at))));

        const entries: SitemapEntry[] = [
          { path: "/", lastmod: maxDay(isoDay(latestEpisode?.[0]?.release_date), newestPost) },
          { path: "/afleveringen", lastmod: isoDay(latestEpisode?.[0]?.release_date) },
          { path: "/blog", lastmod: newestPost },
          { path: "/ratings", lastmod: newestRating },
          { path: "/hosts" },
          { path: "/vrienden", lastmod: isoDay(latestGuest?.[0]?.updated_at) },
          { path: "/contact" },
          ...posts.map((p) => ({ path: `/blog/${p.slug}`, lastmod: postDay(p.date) })),
          ...courseList.map((c) => ({ path: `/courses/${slugMap.get(c.id)!}`, lastmod: courseDay(c) })),
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${SITE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
