import { createFileRoute, Link } from "@tanstack/react-router";
import { posts } from "@/data/posts";

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
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <section className="pt-28 sm:pt-36 lg:pt-48 pb-12 px-6 lg:px-12">
      <div className="max-w-[1200px] mx-auto">
        <p className="text-[11px] uppercase tracking-[0.3em] text-sage font-medium mb-6">
          Het Clubhuis
        </p>
        <h1 className="font-serif text-6xl lg:text-8xl leading-[0.9] tracking-tighter text-charcoal mb-8">
          Blog<span className="text-sage">.</span>
        </h1>
        <p className="text-lg lg:text-xl text-charcoal/75 max-w-2xl leading-relaxed mb-16">
          Verdiepende stukken bij de onderwerpen uit de podcast. Opinies, banenreviews, hot takes of
          soms gewoon een ludiek lijstje.
        </p>

        {posts.length === 0 ? (
          <p className="text-charcoal/60 italic">Nog geen blogposts. Binnenkort meer.</p>
        ) : (
          <ul className="divide-y divide-charcoal/10 border-y border-charcoal/10">
            {posts.map((post) => (
              <li key={post.slug} className="py-8">
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="grid grid-cols-12 gap-4 items-baseline group"
                >
                  <span className="col-span-12 sm:col-span-2 text-xs uppercase tracking-[0.18em] text-charcoal/50">
                    {post.date}
                  </span>
                  <div className="col-span-12 sm:col-span-8">
                    <h2 className="font-serif text-2xl lg:text-4xl text-charcoal group-hover:text-sage transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm lg:text-base text-charcoal/65 mt-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.topics.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-full border border-charcoal/15 text-charcoal/70"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="hidden sm:flex sm:col-span-2 justify-end text-xs uppercase tracking-[0.18em] text-charcoal/50 self-start">
                    {post.readTime}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
