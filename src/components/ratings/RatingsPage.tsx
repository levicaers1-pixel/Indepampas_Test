import { useMemo, useState } from "react";
import { HOSTS, HOST_PERSONAS, type HostName } from "@/data/personas";
import { personalScore } from "@/lib/personalScore";
import type { CourseWithRatings } from "@/data/courses-db";
import { CourseCard } from "./CourseCard";
import { MatchQuiz } from "./MatchQuiz";

type SortKey = "pampas_desc" | "pampas_asc" | "name" | "recent";

export function RatingsPage({ courses }: { courses: CourseWithRatings[] }) {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [type, setType] = useState("");
  const [fee, setFee] = useState("");
  const [hostFilter, setHostFilter] = useState<Set<HostName>>(new Set());
  const [sort, setSort] = useState<SortKey>("pampas_desc");
  const [activeHost, setActiveHost] = useState<HostName | null>(null);

  const regions = useMemo(
    () => Array.from(new Set(courses.map((c) => c.region).filter(Boolean))) as string[],
    [courses],
  );
  const types = useMemo(
    () => Array.from(new Set(courses.map((c) => c.type).filter(Boolean))) as string[],
    [courses],
  );

  const filtered = useMemo(() => {
    let out = courses.filter((c) => {
      if (search && !`${c.name} ${c.region ?? ""}`.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (region && c.region !== region) return false;
      if (type && c.type !== type) return false;
      if (fee && c.fee_category !== fee) return false;
      if (hostFilter.size > 0) {
        const rated = new Set(c.ratings.map((r) => r.host));
        for (const h of hostFilter) if (!rated.has(h)) return false;
      }
      return true;
    });

    const persona = activeHost ? HOST_PERSONAS[activeHost] : null;
    const scoreFor = (c: CourseWithRatings) =>
      persona ? personalScore(c.ratings, persona.affinities) ?? -1 : c.pampasScore ?? -1;

    if (sort === "pampas_desc") out = [...out].sort((a, b) => scoreFor(b) - scoreFor(a));
    else if (sort === "pampas_asc") out = [...out].sort((a, b) => scoreFor(a) - scoreFor(b));
    else if (sort === "name") out = [...out].sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "recent") {
      const recent = (c: CourseWithRatings) =>
        Math.max(0, ...c.ratings.map((r) => (r.played_on ? new Date(r.played_on).getTime() : 0)));
      out = [...out].sort((a, b) => recent(b) - recent(a));
    }
    return out;
  }, [courses, search, region, type, fee, hostFilter, sort, activeHost]);

  const totalCourses = courses.length;
  const avgScore =
    Math.round(
      (courses.filter((c) => c.pampasScore != null).reduce((s, c) => s + (c.pampasScore ?? 0), 0) /
        Math.max(1, courses.filter((c) => c.pampasScore != null).length)) *
        10,
    ) / 10;
  const fullySampled = courses.filter((c) => c.ratings.length === 3).length;

  const toggleHost = (h: HostName) => {
    const next = new Set(hostFilter);
    next.has(h) ? next.delete(h) : next.add(h);
    setHostFilter(next);
  };

  return (
    <div className="bg-[#141412] text-[#F5F3EE] min-h-screen">
      {/* HERO */}
      <div className="px-6 lg:px-14 pt-16 pb-12 border-b border-[#2E2E2B]">
        <p className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#8C8A85] mb-4">
          Parcours beoordelingen
        </p>
        <h1 className="font-rb-serif font-light text-[clamp(2.8rem,5vw,4.5rem)] leading-none">
          Parcours <em className="italic text-[#8CB84A]">Beoordelingen</em>.
        </h1>
        <p className="font-rb-sans text-[0.95rem] text-[#8C8A85] mt-4 max-w-2xl leading-[1.7]">
          Gespeeld, beoordeeld en eerlijk besproken door Lars, Levi & Niels.
        </p>

        <div className="flex flex-wrap gap-2 mt-6">
          {HOSTS.map((h) => {
            const p = HOST_PERSONAS[h];
            return (
              <div
                key={h}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{ background: p.bgLight, border: `1px solid ${p.color}44` }}
              >
                <span>{p.icon}</span>
                <span className="font-rb-mono text-[0.65rem] tracking-[0.1em] uppercase" style={{ color: p.color }}>
                  {h} · hcp {p.handicap} · {p.tagline}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-6 mt-8">
          {[
            { v: totalCourses, l: "Parcours" },
            { v: avgScore || "—", l: "Gem. PAMPAS Score" },
            { v: fullySampled, l: "Door alle 3 gespeeld" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-rb-serif text-[2rem] text-[#F5F3EE] leading-none">{s.v}</div>
              <div className="font-rb-mono text-[0.55rem] tracking-[0.2em] uppercase text-[#8C8A85] mt-1">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MATCH QUIZ */}
      <div className="px-6 lg:px-14 py-12 border-b border-[#2E2E2B]">
        <h2 className="font-rb-mono text-[0.65rem] tracking-[0.2em] uppercase text-[#8C8A85] mb-5">
          Vind je host
        </h2>
        <MatchQuiz onMatch={setActiveHost} />
      </div>

      {/* ACTIVE PERSPECTIVE BANNER */}
      {activeHost && (
        <div
          className="px-6 lg:px-14 py-3 border-b border-[#2E2E2B] flex items-center justify-between flex-wrap gap-3"
          style={{ background: HOST_PERSONAS[activeHost].bgLight }}
        >
          <span
            className="font-rb-mono text-[0.65rem] tracking-[0.15em] uppercase"
            style={{ color: HOST_PERSONAS[activeHost].color }}
          >
            Je bekijkt parcours door de ogen van {activeHost} {HOST_PERSONAS[activeHost].icon}
          </span>
          <button
            onClick={() => setActiveHost(null)}
            className="font-rb-mono text-[0.6rem] tracking-[0.15em] uppercase text-[#8C8A85] hover:text-[#F5F3EE]"
          >
            Reset
          </button>
        </div>
      )}

      {/* FILTERS */}
      <div className="sticky top-0 z-10 bg-[#141412]/95 backdrop-blur px-6 lg:px-14 py-4 border-b border-[#2E2E2B]">
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Zoek een parcours..."
            className="bg-[#1E1E1C] border border-[#2E2E2B] px-3 py-2 text-[0.85rem] font-rb-sans text-[#F5F3EE] placeholder:text-[#5C5C58] rounded-sm w-full md:w-64 focus:outline-none focus:border-[#4A4A45]"
          />
          <select value={region} onChange={(e) => setRegion(e.target.value)} className="select-dark">
            <option value="">Regio</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select value={type} onChange={(e) => setType(e.target.value)} className="select-dark">
            <option value="">Type</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select value={fee} onChange={(e) => setFee(e.target.value)} className="select-dark">
            <option value="">Fee</option>
            <option value="€">€</option>
            <option value="€€">€€</option>
            <option value="€€€">€€€</option>
            <option value="€€€€">€€€€</option>
          </select>
          <div className="flex items-center gap-1.5">
            {HOSTS.map((h) => {
              const p = HOST_PERSONAS[h];
              const on = hostFilter.has(h);
              return (
                <button
                  key={h}
                  onClick={() => toggleHost(h)}
                  className="font-rb-mono text-[0.6rem] tracking-[0.15em] uppercase px-2.5 py-1.5 rounded-sm transition"
                  style={{
                    background: on ? p.color + "33" : "#1E1E1C",
                    color: on ? p.color : "#8C8A85",
                    border: `1px solid ${on ? p.color : "#2E2E2B"}`,
                  }}
                >
                  {p.icon} {h}
                </button>
              );
            })}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="select-dark ml-auto"
          >
            <option value="pampas_desc">Score ↓</option>
            <option value="pampas_asc">Score ↑</option>
            <option value="name">Naam A→Z</option>
            <option value="recent">Meest recent</option>
          </select>
        </div>
      </div>

      {/* COURSE LIST */}
      <div className="px-6 lg:px-14 py-10 space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-20 font-rb-sans text-[#8C8A85]">
            ⛳ Geen parcours gevonden. Lars, Levi en Niels moeten hier nog naartoe.
          </div>
        ) : (
          filtered.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              activePersona={activeHost ? HOST_PERSONAS[activeHost] : null}
            />
          ))
        )}
      </div>

      <style>{`
        .select-dark {
          background: #1E1E1C;
          border: 1px solid #2E2E2B;
          color: #F5F3EE;
          font-family: inherit;
          font-size: 0.78rem;
          padding: 0.55rem 0.75rem;
          border-radius: 2px;
        }
        .select-dark:focus { outline: none; border-color: #4A4A45; }
      `}</style>
    </div>
  );
}
