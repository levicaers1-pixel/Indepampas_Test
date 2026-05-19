import { createFileRoute, ErrorComponent } from "@tanstack/react-router";
import { NewRatingsIndex } from "@/components/rebrand/NewRatings";
import { fetchRatings } from "@/data/ratings-db";

const SITE_URL = "https://indepampas.be";
const TITLE = "Pampas Ratings — Belgische golfbanen beoordeeld";
const DESCRIPTION =
  "Onafhankelijke parcours-beoordelingen door Lars, Levi en Niels. Gewogen PAMPAS Score per baan, eerlijk verdict.";

export const Route = createFileRoute("/ratings/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: SITE_URL + "/ratings" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/ratings" }],
  }),
  loader: () => fetchRatings(),
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
  component: RatingsIndexPage,
});

function RatingsIndexPage() {
  const ratings = Route.useLoaderData();
  return <NewRatingsIndex ratings={ratings} />;
}
