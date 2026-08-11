import { Link } from "@tanstack/react-router";
import type { Post, RichBlock } from "@/data/posts";

type Props = {
  post: Post;
  prev?: Post;
  next?: Post;
};

export function RichBlogPost({ post, prev, next }: Props) {
  const blocks = post.richContent ?? [];

  return (
    <article className="bg-[#F2EDE4] text-[#1A1A18] -mx-6 lg:-mx-12 -mt-28 sm:-mt-36 lg:-mt-44 -mb-16 pb-16">
      {/* HERO */}
      <header className="max-w-[860px] mx-auto px-6 sm:px-12 pt-32 sm:pt-40 lg:pt-48 pb-12 border-b border-[#C8BFB0]">
        <div className="flex items-center gap-6 mb-8 flex-wrap">
          <span
            className="text-[0.6rem] tracking-[0.15em] uppercase text-[#F2EDE4] bg-[#1A3D2B] px-3 py-1.5"
            style={{ fontFamily: "'DM Mono', ui-monospace, monospace" }}
          >
            {post.topics[0] ?? "Blog"}
          </span>
          <span
            className="text-[0.65rem] tracking-[0.1em] text-[#7A7468] uppercase"
            style={{ fontFamily: "'DM Mono', ui-monospace, monospace" }}
          >
            {post.date}&nbsp;·&nbsp;{post.readTime} lezen
          </span>
        </div>

        {post.titleHtml ? (
          <h1
            className="font-serif font-bold leading-[1.1] text-[#1A3D2B] mb-4 [&_em]:italic [&_em]:font-normal [&_em]:text-[#3D7A52]"
            style={{
              fontFamily: "'Cormorant Garamond', ui-serif, Georgia, serif",
              fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
            }}
            dangerouslySetInnerHTML={{ __html: post.titleHtml }}
          />
        ) : (
          <h1
            className="font-serif font-bold leading-[1.1] text-[#1A3D2B] mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', ui-serif, Georgia, serif",
              fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
            }}
          >
            {post.title}
          </h1>
        )}

        {(() => {
          const sub = blocks.find((b) => b.type === "subtitle") as
            | Extract<RichBlock, { type: "subtitle" }>
            | undefined;
          const subText = sub?.text ?? post.excerpt;
          return (
            <p
              className="italic text-[#7A7468] max-w-[560px] mb-10 leading-[1.6]"
              style={{
                fontFamily: "'Cormorant Garamond', ui-serif, Georgia, serif",
                fontSize: "1.15rem",
              }}
            >
              {subText}
            </p>
          );
        })()}

        <div className="w-12 h-0.5 bg-[#8CB84A]" />
      </header>

      {/* ARTICLE BODY + SIDEBAR */}
      <div className="max-w-[860px] mx-auto px-6 sm:px-12 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-12 lg:gap-20 items-start">
        <main className="min-w-0">
          {blocks.map((block, i) => {
            if (block.type === "subtitle") return null; // already used in hero
            if (block.type === "p") {
              return (
                <p
                  key={i}
                  className="text-[#2E2B25] mb-6 leading-[1.85] [&_strong]:font-semibold [&_strong]:text-[#1A3D2B]"
                  style={{ fontSize: "1.05rem" }}
                  dangerouslySetInnerHTML={{ __html: block.text }}
                />
              );
            }
            if (block.type === "h2") {
              return (
                <h2
                  key={i}
                  className="text-[#1A3D2B] font-semibold mt-12 mb-4 leading-[1.25] before:content-['—'] before:text-[#8CB84A] before:mr-2 before:font-normal"
                  style={{
                    fontFamily: "'Cormorant Garamond', ui-serif, Georgia, serif",
                    fontSize: "1.6rem",
                  }}
                >
                  {block.text}
                </h2>
              );
            }
            if (block.type === "quote") {
              return (
                <blockquote
                  key={i}
                  className="my-12 px-8 py-8 sm:px-10 border-l-[3px] border-[#8CB84A] bg-[#E8E0D3]"
                >
                  <p
                    className="italic text-[#1A3D2B] m-0 leading-[1.5]"
                    style={{
                      fontFamily: "'Cormorant Garamond', ui-serif, Georgia, serif",
                      fontSize: "1.25rem",
                    }}
                  >
                    {block.text}
                  </p>
                </blockquote>
              );
            }
            if (block.type === "stats") {
              return (
                <div
                  key={i}
                  className="my-12 grid grid-cols-2 sm:grid-cols-4 border border-[#C8BFB0] divide-x-0 sm:divide-x divide-y sm:divide-y-0 divide-[#C8BFB0]"
                >
                  {block.items.map((s, si) => (
                    <div key={si} className="p-6 text-center">
                      <span
                        className="block text-[#1A3D2B] font-bold leading-none mb-2"
                        style={{
                          fontFamily: "'Cormorant Garamond', ui-serif, Georgia, serif",
                          fontSize: "2rem",
                        }}
                      >
                        {s.num}
                      </span>
                      <span
                        className="text-[#7A7468] uppercase"
                        style={{
                          fontFamily: "'DM Mono', ui-monospace, monospace",
                          fontSize: "0.55rem",
                          letterSpacing: "0.12em",
                        }}
                      >
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              );
            }
            if (block.type === "badges") {
              return (
                <div key={i} className="my-10 border-t border-[#C8BFB0]">
                  {block.items.map((b, bi) => (
                    <div
                      key={bi}
                      className="grid grid-cols-[56px_1fr] gap-6 items-start py-7 border-b border-[#C8BFB0]"
                    >
                      <div
                        className="pt-1 text-[#7A7468] uppercase"
                        style={{
                          fontFamily: "'DM Mono', ui-monospace, monospace",
                          fontSize: "0.65rem",
                          letterSpacing: "0.1em",
                        }}
                      >
                        {b.num}
                      </div>
                      <div>
                        <div
                          className="text-[#1A3D2B] font-medium mb-2 flex items-center gap-2.5 uppercase"
                          style={{
                            fontFamily: "'DM Mono', ui-monospace, monospace",
                            fontSize: "0.7rem",
                            letterSpacing: "0.2em",
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8CB84A] shrink-0" />
                          {b.title}
                        </div>
                        <p
                          className="text-[#2E2B25] leading-[1.7]"
                          style={{ fontSize: "0.95rem" }}
                        >
                          {b.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }
            if (block.type === "table") {
              return (
                <div key={i} className="my-12 overflow-x-auto border border-[#C8BFB0]">
                  <table className="w-full border-collapse text-left">
                    <thead className="bg-[#1A3D2B] text-[#F2EDE4]">
                      <tr>
                        {block.headers.map((h, hi) => (
                          <th
                            key={hi}
                            className="px-4 py-3 uppercase"
                            style={{
                              fontFamily: "'DM Mono', ui-monospace, monospace",
                              fontSize: "0.6rem",
                              letterSpacing: "0.15em",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row, ri) => (
                        <tr
                          key={ri}
                          className={ri % 2 === 0 ? "bg-[#F2EDE4]" : "bg-[#E8E0D3]"}
                        >
                          {row.map((cell, ci) => (
                            <td
                              key={ci}
                              className="px-4 py-3 align-middle border-t border-[#C8BFB0] text-[#2E2B25]"
                              style={{
                                fontFamily:
                                  ci === 0 || ci === 2
                                    ? "'Cormorant Garamond', ui-serif, Georgia, serif"
                                    : undefined,
                                fontSize:
                                  ci === 0 || ci === 2 ? "1.05rem" : "0.9rem",
                                fontWeight: ci === 0 ? 600 : undefined,
                                color: ci === 0 ? "#1A3D2B" : undefined,
                              }}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }
            if (block.type === "image") {
              return (
                <figure key={i} className="my-10 -mx-2 sm:mx-0">
                  <img
                    src={block.src}
                    alt={block.alt}
                    loading="lazy"
                    className="w-full h-auto border border-[#C8BFB0]"
                  />
                  {block.caption && (
                    <figcaption
                      className="mt-3 text-[#7A7468] uppercase"
                      style={{
                        fontFamily: "'DM Mono', ui-monospace, monospace",
                        fontSize: "0.6rem",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {block.caption}
                    </figcaption>
                  )}
                </figure>
              );
            }
            if (block.type === "source") {
              return (
                <p
                  key={i}
                  className="mt-12 pt-6 border-t border-[#C8BFB0] text-[#7A7468] uppercase"
                  style={{
                    fontFamily: "'DM Mono', ui-monospace, monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  {block.text}
                </p>
              );
            }
            return null;
          })}
        </main>

        {/* SIDEBAR */}
        <aside className="hidden lg:block sticky top-24 space-y-8">
          {post.category && (
            <SidebarBlock label="Categorie">{post.category}</SidebarBlock>
          )}
          {post.sourceName && (
            <SidebarBlock label={post.sourceLabel ?? "Bron"}>
              {post.sourceName}
              {post.sourceSubtitle && (
                <>
                  <br />
                  {post.sourceSubtitle}
                </>
              )}
              {post.sourceUrl && (
                <>
                  <br />
                  <a
                    href={post.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-3 text-[#1A3D2B] uppercase border-b border-[#8CB84A] pb-px"
                    style={{
                      fontFamily: "'DM Mono', ui-monospace, monospace",
                      fontSize: "0.6rem",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {post.sourceLinkLabel ?? "Lees origineel →"}
                  </a>
                </>
              )}
            </SidebarBlock>
          )}
          <SidebarBlock label="Leestijd">± {post.readTime}</SidebarBlock>
          <SidebarBlock label="Geschreven door">
            {post.author}
            <br />
            Vol. I · 2026
          </SidebarBlock>
          <div>
            <div
              className="text-[#7A7468] uppercase mb-3"
              style={{
                fontFamily: "'DM Mono', ui-monospace, monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.15em",
              }}
            >
              Tags
            </div>
            <div className="flex flex-wrap gap-1.5">
              {post.topics.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 border border-[#C8BFB0] text-[#7A7468] uppercase"
                  style={{
                    fontFamily: "'DM Mono', ui-monospace, monospace",
                    fontSize: "0.55rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ARTICLE FOOTER */}
      <div className="max-w-[860px] mx-auto px-6 sm:px-12 py-12 border-t border-[#C8BFB0] flex flex-col sm:flex-row items-center justify-between gap-6">
        <span
          className="text-[#7A7468] uppercase text-center sm:text-left"
          style={{
            fontFamily: "'DM Mono', ui-monospace, monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.1em",
          }}
        >
          {post.sourceName ? `Bron: ${post.sourceName}` : "PAMPAS Blog"}
        </span>
        <Link
          to="/blog"
          className="text-[#1A3D2B] uppercase px-6 py-3 border border-[#1A3D2B] hover:bg-[#1A3D2B] hover:text-[#F2EDE4] transition-colors"
          style={{
            fontFamily: "'DM Mono', ui-monospace, monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.12em",
          }}
        >
          ← Terug naar blog
        </Link>
      </div>

      {/* PREV / NEXT */}
      {(prev || next) && (
        <nav className="max-w-[860px] mx-auto px-6 sm:px-12 py-10 grid sm:grid-cols-2 gap-6 border-t border-[#C8BFB0]">
          {prev ? (
            <Link
              to="/blog/$slug"
              params={{ slug: prev.slug }}
              className="group block"
            >
              <span
                className="text-[#7A7468] uppercase block"
                style={{
                  fontFamily: "'DM Mono', ui-monospace, monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                }}
              >
                Vorige
              </span>
              <span
                className="block text-[#1A3D2B] mt-1 group-hover:text-[#3D7A52] transition-colors"
                style={{
                  fontFamily: "'Cormorant Garamond', ui-serif, Georgia, serif",
                  fontSize: "1.4rem",
                }}
              >
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
              <span
                className="text-[#7A7468] uppercase block"
                style={{
                  fontFamily: "'DM Mono', ui-monospace, monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                }}
              >
                Volgende
              </span>
              <span
                className="block text-[#1A3D2B] mt-1 group-hover:text-[#3D7A52] transition-colors"
                style={{
                  fontFamily: "'Cormorant Garamond', ui-serif, Georgia, serif",
                  fontSize: "1.4rem",
                }}
              >
                {next.title}
              </span>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}

function SidebarBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="pb-8 border-b border-[#C8BFB0]">
      <div
        className="text-[#7A7468] uppercase mb-3"
        style={{
          fontFamily: "'DM Mono', ui-monospace, monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.15em",
        }}
      >
        {label}
      </div>
      <div className="text-[#1A1A18] text-sm leading-[1.65]">{children}</div>
    </div>
  );
}
