import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPostBySlug, posts } from "@/data/posts";
import { RichBlogPost } from "@/components/RichBlogPost";
import { WitbBlogPost } from "@/components/WitbBlogPost";
import { GolfMediaBlogPost } from "@/components/GolfMediaBlogPost";
import { NewBlogPost } from "@/components/rebrand/NewBlog";
import { fetchCourseIndex } from "@/data/courses-db";
import { courseLinkTargets } from "@/lib/linkCourses";
import { postIsoDate } from "@/lib/postDate";

import { SITE_URL } from "@/lib/site";


export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    // Course names mentioned in the article link to their course page; the article still
    // renders (without those links) if the database is unreachable.
    const courseLinks = post.richContent
      ? await fetchCourseIndex().then((index) => courseLinkTargets(post, index), () => [])
      : [];
    return { post, courseLinks };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) {
      return { meta: [{ title: "Post niet gevonden — PAMPAS" }] };
    }
    const url = `${SITE_URL}/blog/${post.slug}`;
    const description = post.seoDescription ?? post.excerpt;
    const published = postIsoDate(post.date);
    // First image of the article if it has one, else the site-wide social card.
    const firstImage = post.richContent?.find((b) => b.type === "image");
    const image =
      firstImage && firstImage.type === "image" && /^(\/(?!\/)|https:\/\/)/.test(firstImage.src)
        ? firstImage.src.startsWith("/")
          ? `${SITE_URL}${firstImage.src}`
          : firstImage.src
        : `${SITE_URL}/og-default.jpg`;
    const isPerson = !/pampas/i.test(post.author);
    return {
      meta: [
        { title: post.title },
        { name: "description", content: description },
        { property: "og:title", content: post.title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        ...(published ? [{ property: "article:published_time", content: published }] : []),
        { property: "og:image", content: image },
        { name: "twitter:image", content: image },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            inLanguage: "nl-BE",
            ...(published && { datePublished: published, dateModified: published }),
            image,
            author: isPerson
              ? { "@type": "Person", name: post.author }
              : { "@type": "Organization", name: "PAMPAS Podcast", url: SITE_URL },
            publisher: { "@id": `${SITE_URL}/#organization` },
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            url,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
              { "@type": "ListItem", position: 3, name: post.title, item: url },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <section className="pt-36 pb-24 px-6 lg:px-12 text-center">
      <p className="text-sage uppercase tracking-[0.3em] text-xs mb-4">404</p>
      <h1 className="font-serif text-4xl lg:text-6xl text-charcoal mb-6">
        Deze post is in de Pampas verdwenen.
      </h1>
      <Link to="/blog" className="text-sage underline underline-offset-4">
        Terug naar de blog
      </Link>
    </section>
  ),
  errorComponent: ({ error }) => (
    <section className="pt-36 pb-24 px-6 lg:px-12 text-center">
      <h1 className="font-serif text-3xl text-charcoal mb-4">Er ging iets mis</h1>
      <p className="text-charcoal/60 mb-6">{error instanceof Error ? error.message : String(error)}</p>
      <Link to="/blog" className="text-sage underline">
        Terug naar de blog
      </Link>
    </section>
  ),
  component: BlogPost,
});

function BlogPost() {
  const { post, courseLinks } = Route.useLoaderData();
  const currentIndex = posts.findIndex((p) => p.slug === post.slug);
  const prev = posts[currentIndex + 1];
  const next = posts[currentIndex - 1];

  if (post.customLayout === "witb") {
    return (
      <div className="pt-28 sm:pt-36 lg:pt-44 pb-16 px-6 lg:px-12">
        <WitbBlogPost post={post} prev={prev} next={next} />
      </div>
    );
  }

  if (post.customLayout === "golfmedia") {
    return (
      <div className="pt-28 sm:pt-36 lg:pt-44 pb-16 px-6 lg:px-12">
        <GolfMediaBlogPost post={post} prev={prev} next={next} />
      </div>
    );
  }

  if (post.richContent) {
    return (
      <div className="pt-28 sm:pt-36 lg:pt-44 pb-16 px-6 lg:px-12">
        <RichBlogPost post={post} prev={prev} next={next} courseLinks={courseLinks} />
      </div>
    );
  }

  return <NewBlogPost post={post} prev={prev} next={next} />;
}

