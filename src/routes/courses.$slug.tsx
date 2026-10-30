import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { fetchCourseById, fetchCourseIndex, type CourseIndexEntry } from "@/data/courses-db";
import { COURSE_COORDS } from "@/data/course-coords";
import { CourseHero } from "@/components/ratings/CourseHero";
import { CourseCard } from "@/components/ratings/CourseCard";
import { buildSlugMap, findCourseBySlug } from "@/lib/courseSlug";
import { courseSeoTitle } from "@/lib/seoTitle";
import { SITE_URL } from "@/lib/site";

type CourseLink = { name: string; slug: string; pampasScore: number | null };

const COUNTRY_CODES: Record<string, string> = {
  "België": "BE",
  Nederland: "NL",
  Frankrijk: "FR",
  Spanje: "ES",
  "Verenigd Koninkrijk": "GB",
};

/** Regions that have a dedicated ranking article on the blog. */
const REGION_POSTS: Record<string, { slug: string; label: string }> = {
  Antwerpen: { slug: "beste-golfbanen-antwerpen", label: "De beste golfbanen in Antwerpen" },
  Brussel: { slug: "beste-golfbanen-brussel", label: "De beste golfbanen rond Brussel" },
  "Vlaams-Brabant": { slug: "beste-golfbanen-brussel", label: "De beste golfbanen rond Brussel" },
  "Waals-Brabant": { slug: "beste-golfbanen-brussel", label: "De beste golfbanen rond Brussel" },
};

export const Route = createFileRoute("/courses/$slug")({
  // Only this course in full; everything else (neighbours, related courses) is
  // reduced to name + slug, so each page no longer embeds all 217 courses.
  loader: async ({ params }) => {
    const index = await fetchCourseIndex();
    const entry = findCourseBySlug(params.slug, index);
    if (!entry) throw notFound();
    const course = await fetchCourseById(entry.id);
    if (!course) throw notFound();

    const slugMap = buildSlugMap(index);
    const link = (c: CourseIndexEntry): CourseLink => ({ name: c.name, slug: slugMap.get(c.id)!, pampasScore: c.pampasScore });

    // Previous / next in alphabetical order (same as the list default)
    const sorted = [...index].sort((a, b) => a.name.localeCompare(b.name));
    const i = sorted.findIndex((c) => c.id === entry.id);
    const prev = i > 0 ? link(sorted[i - 1]) : null;
    const next = i < sorted.length - 1 ? link(sorted[i + 1]) : null;

    // Related: same region (best score first), or same country when the region is small
    const others = index.filter((c) => c.id !== entry.id && c.country === entry.country);
    const sameRegion = entry.region ? others.filter((c) => c.region === entry.region) : [];
    const useRegion = sameRegion.length >= 3;
    const pool = useRegion ? sameRegion : others;
    const related = [...pool]
      .sort((a, b) => (b.pampasScore ?? -1) - (a.pampasScore ?? -1) || a.name.localeCompare(b.name))
      .slice(0, 8)
      .map(link);

    return {
      course,
      prev,
      next,
      related,
      relatedLabel: useRegion ? (entry.region as string) : entry.country,
      regionCount: sameRegion.length + 1,
      regionPost: (entry.region && REGION_POSTS[entry.region]) || null,
    };
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
    const rated = c.ratings.length > 0;
    const title = courseSeoTitle({ name: c.name, region: c.region, pampasScore: c.pampasScore, rated });
    const location = [c.region, c.country].filter(Boolean).join(", ");
    // Only claim a review when there is one; unrated courses get a factual description.
    const fallbackDesc = rated
      ? `Onafhankelijke beoordeling van ${c.name}${location ? ` (${location})` : ""} door Lars, Levi & Niels.`
      : `${c.name} is een golfbaan met ${c.holes} holes${location ? ` in ${location}` : ""}${
          c.greenfee != null ? `, greenfee ca. €${c.greenfee}` : ""
        }. Nog niet beoordeeld door Lars, Levi & Niels.`;
    const firstReview = c.ratings.find((r) => r.review)?.review ?? fallbackDesc;
    const desc = firstReview.length > 158 ? firstReview.slice(0, 155) + "…" : firstReview;

    const jsonLd: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "GolfCourse",
      name: c.name,
      url,
      address: {
        "@type": "PostalAddress",
        ...(c.region && { addressRegion: c.region }),
        addressCountry: COUNTRY_CODES[c.country] ?? c.country,
      },
      ...(COURSE_COORDS[c.id] && {
        geo: { "@type": "GeoCoordinates", latitude: COURSE_COORDS[c.id].lat, longitude: COURSE_COORDS[c.id].lng },
      }),
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
      <h1 className="font-rb-serif text-3xl text-[var(--rb-ink)]">Parcours niet gevonden</h1>
      <p className="font-rb-sans text-[var(--rb-muted)] mt-3">
        <Link to="/ratings" search={{}} className="underline">Terug naar alle parcours</Link>
      </p>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="px-6 lg:px-14 py-24 text-center">
      <h1 className="font-rb-serif text-3xl text-[var(--rb-ink)]">Er ging iets mis</h1>
      <p className="font-rb-sans text-[var(--rb-muted)] mt-2">{error instanceof Error ? error.message : String(error)}</p>
    </div>
  ),
  component: CourseDetailPage,
});

