import { createFileRoute, notFound } from "@tanstack/react-router";
import { getRatingBySlug } from "@/data/ratings";
import { NewRatingArticle } from "@/components/rebrand/NewRatingArticle";

const SITE_URL = "https://indepampas.be";

export const Route = createFileRoute("/ratings/$slug")({
  loader: ({ params }) => {
    const rating = getRatingBySlug(params.slug);
    if (!rating) throw notFound();
    return { rating };
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
      <h1 className="font-rb-serif text-3xl text-[#1C3D2A]">Rating niet gevonden</h1>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="px-6 lg:px-14 py-24 text-center">
      <h1 className="font-rb-serif text-3xl text-[#1C3D2A]">Er ging iets mis</h1>
      <p className="font-rb-sans text-[#7A7260] mt-2">{error.message}</p>
    </div>
  ),
  component: RatingPage,
});

function RatingPage() {
  const { rating } = Route.useLoaderData();
  return <NewRatingArticle rating={rating} />;
}
