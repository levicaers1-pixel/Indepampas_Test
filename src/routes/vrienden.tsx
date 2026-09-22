import { createFileRoute } from "@tanstack/react-router";
import { NewGuests } from "@/components/rebrand/NewGuests";

const SITE_URL = "https://indepampas.be";
const TITLE = "Vrienden van de show — PAMPAS Podcast";
const DESCRIPTION =
  "De gasten en vrienden van de PAMPAS podcast: pro's, clubmensen en golfvrienden die mee aan tafel schoven in het 19e hole.";

export const Route = createFileRoute("/vrienden")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL + "/vrienden" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/vrienden" }],
  }),
  component: NewGuests,
});
