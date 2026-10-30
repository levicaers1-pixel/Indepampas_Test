import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { HOSTS, HOST_PERSONAS, type HostName } from "@/data/personas";
import { personalScore } from "@/lib/personalScore";
import { useCombinedScore } from "@/lib/useCourseVotes";
import { useDogStatuses } from "@/lib/dogVotes";
import { PawIcon } from "./DogPaw";

import type { CourseWithRatings } from "@/data/courses-db";
import { buildSlugMap } from "@/lib/courseSlug";
import { CourseCard } from "./CourseCard";
import { MatchQuiz } from "./MatchQuiz";
import { CourseCompare } from "./CourseCompare";
import { HostStats } from "./HostStats";
import { RouteBuilder } from "./RouteBuilder";
import { SurpriseMe } from "./SurpriseMe";
import { CoursesMap } from "./CoursesMap";
import { ratingsSearchDefaults } from "@/lib/ratingsSearch";

type SortKey = "pampas_desc" | "pampas_asc" | "name" | "recent";
type Tab = "courses" | "compare" | "surprise" | "hosts" | "route";

const TABS: { key: Tab; label: string }[] = [
  { key: "courses", label: "Parcours" },
  { key: "compare", label: "Vergelijk" },
  { key: "surprise", label: "Verras mij" },
  { key: "hosts", label: "Host-stats" },
  { key: "route", label: "Route builder" },
];

/** Cards rendered up front; the rest is added with "Toon meer" (217 full cards made the page 960 KB). */
const PAGE_SIZE = 24;

const VALID_SORTS: SortKey[] = ["pampas_desc", "pampas_asc", "name", "recent"];
const VALID_TABS: Tab[] = ["courses", "compare", "surprise", "hosts", "route"];
const VALID_HOSTS = new Set<HostName>(HOSTS);

