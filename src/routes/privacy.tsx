import { createFileRoute } from "@tanstack/react-router";
import { NewPrivacy } from "@/components/rebrand/NewPrivacy";

import { SITE_URL } from "@/lib/site";
const PRIVACY_DESCRIPTION =
  "Welke gegevens PAMPAS verwerkt, waarom, hoe lang en welke rechten je hebt. Geen advertentiecookies, geen Google Analytics.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacyverklaring — PAMPAS Podcast" },
      { name: "description", content: PRIVACY_DESCRIPTION },
      { property: "og:title", content: "Privacyverklaring — PAMPAS Podcast" },
      { property: "og:description", content: PRIVACY_DESCRIPTION },
      { property: "og:url", content: SITE_URL + "/privacy" },
      { name: "twitter:title", content: "Privacyverklaring — PAMPAS Podcast" },
      { name: "twitter:description", content: PRIVACY_DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/privacy" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Privacyverklaring — PAMPAS Podcast",
          description: PRIVACY_DESCRIPTION,
          url: SITE_URL + "/privacy",
        }),
      },
    ],
  }),
  component: NewPrivacy,
});
