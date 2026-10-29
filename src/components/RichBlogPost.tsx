import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import type { Post, RichBlock } from "@/data/posts";
import { postIsoDate } from "@/lib/postDate";
import { linkifyHtml, linkifyText, type CourseLinkTarget } from "@/lib/linkCourses";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

/**
 * Instagram's embed script (CSS + images, ~500 KB) is only fetched when the first embed
 * is about to scroll into view, so it does not slow down the start of the article.
 */
function useInstagramEmbeds(enabled: boolean) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    const process = () => window.instgrm?.Embeds.process();
    const load = () => {
      const existing = document.querySelector<HTMLScriptElement>(
        'script[src="https://www.instagram.com/embed.js"]',
      );
      if (existing) {
        process();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.onload = process;
      document.body.appendChild(script);
    };

    const target = document.querySelector("[data-lazy-embed]");
    if (!target || typeof IntersectionObserver === "undefined") {
      load();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          load();
        }
      },
      { rootMargin: "600px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled]);
}

type Props = {
  post: Post;
  prev?: Post;
  next?: Post;
  /** Course names in this article that get a link to their course page (first mention only). */
  courseLinks?: CourseLinkTarget[];
};

export function RichBlogPost({ post, prev, next, courseLinks = [] }: Props) {
  const blocks = post.richContent ?? [];
  const linked = new Set<string>();
  useInstagramEmbeds(blocks.some((b) => b.type === "embed"));

  return (
    <article className="bg-[var(--rb-ground)] text-[var(--rb-ink)] -mx-6 lg:-mx-12 -mt-28 sm:-mt-36 lg:-mt-44 -mb-16 pb-16">
      {/* HERO */}
      <header className="max-w-[860px] mx-auto px-6 sm:px-12 pt-32 sm:pt-40 lg:pt-48 pb-12 border-b border-[var(--rb-rule-strong)]">
        <div className="flex items-center gap-6 mb-8 flex-wrap">
          <span
            className="text-[0.7rem] tracking-[0.15em] uppercase text-[var(--rb-ink)] bg-[var(--rb-surface)] px-3 py-1.5"
            style={{ fontFamily: "'DM Mono', ui-monospace, monospace" }}
          >
            {post.topics[0] ?? "Blog"}
          </span>
          <span
            className="text-[0.7rem] tracking-[0.1em] text-[var(--rb-dim)] uppercase"
            style={{ fontFamily: "'DM Mono', ui-monospace, monospace" }}
          >
            <time dateTime={postIsoDate(post.date)}>{post.date}</time>&nbsp;·&nbsp;{post.readTime} lezen
          </span>
        </div>

        {post.titleHtml ? (
          <h1
            className="font-serif font-bold leading-[1.1] text-[var(--rb-ink)] mb-4 [&_em]:italic [&_em]:font-normal [&_em]:text-[var(--rb-lime)]"
            style={{
              fontFamily: "'Archivo', ui-sans-serif, system-ui, sans-serif",
              fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
            }}
            dangerouslySetInnerHTML={{ __html: post.titleHtml }}
          />
        ) : (
          <h1
            className="font-serif font-bold leading-[1.1] text-[var(--rb-ink)] mb-4"
            style={{
              fontFamily: "'Archivo', ui-sans-serif, system-ui, sans-serif",
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
              className="italic text-[var(--rb-dim)] max-w-[560px] mb-10 leading-[1.6]"
              style={{
                fontFamily: "'Archivo', ui-sans-serif, system-ui, sans-serif",
                fontSize: "1.15rem",
              }}
            >
              {subText}
            </p>
          );
        })()}

        <div className="w-12 h-0.5 bg-[var(--rb-lime)]" />
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
                  className="text-[var(--rb-ink-2)] mb-6 leading-[1.85] [&_strong]:font-semibold [&_strong]:text-[var(--rb-ink)]"
                  style={{ fontSize: "1.05rem" }}
                  dangerouslySetInnerHTML={{ __html: linkifyHtml(block.text, courseLinks, linked) }}
                />
              );
            }
            if (block.type === "h2") {
              return (
                <h2
                  key={i}
                  className="text-[var(--rb-ink)] font-semibold mt-12 mb-4 leading-[1.25] before:content-['—'] before:text-[var(--rb-lime)] before:mr-2 before:font-normal"
                  style={{
                    fontFamily: "'Archivo', ui-sans-serif, system-ui, sans-serif",
                    fontSize: "1.6rem",
                  }}
                >
                  {linkifyText(block.text, courseLinks, linked).map((seg, si) =>
                    typeof seg === "string" ? (
                      seg
                    ) : (
                      <Link
                        key={si}
                        to="/courses/$slug"
                        params={{ slug: seg.slug }}
                        className="underline decoration-[var(--rb-lime)] underline-offset-4 hover:text-[var(--rb-lime)]"
                      >
                        {seg.text}
                      </Link>
                    ),
                  )}
                </h2>
              );
            }
            if (block.type === "quote") {
              return (
                <blockquote
                  key={i}
                  className="my-12 px-8 py-8 sm:px-10 border-l-[3px] border-[var(--rb-lime)] bg-[var(--rb-surface)]"
                >
                  <p
                    className="italic text-[var(--rb-ink)] m-0 leading-[1.5]"
                    style={{
                      fontFamily: "'Archivo', ui-sans-serif, system-ui, sans-serif",
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
                  className="my-12 grid grid-cols-2 sm:grid-cols-4 border border-[var(--rb-rule-strong)] divide-x-0 sm:divide-x divide-y sm:divide-y-0 divide-[var(--rb-rule-strong)]"
                >
                  {block.items.map((s, si) => (
                    <div key={si} className="p-6 text-center">
                      <span
                        className="block text-[var(--rb-ink)] font-bold leading-none mb-2"
                        style={{
                          fontFamily: "'Archivo', ui-sans-serif, system-ui, sans-serif",
                          fontSize: "2rem",
                        }}
                      >
                        {s.num}
                      </span>
                      <span
                        className="text-[var(--rb-dim)] uppercase"
                        style={{
                          fontFamily: "'DM Mono', ui-monospace, monospace",
                          fontSize: "0.7rem",
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
                <div key={i} className="my-10 border-t border-[var(--rb-rule-strong)]">
                  {block.items.map((b, bi) => (
                    <div
                      key={bi}
                      className="grid grid-cols-[56px_1fr] gap-6 items-start py-7 border-b border-[var(--rb-rule-strong)]"
                    >
                      <div
                        className="pt-1 text-[var(--rb-dim)] uppercase"
                        style={{
                          fontFamily: "'DM Mono', ui-monospace, monospace",
                          fontSize: "0.7rem",
                          letterSpacing: "0.1em",
                        }}
                      >
                        {b.num}
                      </div>
                      <div>
                        <div
                          className="text-[var(--rb-ink)] font-medium mb-2 flex items-center gap-2.5 uppercase"
                          style={{
                            fontFamily: "'DM Mono', ui-monospace, monospace",
                            fontSize: "0.7rem",
                            letterSpacing: "0.2em",
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--rb-lime)] shrink-0" />
                          {b.title}
                        </div>
                        <p
                          className="text-[var(--rb-ink-2)] leading-[1.7]"
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
                <div key={i} className="my-12 overflow-x-auto border border-[var(--rb-rule-strong)]">
                  <table className="w-full border-collapse text-left">
                    <thead className="bg-[var(--rb-surface)] text-[var(--rb-ink)]">
                      <tr>
                        {block.headers.map((h, hi) => (
                          <th
                            key={hi}
                            className="px-4 py-3 uppercase"
                            style={{
                              fontFamily: "'DM Mono', ui-monospace, monospace",
                              fontSize: "0.7rem",
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
                          className={ri % 2 === 0 ? "bg-[var(--rb-surface)]" : "bg-[var(--rb-surface)]"}
                        >
                          {row.map((cell, ci) => (
                            <td
                              key={ci}
                              className="px-4 py-3 align-middle border-t border-[var(--rb-rule-strong)] text-[var(--rb-ink-2)]"
                              style={{
                                fontFamily:
                                  ci === 0 || ci === 2
                                    ? "'Archivo', ui-sans-serif, system-ui, sans-serif"
                                    : undefined,
                                fontSize:
                                  ci === 0 || ci === 2 ? "1.05rem" : "0.9rem",
                                fontWeight: ci === 0 ? 600 : undefined,
                                color: ci === 0 ? "#F2EFE6" : undefined,
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
                    width={block.width}
                    height={block.height}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto border border-[var(--rb-rule-strong)]"
                  />
                  {block.caption && (
                    <figcaption
                      className="mt-3 text-[var(--rb-dim)] uppercase"
                      style={{
                        fontFamily: "'DM Mono', ui-monospace, monospace",
                        fontSize: "0.7rem",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {block.caption}
                    </figcaption>
                  )}
                </figure>
              );
            }
            if (block.type === "embed") {
              return (
                <figure key={i} data-lazy-embed className="my-10 flex flex-col items-center">
                  <div
                    className="w-full max-w-[540px] [&_blockquote]:!mx-auto [&_iframe]:!mx-auto"
                    dangerouslySetInnerHTML={{ __html: block.html }}
                  />
                  {block.caption && (
                    <figcaption
                      className="mt-3 text-[var(--rb-dim)] uppercase"
                      style={{
                        fontFamily: "'DM Mono', ui-monospace, monospace",
                        fontSize: "0.7rem",
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
                  className="mt-12 pt-6 border-t border-[var(--rb-rule-strong)] text-[var(--rb-dim)] uppercase"
                  style={{
                    fontFamily: "'DM Mono', ui-monospace, monospace",
                    fontSize: "0.7rem",
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
                    className="inline-block mt-3 text-[var(--rb-ink)] uppercase border-b border-[var(--rb-lime)] pb-px"
                    style={{
                      fontFamily: "'DM Mono', ui-monospace, monospace",
                      fontSize: "0.7rem",
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
              className="text-[var(--rb-dim)] uppercase mb-3"
              style={{
                fontFamily: "'DM Mono', ui-monospace, monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
              }}
            >
              Tags
            </div>
            <div className="flex flex-wrap gap-1.5">
              {post.topics.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 border border-[var(--rb-rule-strong)] text-[var(--rb-dim)] uppercase"
                  style={{
                    fontFamily: "'DM Mono', ui-monospace, monospace",
                    fontSize: "0.7rem",
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
      <div className="max-w-[860px] mx-auto px-6 sm:px-12 py-12 border-t border-[var(--rb-rule-strong)] flex flex-col sm:flex-row items-center justify-between gap-6">
        <span
          className="text-[var(--rb-dim)] uppercase text-center sm:text-left"
          style={{
            fontFamily: "'DM Mono', ui-monospace, monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.1em",
          }}
        >
          {post.sourceName ? `Bron: ${post.sourceName}` : "PAMPAS Blog"}
        </span>
        <Link
          to="/blog"
          className="text-[var(--rb-ink)] uppercase px-6 py-3 border border-[rgba(242,239,230,0.3)] hover:bg-[var(--rb-surface)] hover:text-[var(--rb-ink)] transition-colors"
          style={{
            fontFamily: "'DM Mono', ui-monospace, monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.12em",
          }}
        >
          ← Terug naar blog
        </Link>
      </div>

      {/* PREV / NEXT */}
      {(prev || next) && (
        <nav className="max-w-[860px] mx-auto px-6 sm:px-12 py-10 grid sm:grid-cols-2 gap-6 border-t border-[var(--rb-rule-strong)]">
          {prev ? (
            <Link
              to="/blog/$slug"
              params={{ slug: prev.slug }}
              className="group block"
            >
              <span
                className="text-[var(--rb-dim)] uppercase block"
                style={{
                  fontFamily: "'DM Mono', ui-monospace, monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                }}
              >
                Vorige
              </span>
              <span
                className="block text-[var(--rb-ink)] mt-1 group-hover:text-[var(--rb-lime)] transition-colors"
                style={{
                  fontFamily: "'Archivo', ui-sans-serif, system-ui, sans-serif",
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
                className="text-[var(--rb-dim)] uppercase block"
                style={{
                  fontFamily: "'DM Mono', ui-monospace, monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                }}
              >
                Volgende
              </span>
              <span
                className="block text-[var(--rb-ink)] mt-1 group-hover:text-[var(--rb-lime)] transition-colors"
                style={{
                  fontFamily: "'Archivo', ui-sans-serif, system-ui, sans-serif",
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
    <div className="pb-8 border-b border-[var(--rb-rule-strong)]">
      <div
        className="text-[var(--rb-dim)] uppercase mb-3"
        style={{
          fontFamily: "'DM Mono', ui-monospace, monospace",
          fontSize: "0.7rem",
          letterSpacing: "0.15em",
        }}
      >
        {label}
      </div>
      <div className="text-[var(--rb-ink)] text-sm leading-[1.65]">{children}</div>
    </div>
  );
}
