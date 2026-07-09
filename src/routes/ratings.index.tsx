import { createFileRoute, ErrorComponent } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { RatingsPage } from "@/components/ratings/RatingsPage";
import { fetchCourses } from "@/data/courses-db";

const SITE_URL = "https://www.indepampas.be";
const TITLE = "Parcours Beoordelingen — PAMPAS";
const DESCRIPTION =
  "Gespeeld, beoordeeld en eerlijk besproken door Lars, Levi & Niels. Vind je host en ontdek welke baan bij jou past.";

export const ratingsSearchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  region: fallback(z.string(), "").default(""),
  country: fallback(z.string(), "").default(""),
  type: fallback(z.string(), "").default(""),
  fee: fallback(z.string(), "").default(""),
  hosts: fallback(z.string(), "").default(""), // comma-separated
  sort: fallback(z.string(), "pampas_desc").default("pampas_desc"),
  tab: fallback(z.string(), "courses").default("courses"),
});

export const Route = createFileRoute("/ratings/")({
  validateSearch: zodValidator(ratingsSearchSchema),
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
