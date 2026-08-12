import { useMemo, useRef, useState } from "react";
import { CRITERIA, HOSTS, HOST_PERSONAS, type HostName } from "@/data/personas";
import { scoreColor } from "@/lib/personalScore";
import { useCombinedScore } from "@/lib/useCourseVotes";
import type { CourseWithRatings } from "@/data/courses-db";

export function CourseCompare({ courses }: { courses: CourseWithRatings[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [country, setCountry] = useState<string>("all");
  const [query, setQuery] = useState<string>("");
  const [open, setOpen] = useState(false);
  const combinedScore = useCombinedScore();
  const inputRef = useRef<HTMLInputElement>(null);

  const countries = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => c.country && set.add(c.country));
    return Array.from(set).sort();
  }, [courses]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const remove = (id: string) => setSelected((prev) => prev.filter((x) => x !== id));

  const picked = selected
    .map((id) => courses.find((c) => c.id === id))
    .filter(Boolean) as CourseWithRatings[];

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses
      .filter((c) => !selected.includes(c.id))
      .filter((c) => (country === "all" ? true : c.country === country))
      .filter((c) =>
        q
          ? c.name.toLowerCase().includes(q) ||
            (c.region ?? "").toLowerCase().includes(q)
          : true,
      )
      .slice(0, 8);
  }, [courses, selected, country, query]);

  const winner = useMemo(() => {
    if (picked.length < 2) return null;
    return picked.reduce((best, c) =>
      (combinedScore(c) ?? -1) > (combinedScore(best) ?? -1) ? c : best,
    );
  }, [picked, combinedScore]);

  const avgFor = (c: CourseWithRatings, key: keyof CourseWithRatings["ratings"][number]) => {
    const vals = c.ratings.map((r) => Number(r[key])).filter((v) => !isNaN(v));
    if (!vals.length) return null;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  };

  const canAddMore = selected.length < 3;

  return (
    <div className="px-6 lg:px-14 py-12 bg-[#EDE6D9] border-b border-[rgba(28,61,42,0.15)]">
      <p className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#635C4B] mb-2">
        Banen-vergelijker
      </p>
      <h2 className="font-rb-serif font-light text-[clamp(1.8rem,3vw,2.6rem)] text-[#1C3D2A] leading-none mb-6">
        Zet ze <em className="italic">naast elkaar</em>.
      </h2>
      <p className="font-rb-sans text-[0.85rem] text-[#635C4B] max-w-2xl mb-6">
        Filter op land en zoek baan per baan. Kies tot 3 parcours om naast elkaar te leggen.
      </p>

      <div className="mb-6 max-w-2xl">
        <p className="font-rb-mono text-[0.6rem] tracking-[0.18em] uppercase text-[#1C3D2A] mb-2">
          Selectie ({selected.length}/3)
        </p>

        <div className="flex flex-col sm:flex-row gap-2 mb-2">
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="font-rb-sans text-[0.78rem] px-3 py-2 bg-white border border-[rgba(28,61,42,0.2)] text-[#1C3D2A] sm:w-44"
          >
            <option value="all">Alle landen</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={query}
              disabled={!canAddMore}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              placeholder={canAddMore ? "Zoek een baan…" : "Max 3 banen geselecteerd"}
              className="w-full font-rb-sans text-[0.78rem] px-3 py-2 bg-white border border-[rgba(28,61,42,0.2)] text-[#1C3D2A] placeholder:text-[#999] disabled:opacity-50"
            />
            {open && canAddMore && suggestions.length > 0 && (
              <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-[rgba(28,61,42,0.2)] shadow-lg max-h-64 overflow-y-auto">
                {suggestions.map((c) => (
                  <button
                    key={c.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      toggle(c.id);
                      setQuery("");
                      inputRef.current?.focus();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-[#EDE6D9] flex items-center justify-between gap-3 border-b border-[rgba(28,61,42,0.06)] last:border-b-0"
                  >
                    <span className="font-rb-sans text-[0.8rem] text-[#1C3D2A]">{c.name}</span>
                    <span className="font-rb-mono text-[0.55rem] tracking-[0.14em] uppercase text-[#635C4B]">
                      {c.country}{c.region ? ` · ${c.region}` : ""}
                    </span>
                  </button>
                ))}
              </div>
            )}
            {open && canAddMore && suggestions.length === 0 && query.trim() && (
              <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-[rgba(28,61,42,0.2)] shadow-lg px-3 py-2 font-rb-sans text-[0.78rem] text-[#635C4B]">
                Geen banen gevonden.
              </div>
            )}
          </div>
        </div>

        {picked.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {picked.map((c) => (
              <span
                key={c.id}
                className="inline-flex items-center gap-2 font-rb-sans text-[0.72rem] px-2.5 py-1 border"
                style={{
                  background: "#1C3D2A",
                  color: "#F4EFE5",
                  borderColor: "#1C3D2A",
                }}
              >
                {c.name}
                <button
                  onClick={() => remove(c.id)}
                  className="font-rb-mono text-[0.7rem] leading-none opacity-80 hover:opacity-100"
                  aria-label={`Verwijder ${c.name}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>


      {picked.length < 2 ? (
        <div className="text-center py-10 font-rb-sans text-[#635C4B] text-[0.85rem]">
          Kies minstens twee parcours om te vergelijken.
        </div>
      ) : (
        <div className="bg-white border border-[rgba(28,61,42,0.15)] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[rgba(28,61,42,0.1)]">
                <th className="p-3 font-rb-mono text-[0.58rem] tracking-[0.16em] uppercase text-[#635C4B]">
                  Criterium
                </th>
                {picked.map((c) => {
                  const isWin = winner?.id === c.id;
                  const { hex } = scoreColor(combinedScore(c));
                  return (
                    <th key={c.id} className="p-3 align-bottom">
                      <div className="flex flex-col gap-1">
                        {isWin && (
                          <span
                            className="self-start font-rb-mono text-[0.5rem] tracking-[0.18em] uppercase px-1.5 py-0.5"
                            style={{ background: "#1C3D2A", color: "#F4EFE5" }}
                          >
                            ★ Winnaar
                          </span>
                        )}
                        <span className="font-rb-serif text-[1.05rem] text-[#1C3D2A]">
                          {c.name}
                        </span>
                        <span className="font-rb-mono text-[0.55rem] tracking-[0.14em] uppercase text-[#635C4B]">
                          {c.region ?? "—"} · {c.fee_category ?? "—"}
                        </span>
                        <span
                          className="font-rb-serif text-[1.6rem] leading-none mt-1"
                          style={{ color: hex }}
                        >
                          {combinedScore(c)?.toFixed(0) ?? "—"}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {CRITERIA.map((cr) => {
                const vals = picked.map((c) => avgFor(c, cr.key as any));
                const max = Math.max(...vals.map((v) => v ?? -1));
                return (
                  <tr key={cr.key} className="border-b border-[rgba(28,61,42,0.06)]">
                    <td className="p-3 font-rb-sans text-[0.78rem] text-[#1C3D2A]">{cr.label}</td>
                    {picked.map((c, i) => {
                      const v = vals[i];
                      const isTop = v != null && v === max && picked.length > 1;
                      return (
                        <td key={c.id} className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-[#EDE6D9] relative">
                              <div
                                className="absolute inset-y-0 left-0"
                                style={{
                                  width: `${((v ?? 0) / 10) * 100}%`,
                                  background: isTop ? "#1C3D2A" : "#635C4B",
                                }}
                              />
                            </div>
                            <span
                              className="font-rb-mono text-[0.7rem] tabular-nums w-8 text-right"
                              style={{ color: isTop ? "#1C3D2A" : "#635C4B" }}
                            >
                              {v != null ? v.toFixed(1) : "—"}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              <tr className="bg-[#F4EFE5]">
                <td className="p-3 font-rb-mono text-[0.6rem] tracking-[0.16em] uppercase text-[#1C3D2A]">
                  Host-verdicten
                </td>
                {picked.map((c) => (
                  <td key={c.id} className="p-3 space-y-2">
                    {HOSTS.map((h) => {
                      const r = c.ratings.find((x) => x.host === h);
                      const p = HOST_PERSONAS[h];
                      if (!r) return (
                        <div key={h} className="font-rb-mono text-[0.55rem] tracking-[0.14em] uppercase text-[#bbb]">
                          {p.icon} {h}: nog niet gespeeld
                        </div>
                      );
                      return (
                        <div key={h} className="flex items-center gap-2">
                          <span className="font-rb-mono text-[0.55rem] tracking-[0.14em] uppercase" style={{ color: p.color }}>
                            {p.icon} {h}
                          </span>
                          <span className="font-rb-mono text-[0.72rem] text-[#1C3D2A] tabular-nums">
                            {Number(r.host_score).toFixed(0)}
                          </span>
                        </div>
                      );
                    })}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