export function RatingsPage({ courses }: { courses: CourseWithRatings[] }) {
  const rawSearch = { ...ratingsSearchDefaults, ...useSearch({ from: "/ratings/" }) };
  const navigate = useNavigate({ from: "/ratings/" });

  // Derive strictly-typed values from URL state (with safe fallbacks).
  const search = rawSearch.q;
  const region = rawSearch.region;
  const country = rawSearch.country;
  const type = rawSearch.type;
  const fee = rawSearch.fee;
  const dogOnly = rawSearch.dog === "ja";
  const sort: SortKey = VALID_SORTS.includes(rawSearch.sort as SortKey)
    ? (rawSearch.sort as SortKey)
    : "pampas_desc";
  const tab: Tab = VALID_TABS.includes(rawSearch.tab as Tab)
    ? (rawSearch.tab as Tab)
    : "courses";
  const hostFilter = useMemo<Set<HostName>>(() => {
    const parts = (rawSearch.hosts || "").split(",").filter(Boolean) as HostName[];
    return new Set(parts.filter((h) => VALID_HOSTS.has(h)));
  }, [rawSearch.hosts]);

  const update = (patch: Partial<{
    q: string; region: string; country: string; type: string;
    fee: string; hosts: string; dog: string; sort: string; tab: string;
  }>) => {
    navigate({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      search: ((prev: any) => {
        const next = { ...prev, ...patch };
        // Strip empties to keep URLs clean.
        for (const k of Object.keys(next)) {
          if (next[k] === "" || next[k] == null) delete next[k];
        }
        return next;
      }) as never,
      replace: true,
      // Switching tabs/filters must not jump the page back to the top.
      resetScroll: false,
    });
  };

  const setSearch = (v: string) => update({ q: v });
  const setRegion = (v: string) => update({ region: v });
  const setCountry = (v: string) => update({ country: v, region: "" });
  const setType = (v: string) => update({ type: v });
  const setFee = (v: string) => update({ fee: v });
  const setSort = (v: SortKey) => update({ sort: v });
  const setTab = (v: Tab) => update({ tab: v });
  const setHostFilterUrl = (next: Set<HostName>) =>
    update({ hosts: Array.from(next).join(",") });

  const [activeHost, setActiveHost] = useState<HostName | null>(null);
  const [focusedCourseId, setFocusedCourseId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const slugMap = useMemo(() => buildSlugMap(courses), [courses]);

  const handleSelectFromMap = (courseId: string) => {
    const target = courses.find((c) => c.id === courseId);
    if (!target) return;
    update({
      q: target.name,
      region: "",
      country: "",
      type: "",
      fee: "",
      hosts: "",
      dog: "",
      sort: "pampas_desc",
      tab: "courses",
    });
    setFocusedCourseId(courseId);
  };

  useEffect(() => {
    if (!focusedCourseId) return;
    const el = document.getElementById(`course-${focusedCourseId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [focusedCourseId, tab]);

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

  const combinedScore = useCombinedScore();
  const dogStatus = useDogStatuses();

  const filtered = useMemo(() => {
    let out = courses.filter((c) => {
      if (dogOnly && dogStatus(c.id).status !== "course") return false;
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
      persona ? personalScore(c.ratings, persona.affinities) ?? -1 : combinedScore(c) ?? -1;

    if (sort === "pampas_desc") out = [...out].sort((a, b) => scoreFor(b) - scoreFor(a));
    else if (sort === "pampas_asc") out = [...out].sort((a, b) => scoreFor(a) - scoreFor(b));
    else if (sort === "name") out = [...out].sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "recent") {
      const recent = (c: CourseWithRatings) =>
        Math.max(0, ...c.ratings.map((r) => (r.played_on ? new Date(r.played_on).getTime() : 0)));
      out = [...out].sort((a, b) => recent(b) - recent(a));
    }
    return out;
  }, [courses, search, region, country, type, fee, hostFilter, dogOnly, dogStatus, sort, activeHost, combinedScore]);


  const [visible, setVisible] = useState(PAGE_SIZE);
  // A new filter or sort starts again from the first page of results.
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [search, region, country, type, fee, hostFilter, dogOnly, sort, activeHost]);
  // The card the map jumped to must be in the DOM, wherever it sits in the list.
  const shown = useMemo(() => {
    const page = filtered.slice(0, visible);
    const focused = focusedCourseId ? filtered.find((c) => c.id === focusedCourseId) : undefined;
    return focused && !page.includes(focused) ? [...page, focused] : page;
  }, [filtered, visible, focusedCourseId]);

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
    setHostFilterUrl(next);
  };

  return (
    <>
      {/* HERO */}
      <section className="rb-noise relative -mt-[64px] overflow-hidden border-b border-[var(--rb-rule)] pt-[64px]">
        <div
          aria-hidden="true"
          className="rb-blob rb-drift -left-40 -bottom-52 h-[700px] w-[700px] bg-[radial-gradient(circle,rgba(182,240,74,0.3)_0%,rgba(182,240,74,0)_65%)]"
        />
        <div
          aria-hidden="true"
          className="rb-blob rb-drift -right-32 -top-24 h-[560px] w-[560px] bg-[radial-gradient(circle,rgba(74,158,219,0.24)_0%,rgba(74,158,219,0)_65%)] [animation-direction:reverse] [animation-duration:18s]"
        />
        <div
          aria-hidden="true"
          className="rb-grid absolute inset-0 [mask-image:linear-gradient(180deg,#000,transparent)]"
        />
        <div className="relative mx-auto flex max-w-[1320px] flex-wrap items-end justify-between gap-10 px-6 pb-12 pt-14 lg:px-14">
          <div className="min-w-0 flex-1 basis-[520px]">
            <p className="rb-mono mb-5 text-[var(--rb-lime)]">Onafhankelijke beoordelingen</p>
            <h1 className="rb-disp rb-rise !font-black text-[clamp(3.2rem,11vw,9.5rem)] !leading-[0.88]">
              <span className="rb-outline">Par</span>
              <span className="rb-glow text-[var(--rb-lime)]">cours</span>
              <span className="mt-2 block text-[clamp(1.2rem,3vw,2.2rem)] tracking-[0.02em] text-[var(--rb-ink)]">
                Beoordelingen
              </span>
            </h1>
            <p className="mt-6 max-w-2xl whitespace-pre-line text-[0.95rem] leading-[1.7] text-[var(--rb-muted)]">
              Gespeeld, beoordeeld en eerlijk besproken door Lars, Levi &amp; Niels.
              {"\n"}Greenfee prijzen zijn indicatief en kunnen mogelijks verouderd zijn.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {HOSTS.map((h) => {
                const p = HOST_PERSONAS[h];
                return (
                  <div
                    key={h}
                    className="inline-flex items-center gap-2 border px-3 py-1.5"
                    style={{ borderColor: `${p.color}66`, background: `${p.color}14` }}
                  >
                    <span aria-hidden="true">{p.icon}</span>
                    <span
                      className="font-rb-mono text-[0.7rem] uppercase tracking-[0.12em]"
                      style={{ color: p.color }}
                    >
                      {h} · hcp {p.handicap} · {p.tagline}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <dl className="m-0 flex gap-8 sm:gap-12">
            {[
              { v: totalCourses, l: "Parcours" },
              { v: avgScore || "—", l: "Gem. PAMPAS Score", lime: true },
              { v: fullySampled, l: "Door alle 3 gespeeld" },
            ].map((s) => (
              <div key={s.l}>
                <dd className={`rb-disp rb-num m-0 text-[clamp(2.2rem,5vw,3.5rem)] ${s.lime ? "text-[var(--rb-lime)]" : ""}`}>
                  {s.v}
                </dd>
                <dt className="rb-mono mt-2 max-w-[9rem] text-[0.62rem] text-[var(--rb-muted)] sm:text-[0.7rem]">{s.l}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* MATCH QUIZ */}
      <div className="px-6 lg:px-14 py-14 border-b border-[rgba(242,239,230,0.15)] bg-[var(--rb-surface)]">
        <h2 className="rb-mono text-[var(--rb-lime)] mb-6">
          Vind je host
        </h2>
        <MatchQuiz onMatch={setActiveHost} />
      </div>

      {/* COURSES MAP */}
      <CoursesMap courses={courses} onSelectCourse={handleSelectFromMap} />


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
            className="font-rb-mono text-[0.7rem] tracking-[0.14em] uppercase"
            style={{ color: HOST_PERSONAS[activeHost].color }}
          >
            Je bekijkt parcours door de ogen van {activeHost} {HOST_PERSONAS[activeHost].icon}
          </span>
          <button
            onClick={() => setActiveHost(null)}
            className="font-rb-mono text-[0.7rem] tracking-[0.14em] uppercase text-[var(--rb-muted)] hover:text-[var(--rb-ink)]"
          >
            Reset
          </button>
        </div>
      )}

      {/* TABS */}
      <div role="tablist" aria-label="Weergave" className="px-6 lg:px-14 border-b border-[rgba(242,239,230,0.15)] bg-[var(--rb-ground)] flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((t) => {
          const on = tab === t.key;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={on}
              onClick={() => setTab(t.key)}
              className="font-rb-mono text-[0.7rem] tracking-[0.18em] uppercase px-4 py-4 border-b-2 transition whitespace-nowrap"
              style={{
                borderColor: on ? "#B6F04A" : "transparent",
                color: on ? "#B6F04A" : "#B9C4BC",
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
          <div className="sticky top-[64px] z-10 bg-[rgba(12,26,18,0.92)] backdrop-blur px-6 lg:px-14 py-4 border-b border-[rgba(242,239,230,0.15)]">
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Zoek een parcours..."
                className="bg-[var(--rb-surface)] border border-[rgba(242,239,230,0.25)] px-3 py-2 text-[0.82rem] font-rb-sans text-[var(--rb-ink)] placeholder:text-[var(--rb-dim)] w-full md:w-64 focus:outline-none focus:border-[var(--rb-lime)]"
              />
              <select aria-label="Regio" value={region} onChange={(e) => setRegion(e.target.value)} className="select-cream">
                <option value="">Regio</option>
                {regions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <select aria-label="Land" value={country} onChange={(e) => { setCountry(e.target.value); setRegion(""); }} className="select-cream">
                <option value="">Land</option>
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select aria-label="Type baan" value={type} onChange={(e) => setType(e.target.value)} className="select-cream">
                <option value="">Type</option>
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <select aria-label="Greenfee-categorie" value={fee} onChange={(e) => setFee(e.target.value)} className="select-cream">
                <option value="">Fee</option>
                <option value="€">€</option>
                <option value="€€">€€</option>
                <option value="€€€">€€€</option>
                <option value="€€€€">€€€€</option>
              </select>
              <button
                type="button"
                aria-pressed={dogOnly}
                onClick={() => update({ dog: dogOnly ? "" : "ja" })}
                className="inline-flex items-center gap-1.5 border px-2.5 py-1.5 font-rb-mono text-[0.7rem] uppercase tracking-[0.14em] transition"
                style={{
                  background: dogOnly ? "rgba(182,240,74,0.14)" : "transparent",
                  color: dogOnly ? "#B6F04A" : "#B9C4BC",
                  borderColor: dogOnly ? "#B6F04A" : "rgba(242,239,230,0.25)",
                }}
              >
                <PawIcon size={12} /> Hondvriendelijk
              </button>
              <div className="flex items-center gap-1.5">
                {HOSTS.map((h) => {
                  const p = HOST_PERSONAS[h];
                  const on = hostFilter.has(h);
                  return (
                    <button
                      key={h}
                      onClick={() => toggleHost(h)}
                      className="font-rb-mono text-[0.7rem] tracking-[0.14em] uppercase px-2.5 py-1.5 transition border"
                      style={{
                        background: on ? `${p.color}20` : "transparent",
                        color: on ? p.color : "#B9C4BC",
                        borderColor: on ? p.color : "rgba(242,239,230,0.25)",
                      }}
                    >
                      {p.icon} {h}
                    </button>
                  );
                })}
              </div>
              <select
                aria-label="Sorteren"
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
          <div ref={listRef} className="px-6 lg:px-14 py-10 space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-20 font-rb-sans text-[var(--rb-muted)]">
                ⛳ Geen parcours gevonden. Lars, Levi en Niels moeten hier nog naartoe.
              </div>
            ) : (
              shown.map((c) => (
                <div key={c.id} id={`course-${c.id}`} className="scroll-mt-24">
                  <CourseCard
                    course={c}
                    activePersona={activeHost ? HOST_PERSONAS[activeHost] : null}
                    autoOpen={focusedCourseId === c.id}
                    detailSlug={slugMap.get(c.id)}
                  />

                </div>
              ))
            )}
            {filtered.length > shown.length && (
              <div className="pt-6 text-center">
                <button
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="rb-btn rb-btn-line"
                >
                  Toon meer parcours ({filtered.length - shown.length})
                </button>
                <p className="font-rb-sans text-[0.8rem] text-[var(--rb-muted)] mt-3">
                  {shown.length} van {filtered.length} getoond · of zoek hierboven op naam
                </p>
              </div>
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
          background: #12261a;
          border: 1px solid rgba(242,239,230,0.25);
          color: #f2efe6;
          font-family: inherit;
          font-size: 0.78rem;
          padding: 0.55rem 0.75rem;
        }
        .select-cream:focus { outline: none; border-color: #b6f04a; }
      `}</style>
    </>
  );
}
