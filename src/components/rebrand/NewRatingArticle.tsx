import { Link } from "@tanstack/react-router";
import type { CourseRating } from "@/data/ratings";
import { ratings } from "@/data/ratings";

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

export function NewRatingArticle({ rating }: { rating: CourseRating }) {
  const idx = ratings.findIndex((r) => r.slug === rating.slug);
  const prev = idx > 0 ? ratings[idx - 1] : undefined;
  const next = idx < ratings.length - 1 ? ratings[idx + 1] : undefined;

  return (
    <article className="bg-[#F2EDE4] text-[#1A1A18] -mx-6 lg:-mx-14 -mt-28 sm:-mt-36 lg:-mt-44 -mb-16 pb-16">
      {/* HERO */}
      <header className="max-w-[920px] mx-auto px-6 sm:px-12 pt-32 sm:pt-40 lg:pt-48 pb-12 border-b border-[#C8BFB0]">
        <div className="flex items-center gap-4 mb-6 flex-wrap font-rb-mono text-[0.6rem] tracking-[0.15em] uppercase">
          <span className="text-[#F2EDE4] bg-[#1A3D2B] px-3 py-1.5">
            Rating #{String(rating.rank).padStart(2, "0")}
          </span>
          <span className="text-[#7A7468]">{rating.region}</span>
          <span className="text-[#7A7468]">·</span>
          <span className="text-[#7A7468]">{rating.type}</span>
          {rating.playedOn && (
            <>
              <span className="text-[#7A7468]">·</span>
              <span className="text-[#7A7468]">Gespeeld {rating.playedOn}</span>
            </>
          )}
        </div>

        <h1
          className="font-serif font-bold leading-[1.05] text-[#1A3D2B] mb-6"
          style={{
            fontFamily: "'Cormorant Garamond', ui-serif, Georgia, serif",
            fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
          }}
        >
          {rating.name}
        </h1>

        <p
          className="italic text-[#7A7468] max-w-[640px] mb-10 leading-[1.6]"
          style={{
            fontFamily: "'Cormorant Garamond', ui-serif, Georgia, serif",
            fontSize: "1.15rem",
          }}
        >
          {rating.notes}
        </p>

        {/* SCORE BLOCK */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border border-[#C8BFB0]">
          <div className="p-6 bg-[#1A3D2B] text-[#F2EDE4]">
            <span
              className="block font-bold leading-none mb-2"
              style={{
                fontFamily: "'Cormorant Garamond', ui-serif, Georgia, serif",
                fontSize: "3rem",
              }}
            >
              {rating.pampasScore}
            </span>
            <span
              className="uppercase"
              style={{
                fontFamily: "'DM Mono', ui-monospace, monospace",
                fontSize: "0.55rem",
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
            <div key={label} className="p-6 border-l border-[#C8BFB0]">
              <span
                className="block text-[#1A3D2B] font-bold leading-none mb-2"
                style={{
                  fontFamily: "'Cormorant Garamond', ui-serif, Georgia, serif",
                  fontSize: "2rem",
                }}
              >
                {val}
              </span>
              <span
                className="text-[#7A7468] uppercase"
                style={{
                  fontFamily: "'DM Mono', ui-monospace, monospace",
                  fontSize: "0.55rem",
                  letterSpacing: "0.12em",
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-6 flex-wrap font-rb-mono text-[0.65rem] tracking-[0.12em] uppercase">
          <span className="text-[#7A7468]">
            Greenfee: <span className="text-[#1A3D2B]">€{rating.greenfee} · {rating.feeBand}</span>
          </span>
          <span className="text-[#7A7468]">
            Verdict: <span className="text-[#1A3D2B]">{rating.verdict}</span>
          </span>
        </div>
      </header>

      {/* BODY */}
      <div className="max-w-[920px] mx-auto px-6 sm:px-12 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-12 lg:gap-16 items-start">
        <main className="min-w-0">
          <h2
            className="text-[#1A3D2B] font-semibold mb-4 leading-[1.25] before:content-['—'] before:text-[#8CB84A] before:mr-2 before:font-normal"
            style={{
              fontFamily: "'Cormorant Garamond', ui-serif, Georgia, serif",
              fontSize: "1.6rem",
            }}
          >
            Onze findings
          </h2>

          <ul className="space-y-5 mb-12">
            {rating.findings.map((f, i) => (
              <li
                key={i}
                className="grid grid-cols-[32px_1fr] gap-4 items-start pb-5 border-b border-[#C8BFB0]"
              >
                <span
                  className="pt-1 text-[#7A7468] uppercase"
                  style={{
                    fontFamily: "'DM Mono', ui-monospace, monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p
                  className="text-[#2E2B25] leading-[1.75] m-0"
                  style={{ fontSize: "1rem" }}
                >
                  {f}
                </p>
              </li>
            ))}
          </ul>

          <h2
            className="text-[#1A3D2B] font-semibold mt-10 mb-4 leading-[1.25] before:content-['—'] before:text-[#8CB84A] before:mr-2 before:font-normal"
            style={{
              fontFamily: "'Cormorant Garamond', ui-serif, Georgia, serif",
              fontSize: "1.6rem",
            }}
          >
            Score per criterium
          </h2>

          <div className="border border-[#C8BFB0]">
            {CRITERIA.map((c, i) => {
              const val = rating.criteria[c.key];
              return (
                <div
                  key={c.key}
                  className={`grid grid-cols-[1fr_60px_120px] gap-3 sm:gap-6 items-center px-4 sm:px-6 py-3.5 ${
                    i % 2 === 0 ? "bg-[#F2EDE4]" : "bg-[#E8E0D3]"
                  }`}
                >
                  <span
                    className="text-[#1A3D2B]"
                    style={{
                      fontFamily: "'Cormorant Garamond', ui-serif, Georgia, serif",
                      fontSize: "1.05rem",
                    }}
                  >
                    {c.label}
                  </span>
                  <span
                    className="text-right font-bold text-[#1A3D2B] tabular-nums"
                    style={{
                      fontFamily: "'Cormorant Garamond', ui-serif, Georgia, serif",
                      fontSize: "1.3rem",
                    }}
                  >
                    {val}
                    <span className="text-[#7A7468] text-[0.7rem] ml-0.5">/10</span>
                  </span>
                  <span
                    className="block h-1.5 bg-[#E8E0D3] relative overflow-hidden"
                    aria-hidden
                  >
                    <span
                      className="absolute inset-y-0 left-0 bg-[#8CB84A]"
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
          <SidebarBlock label="Verdict">{rating.verdict}</SidebarBlock>
        </aside>
      </div>

      {/* FOOTER */}
      <div className="max-w-[920px] mx-auto px-6 sm:px-12 py-10 border-t border-[#C8BFB0] flex flex-col sm:flex-row items-center justify-between gap-6">
        <span
          className="text-[#7A7468] uppercase text-center sm:text-left"
          style={{
            fontFamily: "'DM Mono', ui-monospace, monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.1em",
          }}
        >
          PAMPAS Ratings · Vol. I — 2026
        </span>
        <Link
          to="/ratings"
          className="text-[#1A3D2B] uppercase px-6 py-3 border border-[#1A3D2B] hover:bg-[#1A3D2B] hover:text-[#F2EDE4] transition-colors"
          style={{
            fontFamily: "'DM Mono', ui-monospace, monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.12em",
          }}
        >
          ← Terug naar ratings
        </Link>
      </div>

      {/* PREV / NEXT */}
      {(prev || next) && (
        <nav className="max-w-[920px] mx-auto px-6 sm:px-12 py-10 grid sm:grid-cols-2 gap-6 border-t border-[#C8BFB0]">
          {prev ? (
            <Link to="/ratings/$slug" params={{ slug: prev.slug }} className="group block">
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
    <div className="pb-6 border-b border-[#C8BFB0]">
      <div
        className="text-[#7A7468] uppercase mb-2"
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
