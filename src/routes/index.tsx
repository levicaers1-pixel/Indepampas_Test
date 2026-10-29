import { createFileRoute } from "@tanstack/react-router";
import { NewHome } from "@/components/rebrand/NewHome";
import heroPhoto from "@/assets/hero-belgian-course.webp";
import { fetchEpisodes } from "@/data/episodes-db";
import { fetchCourseCount, fetchTopCourses } from "@/data/home-db";

import { SITE_URL } from "@/lib/site";
const HOME_DESCRIPTION =
  "Drie Belgische vrienden, achttien holes, één microfoon. Beluister PAMPAS — de podcast over Belgische golfcultuur. Wekelijks op Spotify.";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [episodes, topCourses, courseCount] = await Promise.all([
      fetchEpisodes(),
      fetchTopCourses(),
      fetchCourseCount().catch(() => null),
    ]);
    return { episodes, topCourses, courseCount };
  },
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
      // The hero photo is the largest element above the fold: start fetching it before React hydrates.
      { rel: "preload", as: "image", href: heroPhoto, fetchPriority: "high" },
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
          author: { "@id": `${SITE_URL}/#organization` },
          sameAs: ["https://open.spotify.com/show/37wE4nKPeQNjYLYoMFelLP"],
        }),
      },
    ],
  }),
  component: NewHome,
});
