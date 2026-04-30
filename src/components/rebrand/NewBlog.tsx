import { Link } from "@tanstack/react-router";
import { posts, type Post } from "@/data/posts";

export function NewBlogIndex() {
  return (
    <>
      <div className="px-6 lg:px-14 pt-16 pb-12 border-b border-[rgba(28,61,42,0.15)] flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <p className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#7A7260] mb-4">
            Het clubhuis
          </p>
          <h1 className="font-rb-serif font-light text-[clamp(2.8rem,5vw,4.5rem)] text-[#1C3D2A] leading-none">
            <em className="italic">Blog</em>.
          </h1>
          <p className="font-rb-sans text-[0.95rem] text-[#7A7260] mt-3 max-w-xl">
            Verdiepende stukken bij de onderwerpen uit de podcast. Opinies, banenreviews, hot takes.
          </p>
        </div>
      </div>

      {posts.length === 0 ? (
        <p className="px-6 lg:px-14 py-16 font-rb-serif italic text-[#7A7260]">
          Nog geen blogposts. Binnenkort meer.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2">
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className={`block p-10 lg:p-14 border-b border-[rgba(28,61,42,0.15)] hover:bg-[#EDE6D9] transition-colors ${
                i % 2 === 0 ? "md:border-r border-[rgba(28,61,42,0.15)]" : ""
              }`}
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="font-rb-mono text-[0.55rem] tracking-[0.14em] uppercase bg-[#1C3D2A] text-[#F4EFE5] px-2.5 py-1">
                  {post.topics[0]}
                </span>
                <span className="font-rb-mono text-[0.6rem] tracking-[0.1em] text-[#7A7260]">
                  {post.date}
                </span>
              </div>
              <h2 className="font-rb-serif text-[1.7rem] text-[#1C3D2A] leading-[1.2] mb-4">
                {post.title}
              </h2>
              <p className="font-rb-sans text-[0.9rem] text-[#7A7260] leading-[1.7] mb-6">
                {post.excerpt}
              </p>
              <span className="font-rb-mono text-[0.6rem] tracking-[0.12em] uppercase text-[#1C3D2A] flex items-center gap-2">
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
          className="inline-flex items-center gap-2 font-rb-mono text-[0.6rem] tracking-[0.18em] uppercase text-[#8FBF4A] hover:text-[#1C3D2A] mb-10"
        >
          ← Terug naar de blog
        </Link>

        <div className="flex flex-wrap gap-3 items-center mb-6 font-rb-mono text-[0.6rem] tracking-[0.12em] uppercase text-[#7A7260]">
          <span>{post.date}</span>
          <span className="text-[#8FBF4A]">·</span>
          <span>{post.author}</span>
          <span className="text-[#8FBF4A]">·</span>
          <span>{post.readTime}</span>
        </div>

        <h1 className="font-rb-serif font-light text-4xl sm:text-5xl lg:text-6xl text-[#1C3D2A] leading-[1.05] mb-8">
          {post.title}
        </h1>

        <p className="font-rb-serif italic text-xl lg:text-2xl text-[#7A7260] leading-relaxed mb-12 border-l-2 border-[#8FBF4A] pl-5">
          {post.excerpt}
        </p>

        <div className="space-y-6 font-rb-sans text-base lg:text-lg leading-[1.85] text-[#18180F]">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-[rgba(28,61,42,0.15)]">
          {post.topics.map((t) => (
            <span
              key={t}
              className="font-rb-mono text-[0.55rem] tracking-[0.12em] uppercase border border-[rgba(28,61,42,0.3)] text-[#7A7260] px-2 py-0.5"
            >
              {t}
            </span>
          ))}
        </div>

        {(prev || next) && (
          <nav className="grid sm:grid-cols-2 gap-6 mt-12 pt-8 border-t border-[rgba(28,61,42,0.15)]">
            {prev ? (
              <Link to="/blog/$slug" params={{ slug: prev.slug }} className="group block">
                <span className="font-rb-mono text-[0.58rem] tracking-[0.18em] uppercase text-[#8FBF4A]">Vorige</span>
                <span className="block font-rb-serif text-xl text-[#1C3D2A] group-hover:text-[#8FBF4A] mt-1">
                  {prev.title}
                </span>
              </Link>
            ) : <span />}
            {next && (
              <Link to="/blog/$slug" params={{ slug: next.slug }} className="group block sm:text-right">
                <span className="font-rb-mono text-[0.58rem] tracking-[0.18em] uppercase text-[#8FBF4A]">Volgende</span>
                <span className="block font-rb-serif text-xl text-[#1C3D2A] group-hover:text-[#8FBF4A] mt-1">
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
