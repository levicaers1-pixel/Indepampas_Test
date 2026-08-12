import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import type { CourseWithRatings } from "@/data/courses-db";
import { useCombinedScore } from "@/lib/useCourseVotes";
import { scoreColor } from "@/lib/personalScore";
import { geocodeAddress } from "@/lib/geocode.functions";
import { computeDriveMatrix } from "@/lib/routes.functions";

const FEE_VALUES: Record<string, number> = { "€": 60, "€€": 85, "€€€": 120, "€€€€": 180 };
const COORD_CACHE_KEY = "pampas:geocode:v2";

type Coord = { lat: number; lng: number };
type Stop = {
  course: CourseWithRatings;
  fee: number;
  legKm: number; // from previous point
  legMin: number;
  day: number;
};

function loadCoordCache(): Record<string, Coord> {
  try {
    return JSON.parse(localStorage.getItem(COORD_CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}
function saveCoordCache(c: Record<string, Coord>) {
  try {
    localStorage.setItem(COORD_CACHE_KEY, JSON.stringify(c));
  } catch {
    /* ignore */
  }
}

function countryCode(country?: string | null): string | undefined {
  if (!country) return undefined;
  const k = country.toLowerCase();
  if (k.startsWith("bel")) return "BE";
  if (k.startsWith("ned") || k === "nl") return "NL";
  if (k.startsWith("fra")) return "FR";
  if (k.startsWith("dui") || k.startsWith("ger")) return "DE";
  return undefined;
}

function haversineKm(a: Coord, b: Coord): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function RouteBuilder({ courses }: { courses: CourseWithRatings[] }) {
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

  const [regionKey, setRegionKey] = useState<string>("");
  const [origin, setOrigin] = useState("Brussel");
  const [days, setDays] = useState(2);
  const [perDay, setPerDay] = useState(2);
  const [maxLegMin, setMaxLegMin] = useState(90);
  const [budget, setBudget] = useState(600);

  const [coordCache, setCoordCache] = useState<Record<string, Coord>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    stops: Stop[];
    totalKm: number;
    totalMin: number;
    totalFee: number;
    originCoord: Coord;
  } | null>(null);

  useEffect(() => {
    setCoordCache(loadCoordCache());
  }, []);

  const geocode = useServerFn(geocodeAddress);
  const matrix = useServerFn(computeDriveMatrix);

  const stops = days * perDay;

  async function build() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      // 1) Geocode origin.
      const geo = await geocode({ data: { query: origin } });
      if (geo.lat == null || geo.lng == null) {
        setError("Kon startpunt niet lokaliseren. Probeer een andere plaats of postcode.");
        return;
      }
      const originCoord: Coord = { lat: geo.lat, lng: geo.lng };

      // 2) Build candidate pool: rated courses + optional region filter, with coords.
      const [selCountry, selRegion] = regionKey ? regionKey.split("|") : ["", ""];
      const pool = courses
        .filter((c) => c.pampasScore != null && c.ratings.length > 0)
        .filter((c) => (regionKey ? c.country === selCountry && c.region === selRegion : true));

      // Ensure coords for pool: use cache; geocode any missing (best-effort, capped).
      const cache = { ...loadCoordCache() };
      const missing = pool.filter((c) => !cache[c.id]).slice(0, 20);
      for (const c of missing) {
        try {
          const q = [c.name, c.region, c.country].filter(Boolean).join(", ");
          const r = await geocode({
            data: { query: q, countryCode: countryCode(c.country) },
          });
          if (r?.lat != null && r?.lng != null) cache[c.id] = { lat: r.lat, lng: r.lng };
        } catch {
          /* skip */
        }
      }
      saveCoordCache(cache);
      setCoordCache(cache);

      const withCoords = pool
        .map((c) => ({ c, co: cache[c.id] }))
        .filter((x): x is { c: CourseWithRatings; co: Coord } => !!x.co);

      // 3) Prefilter by straight-line distance from origin (rough max radius).
      // Assume ~1 min/km at 60km/h → maxLegMin km as upper bound × days.
      const maxRadiusKm = Math.max(80, maxLegMin * 1.2 * Math.max(days, 1));
      const nearby = withCoords
        .filter(({ co }) => haversineKm(originCoord, co) <= maxRadiusKm)
        .sort((a, b) => (combinedScore(b.c) ?? 0) - (combinedScore(a.c) ?? 0))
        .slice(0, 20); // Routes matrix capped at 25 total.

      if (nearby.length === 0) {
        setError("Geen banen gevonden binnen redelijke afstand. Vergroot je zoekgebied.");
        return;
      }

      // 4) Compute drive matrix: origin + candidates × same.
      const points = [originCoord, ...nearby.map((n) => n.co)];
      const { cells } = await matrix({ data: { origins: points, destinations: points } });
      const N = points.length;
      const grid: { km: number; min: number; ok: boolean }[][] = Array.from({ length: N }, () =>
        Array.from({ length: N }, () => ({ km: 0, min: 0, ok: false })),
      );
      for (const c of cells) {
        grid[c.originIndex][c.destinationIndex] = {
          km: c.distanceMeters / 1000,
          min: c.durationSec / 60,
          ok: c.ok,
        };
      }

      // 5) Greedy nearest-neighbor tour from origin (index 0), respecting max-leg minutes,
      //    limited by stops count and budget.
      const chosen: Stop[] = [];
      const visited = new Set<number>();
      let current = 0;
      let totalFee = 0;
      let totalKm = 0;
      let totalMin = 0;

      while (chosen.length < stops) {
        // Rank remaining by combined score: high pampas score, short leg.
        const options = nearby
          .map((n, i) => ({ n, idx: i + 1 }))
          .filter(({ idx }) => !visited.has(idx))
          .map(({ n, idx }) => ({
            n,
            idx,
            leg: grid[current][idx],
          }))
          .filter(({ leg }) => leg.ok && leg.min <= maxLegMin);

        if (options.length === 0) break;

        // Score = pampasScore - 0.15 * minutes (favor high-score, penalize long legs).
        options.sort(
          (a, b) =>
            (combinedScore(b.n.c) ?? 0) - 0.15 * b.leg.min -
            ((combinedScore(a.n.c) ?? 0) - 0.15 * a.leg.min),
        );

        // Try to fit under budget.
        const pick = options.find(({ n }) => {
          const fee = n.c.greenfee ?? FEE_VALUES[n.c.fee_category ?? ""] ?? 90;
          return totalFee + fee <= budget;
        });
        if (!pick) break;

        const fee = pick.n.c.greenfee ?? FEE_VALUES[pick.n.c.fee_category ?? ""] ?? 90;
        chosen.push({
          course: pick.n.c,
          fee,
          legKm: pick.leg.km,
          legMin: pick.leg.min,
          day: Math.floor(chosen.length / perDay) + 1,
        });
        totalFee += fee;
        totalKm += pick.leg.km;
        totalMin += pick.leg.min;
        visited.add(pick.idx);
        current = pick.idx;
      }

      if (chosen.length === 0) {
        setError("Geen route mogelijk binnen deze parameters. Verhoog rijtijd of budget.");
        return;
      }

      // Add return leg to origin.
      const returnLeg = grid[current][0];
      if (returnLeg.ok) {
        totalKm += returnLeg.km;
        totalMin += returnLeg.min;
      }

      setResult({ stops: chosen, totalKm, totalMin, totalFee, originCoord });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(`Kon route niet berekenen: ${msg}`);
    } finally {
      setLoading(false);
    }
  }

  const gmapsUrl = useMemo(() => {
    if (!result) return null;
    const parts = [
      `${result.originCoord.lat},${result.originCoord.lng}`,
      ...result.stops
        .map((s) => coordCache[s.course.id])
        .filter((c): c is Coord => !!c)
        .map((c) => `${c.lat},${c.lng}`),
      `${result.originCoord.lat},${result.originCoord.lng}`,
    ];
    return `https://www.google.com/maps/dir/${parts.join("/")}`;
  }, [result, coordCache]);

  const byDay = useMemo(() => {
    if (!result) return [];
    const map = new Map<number, Stop[]>();
    for (const s of result.stops) {
      if (!map.has(s.day)) map.set(s.day, []);
      map.get(s.day)!.push(s);
    }
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [result]);

  return (
    <div className="px-6 lg:px-14 py-12 bg-[#EDE6D9] border-b border-[rgba(28,61,42,0.15)]">
      <p className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#635C4B] mb-2">
        Roadtrip optimizer 2.0
      </p>
      <h2 className="font-rb-serif font-light text-[clamp(1.8rem,3vw,2.6rem)] text-[#1C3D2A] leading-none mb-3">
        Plan je <em className="italic">golfweekend</em> met echte rijtijden.
      </h2>
      <p className="font-rb-sans text-[0.85rem] text-[#635C4B] max-w-2xl mb-7">
        Kies vertrekpunt, aantal dagen en budget. We bouwen een geoptimaliseerde route via de Google
        Routes API — met echte km, rijtijd en PAMPAS-scores.
      </p>

      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="lg:col-span-2">
          <label className="font-rb-mono text-[0.55rem] tracking-[0.18em] uppercase text-[#1C3D2A] block mb-1.5">
            Vertrek
          </label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="bv. Antwerpen, 2000 of Utrecht"
            className="w-full bg-white border border-[rgba(28,61,42,0.2)] px-3 py-2 text-[0.82rem] font-rb-sans text-[#1C3D2A]"
          />
        </div>
        <div className="lg:col-span-2">
          <label className="font-rb-mono text-[0.55rem] tracking-[0.18em] uppercase text-[#1C3D2A] block mb-1.5">
            Regio (optioneel)
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
            Dagen: {days}
          </label>
          <input
            type="range"
            min={1}
            max={4}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full accent-[#1C3D2A]"
          />
        </div>
        <div>
          <label className="font-rb-mono text-[0.55rem] tracking-[0.18em] uppercase text-[#1C3D2A] block mb-1.5">
            Banen/dag: {perDay}
          </label>
          <input
            type="range"
            min={1}
            max={2}
            value={perDay}
            onChange={(e) => setPerDay(Number(e.target.value))}
            className="w-full accent-[#1C3D2A]"
          />
        </div>
        <div>
          <label className="font-rb-mono text-[0.55rem] tracking-[0.18em] uppercase text-[#1C3D2A] block mb-1.5">
            Max rijtijd/leg: {maxLegMin} min
          </label>
          <input
            type="range"
            min={30}
            max={180}
            step={15}
            value={maxLegMin}
            onChange={(e) => setMaxLegMin(Number(e.target.value))}
            className="w-full accent-[#1C3D2A]"
          />
        </div>
        <div className="lg:col-span-2">
          <label className="font-rb-mono text-[0.55rem] tracking-[0.18em] uppercase text-[#1C3D2A] block mb-1.5">
            Budget greenfees: €{budget}
          </label>
          <input
            type="range"
            min={100}
            max={1500}
            step={50}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full accent-[#1C3D2A]"
          />
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={build}
            disabled={loading || !origin.trim()}
            className="w-full px-4 py-2 bg-[#1C3D2A] text-[#F4EFE5] font-rb-mono text-[0.62rem] tracking-[0.18em] uppercase hover:bg-[#264d36] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Berekenen…" : "Bouw route"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-white border border-[rgba(180,60,60,0.3)] p-4 mb-4 font-rb-sans text-[0.82rem] text-[#8b2f2f]">
          {error}
        </div>
      )}

      {!result && !error && !loading && (
        <div className="bg-white/60 border border-dashed border-[rgba(28,61,42,0.2)] p-8 text-center font-rb-sans text-[#635C4B] text-[0.82rem]">
          Vul je vertrekpunt in en klik <strong>Bouw route</strong> om een optimalisatie te
          starten.
        </div>
      )}

      {result && (
        <div className="bg-white border border-[rgba(28,61,42,0.15)] p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-5 mb-5 border-b border-[rgba(28,61,42,0.1)]">
            <Stat label="Banen" value={result.stops.length.toString()} />
            <Stat label="Totaal km" value={`${Math.round(result.totalKm)} km`} />
            <Stat
              label="Rijtijd"
              value={`${Math.floor(result.totalMin / 60)}u ${Math.round(result.totalMin % 60)}m`}
            />
            <Stat label="Greenfees" value={`€${result.totalFee}`} />
          </div>

          {byDay.map(([day, dayStops]) => (
            <div key={day} className="mb-6 last:mb-0">
              <div className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#1C3D2A] mb-3">
                Dag {day}
              </div>
              <ol className="space-y-3">
                {dayStops.map((s, i) => {
                  const isFirst = day === 1 && i === 0 && s === result.stops[0];
                  const { hex } = scoreColor(combinedScore(s.course));
                  return (
                    <li key={s.course.id}>
                      <div className="font-rb-mono text-[0.55rem] tracking-[0.14em] uppercase text-[#635C4B] mb-1 pl-14">
                        {isFirst ? "Vanaf startpunt" : "Rijden"} · {Math.round(s.legKm)} km ·{" "}
                        {Math.round(s.legMin)} min
                      </div>
                      <div className="flex items-center gap-4 group">
                        <div
                          className="font-rb-serif text-[1.4rem] w-10 h-10 flex items-center justify-center rounded-full shrink-0"
                          style={{ background: "#1C3D2A", color: "#F4EFE5" }}
                        >
                          {result.stops.indexOf(s) + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-3">
                            <Link
                              to="/ratings/$slug"
                              params={{ slug: s.course.id }}
                              className="font-rb-serif text-[1.15rem] text-[#1C3D2A] hover:underline truncate"
                            >
                              {s.course.name}
                            </Link>
                            <span
                              className="font-rb-serif text-[1.3rem] tabular-nums shrink-0"
                              style={{ color: hex }}
                            >
                              {combinedScore(s.course)?.toFixed(0)}
                            </span>
                          </div>
                          <div className="font-rb-mono text-[0.55rem] tracking-[0.14em] uppercase text-[#635C4B] mt-0.5">
                            {s.course.region ?? "—"} · {s.course.type ?? "—"} · €{s.fee} greenfee
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}

          {gmapsUrl && (
            <div className="mt-6 pt-5 border-t border-[rgba(28,61,42,0.1)] flex items-center justify-between gap-4 flex-wrap">
              <div className="font-rb-mono text-[0.55rem] tracking-[0.16em] uppercase text-[#635C4B]">
                Rijtijden via Google Routes API · bel altijd vooraf voor startijden.
              </div>
              <a
                href={gmapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#1C3D2A] text-[#F4EFE5] font-rb-mono text-[0.6rem] tracking-[0.18em] uppercase hover:bg-[#264d36]"
              >
                Open in Google Maps →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-rb-serif text-[1.6rem] text-[#1C3D2A] leading-none">{value}</div>
      <div className="font-rb-mono text-[0.55rem] tracking-[0.18em] uppercase text-[#635C4B] mt-1.5">
        {label}
      </div>
    </div>
  );
}
