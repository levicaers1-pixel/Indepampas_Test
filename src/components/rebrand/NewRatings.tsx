import { Link } from "@tanstack/react-router";
import { ratingMethodology, type CourseRating } from "@/data/ratings";
import { CourseMap } from "@/components/CourseMap";


function tier(score: number) {
  if (score >= 80) return { label: "Topklasse", color: "#B6F04A" };
  if (score >= 70) return { label: "Sterk", color: "#6FD6A8" };
  if (score >= 55) return { label: "Degelijk", color: "#E0A23A" };
  return { label: "Gemiddeld", color: "#8FA297" };
}

export function NewRatingsIndex({ ratings }: { ratings: CourseRating[] }) {
  return (
    <>
      {/* HERO */}
      <div className="px-6 lg:px-14 pt-16 pb-12 border-b border-[rgba(242,239,230,0.15)]">
        <p className="font-rb-mono text-[0.7rem] tracking-[0.2em] uppercase text-[var(--rb-muted)] mb-4">
          Onafhankelijke beoordelingen
        </p>
        <h1 className="font-rb-serif font-light text-[clamp(2.8rem,5vw,4.5rem)] text-[var(--rb-ink)] leading-none">
          Pampas <em className="italic">Ratings</em>.
        </h1>
        <p className="font-rb-sans text-[0.95rem] text-[var(--rb-muted)] mt-3 max-w-2xl leading-[1.7]">
          Onze parcours-beoordelingen, scherp en zonder sponsoring. Drie hosts, één gewogen
          PAMPAS Score per baan, en een eerlijk verdict: <em>komen we terug?</em>
        </p>
      </div>

      {/* RATINGS TABLE */}
      <div className="px-6 lg:px-14 py-14 border-b border-[rgba(242,239,230,0.15)]">
        <h2 className="font-rb-mono text-[0.7rem] tracking-[0.2em] uppercase text-[var(--rb-ink)] mb-6">
          De ranglijst
        </h2>

        <div className="overflow-x-auto border border-[rgba(242,239,230,0.15)]">
          <table className="w-full border-collapse text-left min-w-[760px]">
            <thead className="bg-[var(--rb-surface)] text-[var(--rb-ink)]">
              <tr>
                {["#", "Parcours", "Regio", "Type", "Fee", "Score", "Terugkomen?", ""].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 font-rb-mono text-[0.7rem] tracking-[0.15em] uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ratings.map((r, i) => {
                const t = tier(r.pampasScore);
                return (
                  <tr
                    key={r.slug}
                    className={i % 2 === 0 ? "bg-[var(--rb-ground)]" : "bg-[var(--rb-surface)]"}
                  >
                    <td className="px-4 py-4 font-rb-mono text-[0.7rem] text-[var(--rb-muted)] align-middle border-t border-[rgba(242,239,230,0.12)]">
                      {String(r.rank).padStart(2, "0")}
                    </td>
                    <td className="px-4 py-4 align-middle border-t border-[rgba(242,239,230,0.12)]">
                      <Link
                        to="/ratings/$slug"
                        params={{ slug: r.slug }}
                        className="font-rb-serif text-[1.1rem] text-[var(--rb-ink)] hover:text-[var(--rb-lime)] transition-colors"
                      >
                        {r.name}
                      </Link>
                    </td>
                    <td className="px-4 py-4 align-middle border-t border-[rgba(242,239,230,0.12)] font-rb-sans text-[0.85rem] text-[var(--rb-ink-2)]">
                      {r.region}
                    </td>
                    <td className="px-4 py-4 align-middle border-t border-[rgba(242,239,230,0.12)] font-rb-sans text-[0.85rem] text-[var(--rb-ink-2)]">
                      {r.type}
                    </td>
                    <td className="px-4 py-4 align-middle border-t border-[rgba(242,239,230,0.12)] font-rb-mono text-[0.7rem] text-[var(--rb-ink-2)]">
                      {r.feeBand} <span className="text-[var(--rb-muted)]">· €{r.greenfee}</span>
                    </td>
                    <td className="px-4 py-4 align-middle border-t border-[rgba(242,239,230,0.12)]">
                      <span
                        className="inline-flex items-baseline gap-1 font-rb-serif text-[1.6rem] leading-none"
                        style={{ color: t.color }}
                      >
                        {r.pampasScore}
                        <span className="font-rb-mono text-[0.7rem] tracking-[0.15em] uppercase text-[var(--rb-muted)]">
                          /100
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-4 align-middle border-t border-[rgba(242,239,230,0.12)] font-rb-mono text-[0.7rem] tracking-[0.12em] uppercase text-[var(--rb-ink)]">
                      {r.verdict}
                    </td>
                    <td className="px-4 py-4 align-middle border-t border-[rgba(242,239,230,0.12)] text-right">
                      <Link
                        to="/ratings/$slug"
                        params={{ slug: r.slug }}
                        className="font-rb-mono text-[0.7rem] tracking-[0.15em] uppercase text-[var(--rb-lime)] hover:text-[var(--rb-ink)]"
                      >
                        Lees →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MAP */}
      <CourseMap ratings={ratings} />

      {/* METHODE */}

      <div className="px-6 lg:px-14 py-14 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
        <div>
          <h2 className="font-rb-mono text-[0.7rem] tracking-[0.2em] uppercase text-[var(--rb-ink)] mb-4">
            De methode
          </h2>
          <p className="font-rb-sans text-[0.95rem] text-[var(--rb-ink-2)] leading-[1.8] mb-8 max-w-2xl">
            {ratingMethodology.intro}
          </p>

          <div className="border-t border-[rgba(242,239,230,0.15)]">
            {ratingMethodology.weights.map((w) => (
              <div
                key={w.name}
                className="grid grid-cols-[1fr_60px] sm:grid-cols-[200px_80px_1fr] gap-4 sm:gap-6 py-4 border-b border-[rgba(242,239,230,0.15)] items-start"
              >
                <div className="font-rb-serif text-[1.05rem] text-[var(--rb-ink)]">{w.name}</div>
                <div className="font-rb-mono text-[0.7rem] tracking-[0.1em] text-[var(--rb-lime)]">
                  {w.weight}
                </div>
                <div className="font-rb-sans text-[0.85rem] text-[var(--rb-muted)] leading-[1.7] col-span-2 sm:col-span-1">
                  {w.what}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 self-start">
          <h3 className="font-rb-mono text-[0.7rem] tracking-[0.2em] uppercase text-[var(--rb-muted)] mb-4">
            Scorelegenda
          </h3>
          <div className="space-y-3">
            {ratingMethodology.legend.map((l) => (
              <div key={l.range} className="border-l-2 border-[var(--rb-lime)] pl-3">
                <div className="font-rb-mono text-[0.7rem] tracking-[0.1em] uppercase text-[var(--rb-ink)]">
                  {l.range} · {l.label}
                </div>
                <div className="font-rb-sans text-[0.8rem] text-[var(--rb-muted)] mt-0.5">{l.desc}</div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}
