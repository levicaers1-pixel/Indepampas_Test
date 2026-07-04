import { useEffect, useMemo, useRef, useState } from "react";
import { HOSTS, HOST_PERSONAS, type HostName } from "@/data/personas";
import { personalScore } from "@/lib/personalScore";
import type { CourseWithRatings } from "@/data/courses-db";
import { CourseCard } from "./CourseCard";
import { MatchQuiz } from "./MatchQuiz";
import { CourseCompare } from "./CourseCompare";
import { HostStats } from "./HostStats";
import { RouteBuilder } from "./RouteBuilder";
import { SurpriseMe } from "./SurpriseMe";
import { CoursesMap } from "./CoursesMap";

type SortKey = "pampas_desc" | "pampas_asc" | "name" | "recent";
type Tab = "courses" | "compare" | "surprise" | "hosts" | "route";

const TABS: { key: Tab; label: string }[] = [
  { key: "courses", label: "Parcours" },
  { key: "compare", label: "Vergelijk" },
  { key: "surprise", label: "Verras mij" },
  { key: "hosts", label: "Host-stats" },
  { key: "route", label: "Route builder" },
];

export function RatingsPage({ courses }: { courses: CourseWithRatings[] }) {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("");
  const [type, setType] = useState("");
  const [fee, setFee] = useState("");
  const [hostFilter, setHostFilter] = useState<Set<HostName>>(new Set());
  const [sort, setSort] = useState<SortKey>("pampas_desc");
  const [activeHost, setActiveHost] = useState<HostName | null>(null);
  const [tab, setTab] = useState<Tab>("courses");

  const countries = useMemo(
    () => Array.from(new Set(courses.map((c) => c.country).filter(Boolean))) as string[],
    [courses],
  );
  const regions = useMemo(() => {
    const source = country ? courses.filter((c) => c.country === country) : courses;
    return Array.from(new Set(source.map((c) => c.region).filter(Boolean))) as string[];
  }, [courses, country]);
  const types = useMemo(
    () => Array.from(new Set(courses.map((c) => c.type).filter(Boolean))) as string[],
    [courses],
  );

  const filtered = useMemo(() => {
    let out = courses.filter((c) => {
      if (search && !`${c.name} ${c.region ?? ""}`.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (region && c.region !== region) return false;
      if (country && c.country !== country) return false;
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
  }, [courses, search, region, country, type, fee, hostFilter, sort, activeHost]);

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
    <>
      {/* HERO */}
      <div className="px-6 lg:px-14 pt-16 pb-12 border-b border-[rgba(28,61,42,0.15)]">
        <p className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#635C4B] mb-4">
          Onafhankelijke beoordelingen
        </p>
        <h1 className="font-rb-serif font-light text-[clamp(2.8rem,5vw,4.5rem)] text-[#1C3D2A] leading-none">
          Parcours <em className="italic">Beoordelingen</em>.
        </h1>
        <p className="font-rb-sans text-[0.95rem] text-[#635C4B] mt-4 max-w-2xl leading-[1.7] whitespace-pre-line">
          Gespeeld, beoordeeld en eerlijk besproken door Lars, Levi &amp; Niels.
          {"\n"}Greenfee prijzen zijn indicatief en kunnen mogelijks verouderd zijn. 
        </p>

        <div className="flex flex-wrap gap-2 mt-7">
          {HOSTS.map((h) => {
            const p = HOST_PERSONAS[h];
            return (
              <div
                key={h}
                className="inline-flex items-center gap-2 px-3 py-1.5 border"
                style={{ borderColor: `${p.color}55`, background: `${p.color}10` }}
              >
                <span>{p.icon}</span>
                <span
                  className="font-rb-mono text-[0.6rem] tracking-[0.12em] uppercase"
                  style={{ color: p.color }}
                >
                  {h} · hcp {p.handicap} · {p.tagline}
                </span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-6 mt-10 max-w-2xl">
          {[
            { v: totalCourses, l: "Parcours" },
            { v: avgScore || "—", l: "Gem. PAMPAS Score" },
            { v: fullySampled, l: "Door alle 3 gespeeld" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-rb-serif font-light text-[2.4rem] text-[#1C3D2A] leading-none">
                {s.v}
              </div>
              <div className="font-rb-mono text-[0.55rem] tracking-[0.18em] uppercase text-[#635C4B] mt-2">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MATCH QUIZ */}
      <div className="px-6 lg:px-14 py-14 border-b border-[rgba(28,61,42,0.15)] bg-[#EDE6D9]">
        <h2 className="font-rb-mono text-[0.65rem] tracking-[0.2em] uppercase text-[#1C3D2A] mb-6">
          Vind je host
        </h2>
        <MatchQuiz onMatch={setActiveHost} />
      </div>

      {/* COURSES MAP */}
      <CoursesMap courses={courses} />


      {/* ACTIVE PERSPECTIVE BANNER */}
      {activeHost && (
        <div
          className="px-6 lg:px-14 py-3 border-b flex items-center justify-between flex-wrap gap-3"
          style={{
            background: `${HOST_PERSONAS[activeHost].color}15`,
            borderColor: `${HOST_PERSONAS[activeHost].color}33`,
          }}
        >
          <span
            className="font-rb-mono text-[0.62rem] tracking-[0.14em] uppercase"
            style={{ color: HOST_PERSONAS[activeHost].color }}
          >
            Je bekijkt parcours door de ogen van {activeHost} {HOST_PERSONAS[activeHost].icon}
          </span>
          <button
            onClick={() => setActiveHost(null)}
            className="font-rb-mono text-[0.6rem] tracking-[0.14em] uppercase text-[#635C4B] hover:text-[#1C3D2A]"
          >
            Reset
          </button>
        </div>
      )}

      {/* TABS */}
      <div className="px-6 lg:px-14 border-b border-[rgba(28,61,42,0.15)] bg-[#F4EFE5] flex flex-wrap gap-1 overflow-x-auto">
        {TABS.map((t) => {
          const on = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="font-rb-mono text-[0.62rem] tracking-[0.18em] uppercase px-4 py-3 border-b-2 transition whitespace-nowrap"
              style={{
                borderColor: on ? "#1C3D2A" : "transparent",
                color: on ? "#1C3D2A" : "#635C4B",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "courses" && (
        <>
          {/* FILTERS */}
          <div className="sticky top-0 z-10 bg-[#F4EFE5]/95 backdrop-blur px-6 lg:px-14 py-4 border-b border-[rgba(28,61,42,0.15)]">
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Zoek een parcours..."
                className="bg-white border border-[rgba(28,61,42,0.2)] px-3 py-2 text-[0.82rem] font-rb-sans text-[#1C3D2A] placeholder:text-[#635C4B] w-full md:w-64 focus:outline-none focus:border-[#1C3D2A]"
              />
              <select value={region} onChange={(e) => setRegion(e.target.value)} className="select-cream">
                <option value="">Regio</option>
                {regions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <select value={country} onChange={(e) => { setCountry(e.target.value); setRegion(""); }} className="select-cream">
                <option value="">Land</option>
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select value={type} onChange={(e) => setType(e.target.value)} className="select-cream">
                <option value="">Type</option>
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <select value={fee} onChange={(e) => setFee(e.target.value)} className="select-cream">
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
                      className="font-rb-mono text-[0.58rem] tracking-[0.14em] uppercase px-2.5 py-1.5 transition border"
                      style={{
                        background: on ? `${p.color}20` : "transparent",
                        color: on ? p.color : "#635C4B",
                        borderColor: on ? p.color : "rgba(28,61,42,0.2)",
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
                className="select-cream ml-auto"
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
              <div className="text-center py-20 font-rb-sans text-[#635C4B]">
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
        </>
      )}

      {tab === "compare" && <CourseCompare courses={courses} />}
      {tab === "surprise" && <SurpriseMe courses={courses} />}
      {tab === "hosts" && <HostStats courses={courses} />}
      {tab === "route" && <RouteBuilder courses={courses} />}


      <style>{`
        .select-cream {
          background: #ffffff;
          border: 1px solid rgba(28,61,42,0.2);
          color: #1C3D2A;
          font-family: inherit;
          font-size: 0.78rem;
          padding: 0.55rem 0.75rem;
        }
        .select-cream:focus { outline: none; border-color: #1C3D2A; }
      `}</style>
    </>
  );
}
