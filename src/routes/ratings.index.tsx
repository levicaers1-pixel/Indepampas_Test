import { createFileRoute } from "@tanstack/react-router";
import { NewRatingsIndex } from "@/components/rebrand/NewRatings";

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
  component: NewRatingsIndex,
});
