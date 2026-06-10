import { useMemo, useState } from "react";
import { CRITERIA, HOSTS, HOST_PERSONAS, type HostName } from "@/data/personas";
import { scoreColor } from "@/lib/personalScore";
import type { CourseWithRatings } from "@/data/courses-db";

export function CourseCompare({ courses }: { courses: CourseWithRatings[] }) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const picked = selected
    .map((id) => courses.find((c) => c.id === id))
    .filter(Boolean) as CourseWithRatings[];

  const winner = useMemo(() => {
    if (picked.length < 2) return null;
    return picked.reduce((best, c) =>
      (c.pampasScore ?? -1) > (best.pampasScore ?? -1) ? c : best,
    );
  }, [picked]);

  const avgFor = (c: CourseWithRatings, key: keyof CourseWithRatings["ratings"][number]) => {
    const vals = c.ratings.map((r) => Number(r[key])).filter((v) => !isNaN(v));
    if (!vals.length) return null;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  };

  return (
    <div className="px-6 lg:px-14 py-12 bg-[#EDE6D9] border-b border-[rgba(28,61,42,0.15)]">
      <p className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#7A7260] mb-2">
        Banen-vergelijker
      </p>
      <h2 className="font-rb-serif font-light text-[clamp(1.8rem,3vw,2.6rem)] text-[#1C3D2A] leading-none mb-6">
        Zet ze <em className="italic">naast elkaar</em>.
      </h2>
      <p className="font-rb-sans text-[0.85rem] text-[#7A7260] max-w-2xl mb-6">
        Kies 2 of 3 parcours en vergelijk hun scores per criterium. Wie wint de duel?
      </p>

      <div className="mb-6">
        <p className="font-rb-mono text-[0.6rem] tracking-[0.18em] uppercase text-[#1C3D2A] mb-2">
          Selecteer ({selected.length}/3)
        </p>
        <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-2">
          {courses.map((c) => {
            const on = selected.includes(c.id);
            const disabled = !on && selected.length >= 3;
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                disabled={disabled}
                className="font-rb-sans text-[0.72rem] px-2.5 py-1 border transition"
                style={{
                  background: on ? "#1C3D2A" : "#fff",
                  color: on ? "#F4EFE5" : disabled ? "#bbb" : "#1C3D2A",
                  borderColor: on ? "#1C3D2A" : "rgba(28,61,42,0.2)",
                  opacity: disabled ? 0.5 : 1,
                }}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {picked.length < 2 ? (
        <div className="text-center py-10 font-rb-sans text-[#7A7260] text-[0.85rem]">
          Kies minstens twee parcours om te vergelijken.
        </div>
      ) : (
        <div className="bg-white border border-[rgba(28,61,42,0.15)] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[rgba(28,61,42,0.1)]">
                <th className="p-3 font-rb-mono text-[0.58rem] tracking-[0.16em] uppercase text-[#7A7260]">
                  Criterium
                </th>
                {picked.map((c) => {
                  const isWin = winner?.id === c.id;
                  const { hex } = scoreColor(c.pampasScore);
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
                        <span className="font-rb-mono text-[0.55rem] tracking-[0.14em] uppercase text-[#7A7260]">
                          {c.region ?? "—"} · {c.fee_category ?? "—"}
                        </span>
                        <span
                          className="font-rb-serif text-[1.6rem] leading-none mt-1"
                          style={{ color: hex }}
                        >
                          {c.pampasScore?.toFixed(0) ?? "—"}
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
                                  background: isTop ? "#1C3D2A" : "#7A7260",
                                }}
                              />
                            </div>
                            <span
                              className="font-rb-mono text-[0.7rem] tabular-nums w-8 text-right"
                              style={{ color: isTop ? "#1C3D2A" : "#7A7260" }}
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
