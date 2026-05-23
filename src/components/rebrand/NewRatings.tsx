import { Link } from "@tanstack/react-router";
import { ratingMethodology, type CourseRating } from "@/data/ratings";
import { CourseMap } from "@/components/CourseMap";


function tier(score: number) {
  if (score >= 80) return { label: "Topklasse", color: "#1A3D2B" };
  if (score >= 70) return { label: "Sterk", color: "#3D7A52" };
  if (score >= 55) return { label: "Degelijk", color: "#8CB84A" };
  return { label: "Gemiddeld", color: "#7A7260" };
}

export function NewRatingsIndex({ ratings }: { ratings: CourseRating[] }) {
  return (
    <>
      {/* HERO */}
      <div className="px-6 lg:px-14 pt-16 pb-12 border-b border-[rgba(28,61,42,0.15)]">
        <p className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#7A7260] mb-4">
          Onafhankelijke beoordelingen
        </p>
        <h1 className="font-rb-serif font-light text-[clamp(2.8rem,5vw,4.5rem)] text-[#1C3D2A] leading-none">
          Pampas <em className="italic">Ratings</em>.
        </h1>
        <p className="font-rb-sans text-[0.95rem] text-[#7A7260] mt-3 max-w-2xl leading-[1.7]">
          Onze parcours-beoordelingen, scherp en zonder sponsoring. Drie hosts, één gewogen
          PAMPAS Score per baan, en een eerlijk verdict: <em>komen we terug?</em>
        </p>
      </div>

      {/* RATINGS TABLE */}
      <div className="px-6 lg:px-14 py-14 border-b border-[rgba(28,61,42,0.15)]">
        <h2 className="font-rb-mono text-[0.65rem] tracking-[0.2em] uppercase text-[#1C3D2A] mb-6">
          De ranglijst
        </h2>

        <div className="overflow-x-auto border border-[rgba(28,61,42,0.15)]">
          <table className="w-full border-collapse text-left min-w-[760px]">
            <thead className="bg-[#1C3D2A] text-[#F4EFE5]">
              <tr>
                {["#", "Parcours", "Regio", "Type", "Fee", "Score", "Terugkomen?", ""].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 font-rb-mono text-[0.55rem] tracking-[0.15em] uppercase"
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
                    className={i % 2 === 0 ? "bg-[#F4EFE5]" : "bg-[#EDE6D9]"}
                  >
                    <td className="px-4 py-4 font-rb-mono text-[0.7rem] text-[#7A7260] align-middle border-t border-[rgba(28,61,42,0.12)]">
                      {String(r.rank).padStart(2, "0")}
                    </td>
                    <td className="px-4 py-4 align-middle border-t border-[rgba(28,61,42,0.12)]">
                      <Link
                        to="/ratings/$slug"
                        params={{ slug: r.slug }}
                        className="font-rb-serif text-[1.1rem] text-[#1C3D2A] hover:text-[#3D7A52] transition-colors"
                      >
                        {r.name}
                      </Link>
                    </td>
                    <td className="px-4 py-4 align-middle border-t border-[rgba(28,61,42,0.12)] font-rb-sans text-[0.85rem] text-[#2E2B25]">
                      {r.region}
                    </td>
                    <td className="px-4 py-4 align-middle border-t border-[rgba(28,61,42,0.12)] font-rb-sans text-[0.85rem] text-[#2E2B25]">
                      {r.type}
                    </td>
                    <td className="px-4 py-4 align-middle border-t border-[rgba(28,61,42,0.12)] font-rb-mono text-[0.7rem] text-[#2E2B25]">
                      {r.feeBand} <span className="text-[#7A7260]">· €{r.greenfee}</span>
                    </td>
                    <td className="px-4 py-4 align-middle border-t border-[rgba(28,61,42,0.12)]">
                      <span
                        className="inline-flex items-baseline gap-1 font-rb-serif text-[1.6rem] leading-none"
                        style={{ color: t.color }}
                      >
                        {r.pampasScore}
                        <span className="font-rb-mono text-[0.55rem] tracking-[0.15em] uppercase text-[#7A7260]">
                          /100
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-4 align-middle border-t border-[rgba(28,61,42,0.12)] font-rb-mono text-[0.6rem] tracking-[0.12em] uppercase text-[#1C3D2A]">
                      {r.verdict}
                    </td>
                    <td className="px-4 py-4 align-middle border-t border-[rgba(28,61,42,0.12)] text-right">
                      <Link
                        to="/ratings/$slug"
                        params={{ slug: r.slug }}
                        className="font-rb-mono text-[0.58rem] tracking-[0.15em] uppercase text-[#3D7A52] hover:text-[#1C3D2A]"
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

      {/* METHODE */}
      <div className="px-6 lg:px-14 py-14 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
        <div>
          <h2 className="font-rb-mono text-[0.65rem] tracking-[0.2em] uppercase text-[#1C3D2A] mb-4">
            De methode
          </h2>
          <p className="font-rb-sans text-[0.95rem] text-[#2E2B25] leading-[1.8] mb-8 max-w-2xl">
            {ratingMethodology.intro}
          </p>

          <div className="border-t border-[rgba(28,61,42,0.15)]">
            {ratingMethodology.weights.map((w) => (
              <div
                key={w.name}
                className="grid grid-cols-[1fr_60px] sm:grid-cols-[200px_80px_1fr] gap-4 sm:gap-6 py-4 border-b border-[rgba(28,61,42,0.15)] items-start"
              >
                <div className="font-rb-serif text-[1.05rem] text-[#1C3D2A]">{w.name}</div>
                <div className="font-rb-mono text-[0.7rem] tracking-[0.1em] text-[#3D7A52]">
                  {w.weight}
                </div>
                <div className="font-rb-sans text-[0.85rem] text-[#7A7260] leading-[1.7] col-span-2 sm:col-span-1">
                  {w.what}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 self-start">
          <h3 className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#7A7260] mb-4">
            Scorelegenda
          </h3>
          <div className="space-y-3">
            {ratingMethodology.legend.map((l) => (
              <div key={l.range} className="border-l-2 border-[#8CB84A] pl-3">
                <div className="font-rb-mono text-[0.65rem] tracking-[0.1em] uppercase text-[#1C3D2A]">
                  {l.range} · {l.label}
                </div>
                <div className="font-rb-sans text-[0.8rem] text-[#7A7260] mt-0.5">{l.desc}</div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}
