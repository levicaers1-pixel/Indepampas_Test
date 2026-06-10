import { useMemo } from "react";
import { CRITERIA, HOSTS, HOST_PERSONAS } from "@/data/personas";
import type { CourseWithRatings } from "@/data/courses-db";

export function HostStats({ courses }: { courses: CourseWithRatings[] }) {
  const stats = useMemo(() => {
    return HOSTS.map((h) => {
      const all = courses.flatMap((c) => c.ratings.filter((r) => r.host === h));
      const avg =
        all.length > 0
          ? all.reduce((s, r) => s + Number(r.host_score), 0) / all.length
          : null;
      const perCrit: Record<string, number | null> = {};
      for (const cr of CRITERIA) {
        const vals = all.map((r) => Number((r as any)[cr.key])).filter((v) => !isNaN(v));
        perCrit[cr.key] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
      }
      return {
        host: h,
        count: all.length,
        avg,
        perCrit,
        highest: all.length
          ? all.reduce((best, r) => (Number(r.host_score) > Number(best.host_score) ? r : best))
          : null,
        lowest: all.length
          ? all.reduce((worst, r) => (Number(r.host_score) < Number(worst.host_score) ? r : worst))
          : null,
      };
    });
  }, [courses]);

  const strictest = stats.reduce((s, x) =>
    (x.avg ?? 99) < (s.avg ?? 99) ? x : s,
  );
  const mostGenerous = stats.reduce((s, x) =>
    (x.avg ?? -1) > (s.avg ?? -1) ? x : s,
  );

  // Heatmap min/max per criterion across hosts for color intensity
  const ranges = CRITERIA.map((cr) => {
    const vals = stats.map((s) => s.perCrit[cr.key]).filter((v) => v != null) as number[];
    return { key: cr.key, min: Math.min(...vals), max: Math.max(...vals) };
  });

  const courseName = (id: string | undefined) =>
    courses.find((c) => c.ratings.some((r) => r.id === id))?.name ?? "—";

  return (
    <div className="px-6 lg:px-14 py-12 bg-[#F4EFE5] border-b border-[rgba(28,61,42,0.15)]">
      <p className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#7A7260] mb-2">
        Host-statistieken
      </p>
      <h2 className="font-rb-serif font-light text-[clamp(1.8rem,3vw,2.6rem)] text-[#1C3D2A] leading-none mb-8">
        Wie geeft <em className="italic">welke punten</em>?
      </h2>

      {/* Verdict cards */}
      <div className="grid md:grid-cols-3 gap-3 mb-10">
        <VerdictCard label="Strengste" host={strictest.host} value={strictest.avg} suffix="gem. score" />
        <VerdictCard label="Mildste" host={mostGenerous.host} value={mostGenerous.avg} suffix="gem. score" />
        <VerdictCard
          label="Meest gespeeld"
          host={stats.reduce((s, x) => (x.count > s.count ? x : s)).host}
          value={stats.reduce((s, x) => (x.count > s.count ? x : s)).count}
          suffix="parcours"
          integer
        />
      </div>

      {/* Per-host stat cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => {
          const p = HOST_PERSONAS[s.host];
          return (
            <div
              key={s.host}
              className="bg-white border p-5"
              style={{ borderColor: `${p.color}55` }}
            >
              <div className="flex items-baseline justify-between mb-3">
                <div>
                  <div className="font-rb-serif text-[1.4rem] text-[#1C3D2A]">
                    {p.icon} {s.host}
                  </div>
                  <div
                    className="font-rb-mono text-[0.55rem] tracking-[0.16em] uppercase"
                    style={{ color: p.color }}
                  >
                    {p.tagline}
                  </div>
                </div>
                <div
                  className="font-rb-serif text-[2rem] leading-none"
                  style={{ color: p.color }}
                >
                  {s.avg?.toFixed(1) ?? "—"}
                </div>
              </div>
              <div className="space-y-1 font-rb-sans text-[0.75rem] text-[#1C3D2A]">
                <div className="flex justify-between border-b border-[rgba(28,61,42,0.06)] py-1">
                  <span className="text-[#7A7260]">Parcours gespeeld</span>
                  <span className="tabular-nums">{s.count}</span>
                </div>
                {s.highest && (
                  <div className="flex justify-between border-b border-[rgba(28,61,42,0.06)] py-1">
                    <span className="text-[#7A7260]">Hoogste</span>
                    <span className="truncate ml-2 text-right">
                      {courseName(s.highest.id)} ({Number(s.highest.host_score).toFixed(0)})
                    </span>
                  </div>
                )}
                {s.lowest && (
                  <div className="flex justify-between py-1">
                    <span className="text-[#7A7260]">Laagste</span>
                    <span className="truncate ml-2 text-right">
                      {courseName(s.lowest.id)} ({Number(s.lowest.host_score).toFixed(0)})
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Heatmap */}
      <div>
        <p className="font-rb-mono text-[0.6rem] tracking-[0.18em] uppercase text-[#1C3D2A] mb-3">
          Heatmap · host × criterium
        </p>
        <div className="bg-white border border-[rgba(28,61,42,0.15)] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[rgba(28,61,42,0.1)]">
                <th className="p-3 font-rb-mono text-[0.55rem] tracking-[0.16em] uppercase text-[#7A7260]">
                  Criterium
                </th>
                {HOSTS.map((h) => {
                  const p = HOST_PERSONAS[h];
                  return (
                    <th
                      key={h}
                      className="p-3 font-rb-mono text-[0.6rem] tracking-[0.14em] uppercase text-center"
                      style={{ color: p.color }}
                    >
                      {p.icon} {h}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {CRITERIA.map((cr) => {
                const range = ranges.find((r) => r.key === cr.key)!;
                return (
                  <tr key={cr.key} className="border-b border-[rgba(28,61,42,0.06)]">
                    <td className="p-3 font-rb-sans text-[0.78rem] text-[#1C3D2A]">{cr.label}</td>
                    {stats.map((s) => {
                      const v = s.perCrit[cr.key];
                      const intensity =
                        v == null || range.max === range.min
                          ? 0.3
                          : 0.25 + ((v - range.min) / (range.max - range.min)) * 0.75;
                      const p = HOST_PERSONAS[s.host];
                      return (
                        <td key={s.host} className="p-2 text-center">
                          <div
                            className="font-rb-mono text-[0.78rem] tabular-nums py-2"
                            style={{
                              background: v == null ? "#EDE6D9" : `${p.color}${Math.round(intensity * 255).toString(16).padStart(2, "0")}`,
                              color: intensity > 0.7 ? "#fff" : "#1C3D2A",
                            }}
                          >
                            {v != null ? v.toFixed(1) : "—"}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function VerdictCard({
  label,
  host,
  value,
  suffix,
  integer,
}: {
  label: string;
  host: string;
  value: number | null;
  suffix: string;
  integer?: boolean;
}) {
  const p = HOST_PERSONAS[host as keyof typeof HOST_PERSONAS];
  return (
    <div
      className="p-5 border"
      style={{ borderColor: `${p.color}55`, background: `${p.color}10` }}
    >
      <div
        className="font-rb-mono text-[0.55rem] tracking-[0.18em] uppercase"
        style={{ color: p.color }}
      >
        {label}
      </div>
      <div className="font-rb-serif text-[1.6rem] text-[#1C3D2A] mt-1">
        {p.icon} {host}
      </div>
      <div className="font-rb-sans text-[0.78rem] text-[#7A7260] mt-1">
        {value != null ? (integer ? value : value.toFixed(1)) : "—"} {suffix}
      </div>
    </div>
  );
}
