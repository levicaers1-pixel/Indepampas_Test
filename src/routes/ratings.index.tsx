import { createFileRoute, ErrorComponent } from "@tanstack/react-router";
import { RatingsPage } from "@/components/ratings/RatingsPage";
import { fetchCourses } from "@/data/courses-db";

const SITE_URL = "https://indepampas.be";
const TITLE = "Parcours Beoordelingen — PAMPAS";
const DESCRIPTION =
  "Gespeeld, beoordeeld en eerlijk besproken door Lars, Levi & Niels. Vind je host en ontdek welke baan bij jou past.";

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
  loader: () => fetchCourses(),
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
  component: RatingsIndexPage,
});

function RatingsIndexPage() {
  const courses = Route.useLoaderData();
  return <RatingsPage courses={courses} />;
}
