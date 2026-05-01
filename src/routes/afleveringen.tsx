import { createFileRoute } from "@tanstack/react-router";
import { NewEpisodes } from "@/components/rebrand/NewEpisodes";

const SITE_URL = "https://indepampas.be";
const EPISODES_DESCRIPTION =
  "Het volledige archief van PAMPAS — de Belgische golfpodcast. Beluister elke aflevering rechtstreeks via Spotify, elke dinsdag een nieuwe episode.";

export const Route = createFileRoute("/afleveringen")({
  head: () => ({
    meta: [
      { title: "Afleveringen — PAMPAS Podcast" },
      { name: "description", content: EPISODES_DESCRIPTION },
      { property: "og:title", content: "Afleveringen — PAMPAS Podcast" },
      { property: "og:description", content: EPISODES_DESCRIPTION },
      { property: "og:url", content: SITE_URL + "/afleveringen" },
      { name: "twitter:title", content: "Afleveringen — PAMPAS Podcast" },
      { name: "twitter:description", content: EPISODES_DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/afleveringen" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Afleveringen — PAMPAS Podcast",
          description: EPISODES_DESCRIPTION,
          url: SITE_URL + "/afleveringen",
        }),
      },
    ],
  }),
  component: NewEpisodes,
});
