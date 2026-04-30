import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { getPostBySlug, posts } from "@/data/posts";
import { useVersion } from "@/components/VersionToggle";
import { RichBlogPost } from "@/components/RichBlogPost";
import { WitbBlogPost } from "@/components/WitbBlogPost";
const NewBlogPost = lazy(() => import("@/components/rebrand/NewBlog").then((m) => ({ default: m.NewBlogPost })));

const SITE_URL = "https://indepampas.be";


export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) {
      return { meta: [{ title: "Post niet gevonden — PAMPAS" }] };
    }
    const url = `${SITE_URL}/blog/${post.slug}`;
    return {
      meta: [
        { title: `${post.title} — PAMPAS Blog` },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: post.excerpt },
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
            author: { "@type": "Person", name: post.author },
            url,
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
      <p className="text-charcoal/60 mb-6">{error.message}</p>
      <Link to="/blog" className="text-sage underline">
        Terug naar de blog
      </Link>
    </section>
  ),
  component: BlogPost,
});

function BlogPost() {
  const { post } = Route.useLoaderData();
  const currentIndex = posts.findIndex((p) => p.slug === post.slug);
  const prev = posts[currentIndex + 1];
  const next = posts[currentIndex - 1];
  const { version } = useVersion();

  if (post.richContent) {
    return (
      <div className="pt-28 sm:pt-36 lg:pt-44 pb-16 px-6 lg:px-12">
        <RichBlogPost post={post} prev={prev} next={next} />
      </div>
    );
  }

  if (version === "new") {
    return (
      <Suspense fallback={null}>
        <NewBlogPost post={post} prev={prev} next={next} />
      </Suspense>
    );
  }

  const paragraphs = post.content.split(/\n\n+/);

  return (
    <article className="pt-28 sm:pt-36 lg:pt-44 pb-16 px-6 lg:px-12">
      <div className="max-w-[760px] mx-auto">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-sage hover:text-charcoal transition-colors mb-10"
        >
          ← Terug naar de blog
        </Link>

        <div className="flex flex-wrap gap-3 items-center mb-6 text-xs uppercase tracking-[0.18em] text-charcoal/55">
          <span>{post.date}</span>
          <span className="text-sage">·</span>
          <span>{post.author}</span>
          <span className="text-sage">·</span>
          <span>{post.readTime}</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-charcoal mb-8">
          {post.title}
        </h1>

        <p className="font-serif italic text-xl lg:text-2xl text-charcoal/75 leading-relaxed mb-12 border-l-2 border-sage pl-5">
          {post.excerpt}
        </p>

        <div className="space-y-6 text-base lg:text-lg leading-relaxed text-charcoal/85">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-charcoal/10">
          {post.topics.map((t) => (
            <span
              key={t}
              className="text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-full border border-charcoal/15 text-charcoal/70"
            >
              {t}
            </span>
          ))}
        </div>

        {(prev || next) && (
          <nav className="grid sm:grid-cols-2 gap-6 mt-12 pt-8 border-t border-charcoal/10">
            {prev ? (
              <Link
                to="/blog/$slug"
                params={{ slug: prev.slug }}
                className="group block"
              >
                <span className="text-[10px] uppercase tracking-[0.25em] text-sage">Vorige</span>
                <span className="block font-serif text-xl text-charcoal group-hover:text-sage transition-colors mt-1">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                to="/blog/$slug"
                params={{ slug: next.slug }}
                className="group block sm:text-right"
              >
                <span className="text-[10px] uppercase tracking-[0.25em] text-sage">Volgende</span>
                <span className="block font-serif text-xl text-charcoal group-hover:text-sage transition-colors mt-1">
                  {next.title}
                </span>
              </Link>
            )}
          </nav>
        )}
      </div>
    </article>
  );
}
