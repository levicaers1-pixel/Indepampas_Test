import { Link } from "@tanstack/react-router";
import { posts, type Post } from "@/data/posts";
import { postIsoDate } from "@/lib/postDate";

export function NewBlogIndex() {
  return (
    <>
      <div className="px-6 lg:px-14 pt-16 pb-12 border-b border-[rgba(242,239,230,0.15)] flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <p className="font-rb-mono text-[0.7rem] tracking-[0.2em] uppercase text-[var(--rb-muted)] mb-4">
            Het clubhuis
          </p>
          <h1 className="font-rb-serif font-light text-[clamp(2.8rem,5vw,4.5rem)] text-[var(--rb-ink)] leading-none">
            <em className="italic">Blog</em>.
          </h1>
          <p className="font-rb-sans text-[0.95rem] text-[var(--rb-muted)] mt-3 max-w-xl">
            Verdiepende stukken bij de onderwerpen uit de podcast. Opinies, banenreviews, hot takes.
          </p>
        </div>
      </div>

      {posts.length === 0 ? (
        <p className="px-6 lg:px-14 py-16 font-rb-serif italic text-[var(--rb-muted)]">
          Nog geen blogposts. Binnenkort meer.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2">
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className={`block p-10 lg:p-14 border-b border-[rgba(242,239,230,0.15)] hover:bg-[var(--rb-surface)] transition-colors ${
                i % 2 === 0 ? "md:border-r border-[rgba(242,239,230,0.15)]" : ""
              }`}
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="font-rb-mono text-[0.7rem] tracking-[0.14em] uppercase bg-[var(--rb-surface)] text-[var(--rb-ink)] px-2.5 py-1">
                  {post.topics[0]}
                </span>
                <span className="font-rb-mono text-[0.7rem] tracking-[0.1em] text-[var(--rb-muted)]">
                  {post.date}
                </span>
              </div>
              <h2 className="font-rb-serif text-[1.7rem] text-[var(--rb-ink)] leading-[1.2] mb-4">
                {post.title}
              </h2>
              <p className="font-rb-sans text-[0.9rem] text-[var(--rb-muted)] leading-[1.7] mb-6">
                {post.excerpt}
              </p>
              <span className="font-rb-mono text-[0.7rem] tracking-[0.12em] uppercase text-[var(--rb-ink)] flex items-center gap-2">
                Lees verder →
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export function NewBlogPost({ post, prev, next }: { post: Post; prev?: Post; next?: Post }) {
  const paragraphs = post.content.split(/\n\n+/);
  return (
    <article className="px-6 lg:px-14 py-16">
      <div className="max-w-[760px] mx-auto">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 font-rb-mono text-[0.7rem] tracking-[0.18em] uppercase text-[var(--rb-lime)] hover:text-[var(--rb-ink)] mb-10"
        >
          ← Terug naar de blog
        </Link>

        <div className="flex flex-wrap gap-3 items-center mb-6 font-rb-mono text-[0.7rem] tracking-[0.12em] uppercase text-[var(--rb-muted)]">
          <time dateTime={postIsoDate(post.date)}>{post.date}</time>
          <span className="text-[var(--rb-lime)]">·</span>
          <span>{post.author}</span>
          <span className="text-[var(--rb-lime)]">·</span>
          <span>{post.readTime}</span>
        </div>

        <h1 className="font-rb-serif font-light text-4xl sm:text-5xl lg:text-6xl text-[var(--rb-ink)] leading-[1.05] mb-8">
          {post.title}
        </h1>

        <p className="font-rb-serif italic text-xl lg:text-2xl text-[var(--rb-muted)] leading-relaxed mb-12 border-l-2 border-[var(--rb-lime)] pl-5">
          {post.excerpt}
        </p>

        <div className="space-y-6 font-rb-sans text-base lg:text-lg leading-[1.85] text-[var(--rb-ink)]">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-[rgba(242,239,230,0.15)]">
          {post.topics.map((t) => (
            <span
              key={t}
              className="font-rb-mono text-[0.7rem] tracking-[0.12em] uppercase border border-[rgba(242,239,230,0.3)] text-[var(--rb-muted)] px-2 py-0.5"
            >
              {t}
            </span>
          ))}
        </div>

        {(prev || next) && (
          <nav className="grid sm:grid-cols-2 gap-6 mt-12 pt-8 border-t border-[rgba(242,239,230,0.15)]">
            {prev ? (
              <Link to="/blog/$slug" params={{ slug: prev.slug }} className="group block">
                <span className="font-rb-mono text-[0.7rem] tracking-[0.18em] uppercase text-[var(--rb-lime)]">Vorige</span>
                <span className="block font-rb-serif text-xl text-[var(--rb-ink)] group-hover:text-[var(--rb-lime)] mt-1">
                  {prev.title}
                </span>
              </Link>
            ) : <span />}
            {next && (
              <Link to="/blog/$slug" params={{ slug: next.slug }} className="group block sm:text-right">
                <span className="font-rb-mono text-[0.7rem] tracking-[0.18em] uppercase text-[var(--rb-lime)]">Volgende</span>
                <span className="block font-rb-serif text-xl text-[var(--rb-ink)] group-hover:text-[var(--rb-lime)] mt-1">
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