function CourseDetailPage() {
  const { course, prev, next, related, relatedLabel, regionCount, regionPost } = Route.useLoaderData();
  const rated = course.ratings.length > 0;
  const location = [course.region, course.country].filter(Boolean).join(", ");

  return (
    <div className="bg-[var(--rb-ground)] min-h-screen">
      <CourseHero course={course} />

      <div className="mx-auto max-w-[1320px] px-6 pb-16 pt-10 lg:px-14">
        <CourseCard course={course} activePersona={null} autoOpen variant="page" />

        <div className="mt-12 grid gap-10 lg:grid-cols-3 border-t border-[rgba(242,239,230,0.15)] pt-10">
          <section aria-labelledby="about-heading">
            <h2 id="about-heading" className="font-rb-serif text-2xl text-[var(--rb-ink)] mb-4 !normal-case">
              Over {course.name}
            </h2>
            <p className="font-rb-sans text-sm text-[var(--rb-muted)] leading-[1.75]">
              {course.name} is een {course.type ? `${course.type.toLowerCase()}baan` : "golfbaan"} met {course.holes} holes
              {location ? ` in ${location}` : ""}.
              {course.greenfee != null ? ` De greenfee ligt rond €${course.greenfee} (indicatief, prijzen kunnen verouderd zijn).` : ""}
              {rated
                ? ` Lars, Levi en Niels speelden deze baan en gaven haar een Pampas Score van ${course.pampasScore}/100 — lees hierboven wat elke host ervan vond.`
                : " Deze baan is nog niet door Lars, Levi en Niels gespeeld; daarom staat er nog geen Pampas Score bij. Jij kan wel al een eigen score geven."}
              {course.region && regionCount > 1 ? ` Er zijn ${regionCount} golfbanen in ${course.region} in ons overzicht.` : ""}
            </p>
            {course.website && (
              <p className="mt-4">
                <a
                  href={course.website}
                  target="_blank"
                  rel="noreferrer"
                  className="font-rb-mono text-[0.7rem] tracking-[0.14em] uppercase text-[var(--rb-ink)] no-underline border-b border-[var(--rb-lime)] pb-1 hover:text-[var(--rb-lime)]"
                >
                  Website van de club →
                </a>
              </p>
            )}
          </section>

          <section aria-labelledby="related-heading" className="lg:col-span-2">
            <h2 id="related-heading" className="font-rb-serif text-2xl text-[var(--rb-ink)] mb-4 !normal-case">
              Andere golfbanen in {relatedLabel}
            </h2>
            <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-2">
              {related.map((c) => (
                <li key={c.slug} className="flex items-baseline justify-between gap-3 border-b border-[rgba(242,239,230,0.1)] pb-2">
                  <Link
                    to="/courses/$slug"
                    params={{ slug: c.slug }}
                    className="font-rb-sans text-[0.92rem] text-[var(--rb-ink)] no-underline hover:text-[var(--rb-lime)] hover:underline underline-offset-4 decoration-[var(--rb-lime)]"
                  >
                    {c.name}
                  </Link>
                  <span className="font-rb-mono text-[0.7rem] tracking-[0.06em] text-[var(--rb-muted)] shrink-0">
                    {c.pampasScore != null ? c.pampasScore : "nog niet beoordeeld"}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
              {regionPost && (
                <Link
                  to="/blog/$slug"
                  params={{ slug: regionPost.slug }}
                  className="font-rb-mono text-[0.7rem] tracking-[0.14em] uppercase text-[var(--rb-ink)] no-underline border-b border-[var(--rb-lime)] pb-1 hover:text-[var(--rb-lime)]"
                >
                  {regionPost.label} →
                </Link>
              )}
              <Link
                to="/golfbanen"
                className="font-rb-mono text-[0.7rem] tracking-[0.14em] uppercase text-[var(--rb-ink)] no-underline border-b border-[var(--rb-lime)] pb-1 hover:text-[var(--rb-lime)]"
              >
                Alle golfbanen →
              </Link>
            </div>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(242,239,230,0.15)] pt-6">
          <Link
            to="/ratings" search={{}}
            className="font-rb-mono text-[0.7rem] tracking-[0.18em] uppercase text-[var(--rb-lime)] hover:text-[var(--rb-ink)]"
          >
            ← Alle parcours
          </Link>
          <div className="flex gap-4">
            {prev && (
              <Link
                to="/courses/$slug"
                params={{ slug: prev.slug }}
                className="font-rb-mono text-[0.7rem] tracking-[0.18em] uppercase text-[var(--rb-muted)] hover:text-[var(--rb-ink)]"
              >
                ← {prev.name}
              </Link>
            )}
            {next && (
              <Link
                to="/courses/$slug"
                params={{ slug: next.slug }}
                className="font-rb-mono text-[0.7rem] tracking-[0.18em] uppercase text-[var(--rb-muted)] hover:text-[var(--rb-ink)]"
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
