import { Link } from "@tanstack/react-router";
import type { CourseRating } from "@/data/ratings";

const CRITERIA: { key: keyof CourseRating["criteria"]; label: string }[] = [
  { key: "ontwerp", label: "Ontwerp & Layout" },
  { key: "onderhoud", label: "Onderhoud" },
  { key: "uitdaging", label: "Uitdaging" },
  { key: "landschap", label: "Landschap & Sfeer" },
  { key: "faciliteiten", label: "Faciliteiten" },
  { key: "prijsKwaliteit", label: "Prijs-kwaliteit" },
  { key: "gastvrijheid", label: "Gastvrijheid" },
];

function tier(score: number) {
  if (score >= 80) return "Topklasse";
  if (score >= 70) return "Sterk";
  if (score >= 55) return "Degelijk";
  return "Gemiddeld";
}

export function NewRatingArticle({
  rating,
  prev,
  next,
}: {
  rating: CourseRating;
  prev?: CourseRating;
  next?: CourseRating;
}) {

  return (
    <article className="bg-[var(--rb-ground)] text-[var(--rb-ink)] -mx-6 lg:-mx-14 -mt-28 sm:-mt-36 lg:-mt-44 -mb-16 pb-16">
      {/* HERO */}
      <header className="max-w-[920px] mx-auto px-6 sm:px-12 pt-32 sm:pt-40 lg:pt-48 pb-12 border-b border-[var(--rb-rule-strong)]">
        <div className="flex items-center gap-4 mb-6 flex-wrap font-rb-mono text-[0.7rem] tracking-[0.15em] uppercase">
          <span className="text-[var(--rb-ink)] bg-[var(--rb-surface)] px-3 py-1.5">
            Rating #{String(rating.rank).padStart(2, "0")}
          </span>
          <span className="text-[var(--rb-dim)]">{rating.region}</span>
          <span className="text-[var(--rb-dim)]">·</span>
          <span className="text-[var(--rb-dim)]">{rating.type}</span>
          {rating.playedOn && (
            <>
              <span className="text-[var(--rb-dim)]">·</span>
              <span className="text-[var(--rb-dim)]">Gespeeld {rating.playedOn}</span>
            </>
          )}
        </div>

        <h1
          className="font-serif font-bold leading-[1.05] text-[var(--rb-ink)] mb-6"
          style={{
            fontFamily: "'Archivo', ui-sans-serif, system-ui, sans-serif",
            fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
          }}
        >
          {rating.name}
        </h1>

        <p
          className="italic text-[var(--rb-dim)] max-w-[640px] mb-10 leading-[1.6]"
          style={{
            fontFamily: "'Archivo', ui-sans-serif, system-ui, sans-serif",
            fontSize: "1.15rem",
          }}
        >
          {rating.notes}
        </p>

        {/* SCORE BLOCK */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border border-[var(--rb-rule-strong)]">
          <div className="p-6 bg-[var(--rb-surface)] text-[var(--rb-ink)]">
            <span
              className="block font-bold leading-none mb-2"
              style={{
                fontFamily: "'Archivo', ui-sans-serif, system-ui, sans-serif",
                fontSize: "3rem",
              }}
            >
              {rating.pampasScore}
            </span>
            <span
              className="uppercase"
              style={{
                fontFamily: "'DM Mono', ui-monospace, monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
              }}
            >
              Pampas Score · {tier(rating.pampasScore)}
            </span>
          </div>
          {(
            [
              ["Lars (+0.6)", rating.hostScores.lars],
              ["Levi (3.2)", rating.hostScores.levi],
              ["Niels (2.4)", rating.hostScores.niels],
            ] as const
          ).map(([label, val]) => (
            <div key={label} className="p-6 border-l border-[var(--rb-rule-strong)]">
              <span
                className="block text-[var(--rb-ink)] font-bold leading-none mb-2"
                style={{
                  fontFamily: "'Archivo', ui-sans-serif, system-ui, sans-serif",
                  fontSize: "2rem",
                }}
              >
                {val}
              </span>
              <span
                className="text-[var(--rb-dim)] uppercase"
                style={{
                  fontFamily: "'DM Mono', ui-monospace, monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-6 flex-wrap font-rb-mono text-[0.7rem] tracking-[0.12em] uppercase">
          <span className="text-[var(--rb-dim)]">
            Greenfee: <span className="text-[var(--rb-ink)]">€{rating.greenfee} · {rating.feeBand}</span>
          </span>
          <span className="text-[var(--rb-dim)]">
            Terugkomen?: <span className="text-[var(--rb-ink)]">{rating.verdict}</span>
          </span>
        </div>
      </header>

      {/* BODY */}
      <div className="max-w-[920px] mx-auto px-6 sm:px-12 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-12 lg:gap-16 items-start">
        <main className="min-w-0">
          <h2
            className="text-[var(--rb-ink)] font-semibold mb-4 leading-[1.25] before:content-['—'] before:text-[var(--rb-lime)] before:mr-2 before:font-normal"
            style={{
              fontFamily: "'Archivo', ui-sans-serif, system-ui, sans-serif",
              fontSize: "1.6rem",
            }}
          >
            Onze findings
          </h2>

          <ul className="space-y-5 mb-12">
            {rating.findings.map((f, i) => (
              <li
                key={i}
                className="grid grid-cols-[32px_1fr] gap-4 items-start pb-5 border-b border-[var(--rb-rule-strong)]"
              >
                <span
                  className="pt-1 text-[var(--rb-dim)] uppercase"
                  style={{
                    fontFamily: "'DM Mono', ui-monospace, monospace",
                    fontSize: "0.7rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p
                  className="text-[var(--rb-ink-2)] leading-[1.75] m-0"
                  style={{ fontSize: "1rem" }}
                >
                  {f}
                </p>
              </li>
            ))}
          </ul>

          {rating.hostDetails && (rating.hostDetails.lars || rating.hostDetails.levi || rating.hostDetails.niels) && (
            <>
              <h2
                className="text-[var(--rb-ink)] font-semibold mt-12 mb-6 leading-[1.25] before:content-['—'] before:text-[var(--rb-lime)] before:mr-2 before:font-normal"
                style={{
                  fontFamily: "'Archivo', ui-sans-serif, system-ui, sans-serif",
                  fontSize: "1.6rem",
                }}
              >
                Per host
              </h2>

              <div className="space-y-6 mb-12">
                {(
                  [
                    ["lars", "Lars", "+0.6", rating.hostScores.lars],
                    ["levi", "Levi", "3.2", rating.hostScores.levi],
                    ["niels", "Niels", "2.4", rating.hostScores.niels],
                  ] as const
                ).map(([key, name, hcp, score]) => {
                  const d = rating.hostDetails?.[key];
                  if (!d || (!d.review && !d.holeOfDay && !d.oneWord && !d.wouldReturn)) return null;
                  return (
                    <div key={key} className="border border-[var(--rb-rule-strong)] bg-[var(--rb-surface)]">
                      <div className="flex items-baseline justify-between gap-4 px-5 sm:px-6 py-3 bg-[var(--rb-surface)] text-[var(--rb-ink)]">
                        <div className="flex items-baseline gap-3">
                          <span
                            style={{
                              fontFamily: "'Archivo', ui-sans-serif, system-ui, sans-serif",
                              fontSize: "1.5rem",
                            }}
                          >
                            {name}
                          </span>
                          <span
                            className="opacity-70 uppercase"
                            style={{
                              fontFamily: "'DM Mono', ui-monospace, monospace",
                              fontSize: "0.7rem",
                              letterSpacing: "0.15em",
                            }}
                          >
                            HCP {hcp}
                          </span>
                        </div>
                        <span
                          className="tabular-nums"
                          style={{
                            fontFamily: "'Archivo', ui-sans-serif, system-ui, sans-serif",
                            fontSize: "1.6rem",
                          }}
                        >
                          {score}
                          <span className="opacity-60 text-[0.7rem] ml-1">/100</span>
                        </span>
                      </div>

                      {d.review && (
                        <p
                          className="text-[var(--rb-ink-2)] leading-[1.75] px-5 sm:px-6 pt-5"
                          style={{ fontSize: "1rem" }}
                        >
                          {d.review}
                        </p>
                      )}

                      {(d.oneWord || d.holeOfDay || d.wouldReturn) && (
                        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[var(--rb-rule-strong)] mt-5 border-t border-[var(--rb-rule-strong)]">
                          {d.oneWord && (
                            <HostMeta label="In één woord" value={d.oneWord} />
                          )}
                          {d.holeOfDay && (
                            <HostMeta label="Hole van de dag" value={d.holeOfDay} />
                          )}
                          {d.wouldReturn && (
                            <HostMeta label="Terugkomen?" value={d.wouldReturn} />
                          )}
                        </dl>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}


          <h2
            className="text-[var(--rb-ink)] font-semibold mt-10 mb-4 leading-[1.25] before:content-['—'] before:text-[var(--rb-lime)] before:mr-2 before:font-normal"
            style={{
              fontFamily: "'Archivo', ui-sans-serif, system-ui, sans-serif",
              fontSize: "1.6rem",
            }}
          >
            Score per criterium
          </h2>

          <div className="border border-[var(--rb-rule-strong)]">
            {CRITERIA.map((c, i) => {
              const val = rating.criteria[c.key];
              return (
                <div
                  key={c.key}
                  className={`grid grid-cols-[1fr_60px_120px] gap-3 sm:gap-6 items-center px-4 sm:px-6 py-3.5 ${
                    i % 2 === 0 ? "bg-[var(--rb-surface)]" : "bg-[var(--rb-surface)]"
                  }`}
                >
                  <span
                    className="text-[var(--rb-ink)]"
                    style={{
                      fontFamily: "'Archivo', ui-sans-serif, system-ui, sans-serif",
                      fontSize: "1.05rem",
                    }}
                  >
                    {c.label}
                  </span>
                  <span
                    className="text-right font-bold text-[var(--rb-ink)] tabular-nums"
                    style={{
                      fontFamily: "'Archivo', ui-sans-serif, system-ui, sans-serif",
                      fontSize: "1.3rem",
                    }}
                  >
                    {val}
                    <span className="text-[var(--rb-dim)] text-[0.7rem] ml-0.5">/10</span>
                  </span>
                  <span
                    className="block h-1.5 bg-[var(--rb-surface)] relative overflow-hidden"
                    aria-hidden
                  >
                    <span
                      className="absolute inset-y-0 left-0 bg-[var(--rb-lime)]"
                      style={{ width: `${val * 10}%` }}
                    />
                  </span>
                </div>
              );
            })}
          </div>
        </main>

        {/* SIDEBAR */}
        <aside className="hidden lg:block sticky top-28 space-y-7">
          <SidebarBlock label="Type">{rating.type}</SidebarBlock>
          <SidebarBlock label="Regio">{rating.region}</SidebarBlock>
          <SidebarBlock label="Greenfee">€{rating.greenfee} · {rating.feeBand}</SidebarBlock>
          {rating.playedOn && <SidebarBlock label="Gespeeld op">{rating.playedOn}</SidebarBlock>}
          <SidebarBlock label="Terugkomen?">{rating.verdict}</SidebarBlock>
        </aside>
      </div>

      {/* FOOTER */}
      <div className="max-w-[920px] mx-auto px-6 sm:px-12 py-10 border-t border-[var(--rb-rule-strong)] flex flex-col sm:flex-row items-center justify-between gap-6">
        <span
          className="text-[var(--rb-dim)] uppercase text-center sm:text-left"
          style={{
            fontFamily: "'DM Mono', ui-monospace, monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.1em",
          }}
        >
          PAMPAS Ratings · Vol. I — 2026
        </span>
        <Link
          to="/ratings"
          className="text-[var(--rb-ink)] uppercase px-6 py-3 border border-[rgba(242,239,230,0.3)] hover:bg-[var(--rb-surface)] hover:text-[var(--rb-ink)] transition-colors"
          style={{
            fontFamily: "'DM Mono', ui-monospace, monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.12em",
          }}
        >
          ← Terug naar ratings
        </Link>
      </div>

      {/* PREV / NEXT */}
      {(prev || next) && (
        <nav className="max-w-[920px] mx-auto px-6 sm:px-12 py-10 grid sm:grid-cols-2 gap-6 border-t border-[var(--rb-rule-strong)]">
          {prev ? (
            <Link to="/ratings/$slug" params={{ slug: prev.slug }} className="group block">
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
                {prev.name}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              to="/ratings/$slug"
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
                {next.name}
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
    <div className="pb-6 border-b border-[var(--rb-rule-strong)]">
      <div
        className="text-[var(--rb-dim)] uppercase mb-2"
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

function HostMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--rb-surface)] px-5 sm:px-6 py-4">
      <dt
        className="text-[var(--rb-dim)] uppercase mb-1.5"
        style={{
          fontFamily: "'DM Mono', ui-monospace, monospace",
          fontSize: "0.7rem",
          letterSpacing: "0.15em",
        }}
      >
        {label}
      </dt>
      <dd
        className="text-[var(--rb-ink)] m-0"
        style={{
          fontFamily: "'Archivo', ui-sans-serif, system-ui, sans-serif",
          fontSize: "1.05rem",
        }}
      >
        {value}
      </dd>
    </div>
  );
}
