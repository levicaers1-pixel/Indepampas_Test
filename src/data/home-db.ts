import { supabase } from "@/integrations/supabase/client";
import { buildSlugMap, slugifyName } from "@/lib/courseSlug";

/** Courses featured in the homepage carousel, in display order. */
export const TOP_COURSE_NAMES = [
  "Royal Ternesse Golf Club",
  "Royal Antwerp Golf Club",
  "Royal Ostend Golf Club",
];

export type TopRating = {
  host_score: number;
  host?: string | null;
  one_word?: string | null;
  review?: string | null;
};

export type TopCourse = {
  id: string;
  name: string;
  country: string;
  region: string | null;
  slug: string;
  pampasScore: number | null;
  ratings: TopRating[];
  quote: string | null;
  quoteHost: string | null;
  oneWord: string | null;
};

/** Carousel data, fetched on the server so the homepage HTML links to these course pages. */
export async function fetchTopCourses(): Promise<TopCourse[]> {
  const [{ data: topData }, { data: allCourses }] = await Promise.all([
    supabase
      .from("courses")
      .select("id,name,country,region,ratings(host_score,host,one_word,review)")
      .in("name", TOP_COURSE_NAMES),
    supabase.from("courses").select("id,name"),
  ]);
  if (!topData || !allCourses) return [];

  const slugMap = buildSlugMap(allCourses);
  return TOP_COURSE_NAMES.map((name) => {
    const c = topData.find((x) => x.name === name);
    if (!c) return null;
    const ratings = ((c.ratings ?? []) as TopRating[]).filter((r) => r.host_score != null);
    const withQuote = ratings.find((r) => r.review && r.review.trim().length > 0);
    const withWord = ratings.find((r) => r.one_word && r.one_word.trim().length > 0);
    const hostScores = ratings.map((r) => Number(r.host_score)).filter((n) => Number.isFinite(n));
    const pampasScore = hostScores.length
      ? Math.round((hostScores.reduce((s, v) => s + v, 0) / hostScores.length) * 10) / 10
      : null;
    return {
      id: c.id,
      name: c.name,
      country: c.country,
      region: c.region,
      slug: slugMap.get(c.id) ?? slugifyName(c.name),
      pampasScore,
      ratings,
      quote: withQuote?.review?.trim() ?? null,
      quoteHost: withQuote?.host ?? null,
      oneWord: withWord?.one_word?.trim() ?? null,
    } satisfies TopCourse;
  }).filter((c): c is TopCourse => c !== null);
}
