import { createFileRoute, ErrorComponent } from "@tanstack/react-router";
import { ratingsSearchSchema, ratingsSearchDefaults, type RatingsSearch } from "@/lib/ratingsSearch";
import { RatingsPage } from "@/components/ratings/RatingsPage";
import { fetchCourses } from "@/data/courses-db";

import { SITE_URL } from "@/lib/site";
const TITLE = "Parcours Beoordelingen — PAMPAS";
const DESCRIPTION =
  "Gespeeld, beoordeeld en eerlijk besproken door Lars, Levi & Niels. Vind je host en ontdek welke baan bij jou past.";


export const Route = createFileRoute("/ratings/")({
  // Only non-default values are kept, so /ratings stays clean (no ?q=&region=…).
  validateSearch: (raw: Record<string, unknown>): Partial<RatingsSearch> => {
    const parsed = ratingsSearchSchema.parse(raw);
    const out: Partial<RatingsSearch> = {};
    for (const k of Object.keys(ratingsSearchDefaults) as (keyof RatingsSearch)[]) {
      if (parsed[k] !== ratingsSearchDefaults[k]) out[k] = parsed[k];
    }
    return out;
  },
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
