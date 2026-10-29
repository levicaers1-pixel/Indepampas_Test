import { createFileRoute, ErrorComponent } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { RatingsPage } from "@/components/ratings/RatingsPage";
import { fetchCourses } from "@/data/courses-db";

import { SITE_URL } from "@/lib/site";
const TITLE = "Parcours Beoordelingen — PAMPAS";
const DESCRIPTION =
  "Gespeeld, beoordeeld en eerlijk besproken door Lars, Levi & Niels. Vind je host en ontdek welke baan bij jou past.";

// Every filter is optional on purpose: a schema without defaults is what keeps
// /ratings free of ?q=&region=&… (search middlewares break this route's typing).
export const ratingsSearchSchema = z.object({
  q: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  type: z.string().optional(),
  fee: z.string().optional(),
  hosts: z.string().optional(), // comma-separated
  sort: z.string().optional(),
  tab: z.string().optional(),
});


export const Route = createFileRoute("/ratings/")({
  validateSearch: zodValidator(ratingsSearchSchema),
  // Empty filters and default-valued ones are stripped by RatingsPage.update(),
  // so /ratings is served directly (200) without a ?q=&region=&… rewrite.
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
