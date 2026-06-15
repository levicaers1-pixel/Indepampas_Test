import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { CourseWithRatings } from "@/data/courses-db";
import { scoreColor } from "@/lib/personalScore";

const FEE_VALUES: Record<string, number> = { "€": 60, "€€": 85, "€€€": 120, "€€€€": 180 };

export function RouteBuilder({ courses }: { courses: CourseWithRatings[] }) {
  // Group regions by country so e.g. "Limburg (NL)" and "Limburg (BE)" don't collide,
  // and Utrecht (NL) shows up even though it shares no name with Belgian regions.
  const regionsByCountry = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const c of courses) {
      if (!c.region || !c.country) continue;
      if (!map.has(c.country)) map.set(c.country, new Set());
      map.get(c.country)!.add(c.region);
    }
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([country, set]) => ({
        country,
        regions: Array.from(set).sort((a, b) => a.localeCompare(b)),
      }));
  }, [courses]);

  // Value format: "country|region" (empty = all)
  const [regionKey, setRegionKey] = useState<string>("");
  const [stops, setStops] = useState(3);
  const [budget, setBudget] = useState(400);

  const route = useMemo(() => {
    const [selCountry, selRegion] = regionKey ? regionKey.split("|") : ["", ""];
    const pool = courses
      .filter((c) =>
        regionKey ? c.country === selCountry && c.region === selRegion : true,
      )
      // Rated courses first (highest score), then unrated so the builder still
      // returns something for regions without PAMPAS ratings yet.
      .sort((a, b) => {
        const sa = a.pampasScore;
        const sb = b.pampasScore;
        if (sa == null && sb == null) return 0;
        if (sa == null) return 1;
        if (sb == null) return -1;
        return sb - sa;
      });

    const picked: CourseWithRatings[] = [];
    let total = 0;
    for (const c of pool) {
      if (picked.length >= stops) break;
      const fee = c.greenfee ?? FEE_VALUES[c.fee_category ?? ""] ?? 90;
      if (total + fee > budget) continue;
      picked.push(c);
      total += fee;
    }
    return { picked, total };
  }, [courses, regionKey, stops, budget]);

  const avgScore =
    route.picked.length > 0
      ? route.picked.reduce((s, c) => s + (c.pampasScore ?? 0), 0) / route.picked.length
      : null;

  return (
    <div className="px-6 lg:px-14 py-12 bg-[#EDE6D9] border-b border-[rgba(28,61,42,0.15)]">
      <p className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#635C4B] mb-2">
        Route builder
      </p>
      <h2 className="font-rb-serif font-light text-[clamp(1.8rem,3vw,2.6rem)] text-[#1C3D2A] leading-none mb-3">
        Bouw je <em className="italic">golfweekend</em>.
      </h2>
      <p className="font-rb-sans text-[0.85rem] text-[#635C4B] max-w-2xl mb-7">
        Kies regio, aantal banen en budget. We stellen een route samen uit de hoogst gescoorde
        parcours van PAMPAS.
      </p>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="font-rb-mono text-[0.55rem] tracking-[0.18em] uppercase text-[#1C3D2A] block mb-1.5">
            Regio
          </label>
          <select
            value={regionKey}
            onChange={(e) => setRegionKey(e.target.value)}
            className="w-full bg-white border border-[rgba(28,61,42,0.2)] px-3 py-2 text-[0.82rem] font-rb-sans text-[#1C3D2A]"
          >
            <option value="">Alle landen & regio's</option>
            {regionsByCountry.map(({ country, regions }) => (
              <optgroup key={country} label={country}>
                {regions.map((r) => (
                  <option key={`${country}|${r}`} value={`${country}|${r}`}>
                    {r}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div>
          <label className="font-rb-mono text-[0.55rem] tracking-[0.18em] uppercase text-[#1C3D2A] block mb-1.5">
            Aantal banen: {stops}
          </label>
          <input
            type="range"
            min={2}
            max={5}
            value={stops}
            onChange={(e) => setStops(Number(e.target.value))}
            className="w-full accent-[#1C3D2A]"
          />
        </div>
        <div>
          <label className="font-rb-mono text-[0.55rem] tracking-[0.18em] uppercase text-[#1C3D2A] block mb-1.5">
            Budget greenfees: €{budget}
          </label>
          <input
            type="range"
            min={100}
            max={1000}
            step={50}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full accent-[#1C3D2A]"
          />
        </div>
      </div>

      {route.picked.length === 0 ? (
        <div className="bg-white border border-[rgba(28,61,42,0.15)] p-8 text-center font-rb-sans text-[#635C4B] text-[0.85rem]">
          Geen route mogelijk binnen dit budget. Verhoog je budget of kies een andere regio.
        </div>
      ) : (
        <div className="bg-white border border-[rgba(28,61,42,0.15)] p-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 pb-5 mb-5 border-b border-[rgba(28,61,42,0.1)]">
            <Stat label="Banen" value={route.picked.length.toString()} />
            <Stat label="Totale greenfee" value={`€${route.total}`} />
            <Stat
              label="Ø PAMPAS score"
              value={avgScore != null ? avgScore.toFixed(1) : "—"}
            />
          </div>

          {/* Route timeline */}
          <ol className="space-y-3">
            {route.picked.map((c, i) => {
              const { hex } = scoreColor(c.pampasScore);
              const fee = c.greenfee ?? FEE_VALUES[c.fee_category ?? ""] ?? 90;
              return (
                <li key={c.id} className="flex items-center gap-4 group">
                  <div
                    className="font-rb-serif text-[1.6rem] w-10 h-10 flex items-center justify-center rounded-full shrink-0"
                    style={{ background: "#1C3D2A", color: "#F4EFE5" }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-3">
                      <Link
                        to="/ratings/$slug"
                        params={{ slug: c.id }}
                        className="font-rb-serif text-[1.15rem] text-[#1C3D2A] hover:underline truncate"
                      >
                        {c.name}
                      </Link>
                      <span
                        className="font-rb-serif text-[1.3rem] tabular-nums shrink-0"
                        style={{ color: hex }}
                      >
                        {c.pampasScore?.toFixed(0)}
                      </span>
                    </div>
                    <div className="font-rb-mono text-[0.55rem] tracking-[0.14em] uppercase text-[#635C4B] mt-0.5">
                      {c.region ?? "—"} · {c.type ?? "—"} · €{fee} greenfee
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-6 pt-5 border-t border-[rgba(28,61,42,0.1)] font-rb-mono text-[0.55rem] tracking-[0.16em] uppercase text-[#635C4B]">
            Suggesties op basis van PAMPAS scores. Bel altijd vooraf voor startijden.
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-rb-serif text-[1.8rem] text-[#1C3D2A] leading-none">{value}</div>
      <div className="font-rb-mono text-[0.55rem] tracking-[0.18em] uppercase text-[#635C4B] mt-1.5">
        {label}
      </div>
    </div>
  );
}
