import { createFileRoute } from "@tanstack/react-router";
import { NewDisclaimer } from "@/components/rebrand/NewDisclaimer";

import { SITE_URL } from "@/lib/site";
const DISCLAIMER_DESCRIPTION =
  "Wat je wel en niet van PAMPAS mag verwachten: persoonlijke meningen, community-ratings, baaninformatie, het hondenpootje en aansprakelijkheid.";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — PAMPAS Podcast" },
      { name: "description", content: DISCLAIMER_DESCRIPTION },
      { property: "og:title", content: "Disclaimer — PAMPAS Podcast" },
      { property: "og:description", content: DISCLAIMER_DESCRIPTION },
      { property: "og:url", content: SITE_URL + "/disclaimer" },
      { name: "twitter:title", content: "Disclaimer — PAMPAS Podcast" },
      { name: "twitter:description", content: DISCLAIMER_DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/disclaimer" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Disclaimer — PAMPAS Podcast",
          description: DISCLAIMER_DESCRIPTION,
          url: SITE_URL + "/disclaimer",
        }),
      },
    ],
  }),
  component: NewDisclaimer,
});
