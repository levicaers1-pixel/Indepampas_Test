import { createFileRoute, ErrorComponent } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { RatingsPage } from "@/components/ratings/RatingsPage";
import { fetchCourses } from "@/data/courses-db";

import { SITE_URL } from "@/lib/site";
const TITLE = "Parcours Beoordelingen — PAMPAS";
const DESCRIPTION =
  "Gespeeld, beoordeeld en eerlijk besproken door Lars, Levi & Niels. Vind je host en ontdek welke baan bij jou past.";

export const ratingsSearchSchema = z.object({
  q: z.string().default(""),
  region: z.string().default(""),
  country: z.string().default(""),
  type: z.string().default(""),
  fee: z.string().default(""),
  hosts: z.string().default(""), // comma-separated
  sort: z.string().default("pampas_desc"),
  tab: z.string().default("courses"),
});


export const Route = createFileRoute("/ratings/")({
  validateSearch: zodValidator(ratingsSearchSchema),
  // Keep default filter values out of the URL, so /ratings is served directly
  // (200) instead of redirecting to /ratings?q=&region=&…&tab=courses.
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
