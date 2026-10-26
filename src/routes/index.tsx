import { createFileRoute } from "@tanstack/react-router";
import { NewHome } from "@/components/rebrand/NewHome";

import { SITE_URL } from "@/lib/site";
const HOME_DESCRIPTION =
  "Drie Belgische vrienden, achttien holes, één microfoon. Beluister PAMPAS — de podcast over Belgische golfcultuur. Wekelijks op Spotify.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PAMPAS — Belgische Golf Podcast" },
      { name: "description", content: HOME_DESCRIPTION },
      { property: "og:title", content: "PAMPAS — Belgische Golf Podcast" },
      { property: "og:description", content: HOME_DESCRIPTION },
      { property: "og:url", content: SITE_URL + "/" },
      { name: "twitter:title", content: "PAMPAS — Belgische Golf Podcast" },
      { name: "twitter:description", content: HOME_DESCRIPTION },
    ],
    links: [
      { rel: "canonical", href: SITE_URL + "/" },
      { rel: "preconnect", href: "https://open.spotify.com" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "PodcastSeries",
          name: "PAMPAS",
          description: HOME_DESCRIPTION,
          url: SITE_URL,
          inLanguage: "nl-BE",
          author: { "@type": "Organization", name: "PAMPAS Podcast" },
        }),
      },
    ],
  }),
  component: NewHome,
});
