import { createFileRoute } from "@tanstack/react-router";
import { hosts } from "@/data/hosts";
import { NewHosts } from "@/components/rebrand/NewHosts";

const SITE_URL = "https://indepampas.be";
const HOSTS_DESCRIPTION =
  "Maak kennis met Lars, Levi en Niels — drie Belgische vrienden, drie handicaps, één liefde voor golf. De stemmen achter de PAMPAS podcast.";

export const Route = createFileRoute("/hosts")({
  head: () => ({
    meta: [
      { title: "De Hosts — PAMPAS Podcast" },
      { name: "description", content: HOSTS_DESCRIPTION },
      { property: "og:title", content: "De Hosts — PAMPAS Podcast" },
      { property: "og:description", content: HOSTS_DESCRIPTION },
      { property: "og:url", content: SITE_URL + "/hosts" },
      { property: "og:image", content: SITE_URL + hosts[0].image },
      { name: "twitter:title", content: "De Hosts — PAMPAS Podcast" },
      { name: "twitter:description", content: HOSTS_DESCRIPTION },
      { name: "twitter:image", content: SITE_URL + hosts[0].image },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/hosts" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "De Hosts — PAMPAS Podcast",
          description: HOSTS_DESCRIPTION,
          url: SITE_URL + "/hosts",
        }),
      },
    ],
  }),
  component: NewHosts,
});
