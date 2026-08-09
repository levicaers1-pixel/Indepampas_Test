import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { fetchCourses } from "@/data/courses-db";
import { CourseCard } from "@/components/ratings/CourseCard";
import { CommunityVote } from "@/components/ratings/CommunityVote";
import { buildSlugMap, findCourseBySlug } from "@/lib/courseSlug";

const SITE_URL = "https://www.indepampas.be";

export const Route = createFileRoute("/courses/$slug")({
  loader: async ({ params }) => {
    const courses = await fetchCourses();
    const course = findCourseBySlug(params.slug, courses);
    if (!course) throw notFound();
    return { course, all: courses };
  },
  head: ({ loaderData, params }) => {
    const c = loaderData?.course;
    const url = `${SITE_URL}/courses/${params.slug}`;
    if (!c) {
      return {
        meta: [
          { title: "Parcours niet gevonden — PAMPAS" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const scoreStr = c.pampasScore != null ? ` — Pampas Score ${c.pampasScore}/100` : "";
    const title = `${c.name}${scoreStr} — PAMPAS`;
    const location = [c.region, c.country].filter(Boolean).join(", ");
    const firstReview =
      c.ratings.find((r) => r.review)?.review ??
      `Onafhankelijke beoordeling van ${c.name}${location ? ` (${location})` : ""} door Lars, Levi & Niels.`;
    const desc = firstReview.length > 158 ? firstReview.slice(0, 155) + "…" : firstReview;

    const jsonLd: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "GolfCourse",
      name: c.name,
      url,
      ...(location && { address: location }),
      ...(c.website && { sameAs: c.website }),
      numberOfHoles: c.holes,
    };
    if (c.pampasScore != null && c.ratings.length > 0) {
      jsonLd.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: c.pampasScore,
        bestRating: 100,
        worstRating: 0,
        reviewCount: c.ratings.length,
      };
      jsonLd.review = c.ratings
        .filter((r) => r.review)
        .map((r) => ({
          "@type": "Review",
          author: { "@type": "Person", name: r.host },
          reviewRating: {
            "@type": "Rating",
            ratingValue: r.host_score,
            bestRating: 100,
            worstRating: 0,
          },
          reviewBody: r.review,
          ...(r.played_on && { datePublished: r.played_on }),
        }));
    }

    const playedDates = c.ratings.map((r) => r.played_on).filter(Boolean).sort() as string[];
    const publishedTime = playedDates[0];
    const modifiedTime = playedDates[playedDates.length - 1];
    const keywords = [
      c.name,
      "golf review",
      "Pampas Score",
      ...(c.country ? [`golf ${c.country}`] : []),
      ...(c.region ? [c.region] : []),
    ].join(", ");

    const cover = c.photos[0]?.image_url;
    if (cover) jsonLd.image = c.photos.map((p) => p.image_url);

    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { name: "keywords", content: keywords },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: "PAMPAS Podcast" },
        { property: "og:locale", content: "nl_BE" },
        ...(cover ? [{ property: "og:image", content: cover }] : []),
        { property: "article:section", content: "Golf reviews" },
        ...(publishedTime ? [{ property: "article:published_time", content: publishedTime }] : []),
        ...(modifiedTime ? [{ property: "article:modified_time", content: modifiedTime }] : []),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        ...(cover ? [{ name: "twitter:image", content: cover }] : []),
        { name: "twitter:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(jsonLd),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "Parcours", item: `${SITE_URL}/ratings` },
              { "@type": "ListItem", position: 3, name: c.name, item: url },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="px-6 lg:px-14 py-24 text-center">
      <h1 className="font-rb-serif text-3xl text-[#1C3D2A]">Parcours niet gevonden</h1>
      <p className="font-rb-sans text-[#635C4B] mt-3">
        <Link to="/ratings" className="underline">Terug naar alle parcours</Link>
      </p>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="px-6 lg:px-14 py-24 text-center">
      <h1 className="font-rb-serif text-3xl text-[#1C3D2A]">Er ging iets mis</h1>
      <p className="font-rb-sans text-[#635C4B] mt-2">{error.message}</p>
    </div>
  ),
  component: CourseDetailPage,
});

function CourseDetailPage() {
  const { course, all } = Route.useLoaderData();
  const slugMap = buildSlugMap(all);

  // Sibling nav (alphabetical, same as list default)
  const sorted = [...all].sort((a, b) => a.name.localeCompare(b.name));
  const idx = sorted.findIndex((c) => c.id === course.id);
  const prev = idx > 0 ? sorted[idx - 1] : null;
  const next = idx < sorted.length - 1 ? sorted[idx + 1] : null;

  return (
    <div className="bg-[#F4EFE5] min-h-screen">
      <div className="px-6 lg:px-14 pt-10 pb-4">
        <nav
          aria-label="Broodkruimels"
          className="font-rb-mono text-[0.6rem] tracking-[0.18em] uppercase text-[#635C4B] flex flex-wrap gap-2"
        >
          <Link to="/" className="hover:text-[#1C3D2A]">Home</Link>
          <span>/</span>
          <Link to="/ratings" className="hover:text-[#1C3D2A]">Parcours</Link>
          <span>/</span>
          <span className="text-[#1C3D2A]">{course.name}</span>
        </nav>
      </div>

      <div className="px-6 lg:px-14 pb-16">
        <CourseCard course={course} activePersona={null} autoOpen />

        <CommunityVote course={course} />

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(28,61,42,0.15)] pt-6">
          <Link
            to="/ratings"
            className="font-rb-mono text-[0.65rem] tracking-[0.18em] uppercase text-[#3D7A52] hover:text-[#1C3D2A]"
          >
            ← Alle parcours
          </Link>
          <div className="flex gap-4">
            {prev && (
              <Link
                to="/courses/$slug"
                params={{ slug: slugMap.get(prev.id)! }}
                className="font-rb-mono text-[0.65rem] tracking-[0.18em] uppercase text-[#635C4B] hover:text-[#1C3D2A]"
              >
                ← {prev.name}
              </Link>
            )}
            {next && (
              <Link
                to="/courses/$slug"
                params={{ slug: slugMap.get(next.id)! }}
                className="font-rb-mono text-[0.65rem] tracking-[0.18em] uppercase text-[#635C4B] hover:text-[#1C3D2A]"
              >
                {next.name} →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
