import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { NewRatingArticle } from "@/components/rebrand/NewRatingArticle";
import { fetchRatings } from "@/data/ratings-db";
import { fetchCourses } from "@/data/courses-db";
import { buildSlugMap, findCourseBySlug } from "@/lib/courseSlug";
import { SITE_URL } from "@/lib/site";

/**
 * These legacy rating pages duplicate /courses/<slug> (same course, different
 * URL and a different score). Visitors and crawlers are sent to the course page.
 * Two courses are spelled differently in the legacy data, hence the aliases.
 */
const LEGACY_TO_COURSE_SLUG: Record<string, string> = {
  "ternesse-golf-country-club": "royal-ternesse-golf-club",
  "golf-de-rignee": "golf-de-rigenee",
};

const normalizeName = (n: string) => n.trim().toLowerCase().replace(/\s+/g, " ");

export const Route = createFileRoute("/ratings/$slug")({
  loader: async ({ params }) => {
    const [ratings, courses] = await Promise.all([fetchRatings(), fetchCourses()]);
    const idx = ratings.findIndex((r) => r.slug === params.slug);
    if (idx === -1) throw notFound();

    const course =
      findCourseBySlug(LEGACY_TO_COURSE_SLUG[params.slug] ?? "", courses) ??
      courses.find((c) => normalizeName(c.name) === normalizeName(ratings[idx].name));
    if (course) {
      throw redirect({
        to: "/courses/$slug",
        params: { slug: buildSlugMap(courses).get(course.id)! },
        statusCode: 301,
      });
    }

    return {
      rating: ratings[idx],
      prev: idx > 0 ? ratings[idx - 1] : undefined,
      next: idx < ratings.length - 1 ? ratings[idx + 1] : undefined,
    };
  },
  head: ({ loaderData }) => {
    const r = loaderData?.rating;
    if (!r) return { meta: [{ title: "Rating — PAMPAS" }] };
    const title = `${r.name} — Pampas Rating ${r.pampasScore}/100`;
    const desc = r.notes.length > 158 ? r.notes.slice(0, 155) + "…" : r.notes;
    const url = `${SITE_URL}/ratings/${r.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Review",
            itemReviewed: {
              "@type": "GolfCourse",
              name: r.name,
              address: r.region + ", België",
            },
            reviewRating: {
              "@type": "Rating",
              ratingValue: r.pampasScore,
              bestRating: 100,
              worstRating: 0,
            },
            author: { "@type": "Organization", name: "PAMPAS Podcast" },
            reviewBody: r.notes,
            url,
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="px-6 lg:px-14 py-24 text-center">
      <h1 className="font-rb-serif text-3xl text-[var(--rb-ink)]">Rating niet gevonden</h1>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="px-6 lg:px-14 py-24 text-center">
      <h1 className="font-rb-serif text-3xl text-[var(--rb-ink)]">Er ging iets mis</h1>
      <p className="font-rb-sans text-[var(--rb-muted)] mt-2">{error instanceof Error ? error.message : String(error)}</p>
    </div>
  ),
  component: RatingPage,
});

function RatingPage() {
  const { rating, prev, next } = Route.useLoaderData();
  return <NewRatingArticle rating={rating} prev={prev} next={next} />;
}
