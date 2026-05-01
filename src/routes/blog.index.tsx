import { createFileRoute } from "@tanstack/react-router";
import { NewBlogIndex } from "@/components/rebrand/NewBlog";

const SITE_URL = "https://indepampas.be";
const BLOG_DESCRIPTION =
  "De Pampas blog — verdiepende stukken, opinies en analyses bij de onderwerpen uit de Belgische golfpodcast.";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — PAMPAS Podcast" },
      { name: "description", content: BLOG_DESCRIPTION },
      { property: "og:title", content: "Blog — PAMPAS Podcast" },
      { property: "og:description", content: BLOG_DESCRIPTION },
      { property: "og:url", content: SITE_URL + "/blog" },
      { name: "twitter:title", content: "Blog — PAMPAS Podcast" },
      { name: "twitter:description", content: BLOG_DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/blog" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "PAMPAS Blog",
          description: BLOG_DESCRIPTION,
          url: SITE_URL + "/blog",
        }),
      },
    ],
  }),
  component: NewBlogIndex,
});
