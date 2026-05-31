import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Play, ExternalLink, Flame } from "lucide-react";
import {
  CRITERIA,
  HOSTS,
  HOST_PERSONAS,
  type HostName,
  type Persona,
} from "@/data/personas";
import { personalScore, scoreColor } from "@/lib/personalScore";
import type { CourseWithRatings } from "@/data/courses-db";

function PampasScoreBadge({ score, small }: { score: number | null; small?: boolean }) {
  const { hex, label } = scoreColor(score);
  const size = small ? 56 : 88;
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at 30% 30%, ${hex}22, transparent 70%)`,
          border: `2px solid ${hex}`,
        }}
      >
        <span
          className="font-rb-serif leading-none"
          style={{ color: hex, fontSize: small ? 20 : 30 }}
        >
          {score != null ? score.toFixed(0) : "—"}
        </span>
      </div>
      {!small && (
        <span
          className="font-rb-mono uppercase tracking-[0.15em]"
          style={{ fontSize: 9, color: hex }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

function HostDot({
  host,
  rated,
  score,
}: {
  host: HostName;
  rated: boolean;
  score?: number;
}) {
  const p = HOST_PERSONAS[host];
  return (
    <div
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[0.7rem] font-rb-sans"
      style={{
        background: rated ? `${p.color}1F` : "#2A2A27",
        color: rated ? p.color : "#5C5C58",
        border: `1px solid ${rated ? p.color + "55" : "#3A3A36"}`,
      }}
    >
      <span
        className="inline-block w-2 h-2 rounded-full"
        style={{
          background: rated ? p.color : "transparent",
          border: rated ? "none" : `1.5px solid #5C5C58`,
        }}
      />
      {host}
      {rated && score != null && (
        <span className="opacity-80 font-rb-mono text-[0.65rem]">{score.toFixed(0)}</span>
      )}
    </div>
  );
}

function CriteriaBars({
  ratings,
}: {
  ratings: CourseWithRatings["ratings"];
}) {
  return (
    <div className="space-y-2.5">
      {CRITERIA.map(({ key, label, weight }) => {
        const vals = ratings.map((r) => r[key]);
        const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
        const pct = (avg / 10) * 100;
        const col = avg >= 8 ? "#1D9E75" : avg >= 7 ? "#378ADD" : avg >= 5.5 ? "#BA7517" : "#A32D2D";
        return (
          <div key={key} className="grid grid-cols-[140px_1fr_60px] items-center gap-3">
            <span className="font-rb-sans text-[0.78rem] text-[#C8C5BC]">{label}</span>
            <div className="h-[6px] bg-[#2A2A27] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: col }}
              />
            </div>
            <span className="font-rb-mono text-[0.7rem] text-[#8C8A85] text-right">
              {avg.toFixed(1)} <span className="opacity-50">· {Math.round(weight * 100)}%</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function CourseCard({
  course,
  activePersona,
}: {
  course: CourseWithRatings;
  activePersona: Persona | null;
}) {
  const [open, setOpen] = useState(false);

  const ratedHosts = new Set(course.ratings.map((r) => r.host));
  const personal = useMemo(
    () => (activePersona ? personalScore(course.ratings, activePersona.affinities) : null),
    [course.ratings, activePersona],
  );

  // Disagreement: spread > 15 between top and bottom host_score
  const scores = course.ratings.map((r) => r.host_score);
  const spread = scores.length >= 2 ? Math.max(...scores) - Math.min(...scores) : 0;
  const disagree = spread > 15;

  const onlyOneRated = course.ratings.length === 1;
  const reviewSnippet = course.ratings.find((r) => r.review)?.review ?? "";

  return (
    <div className="bg-[#1E1E1C] border border-[#2E2E2B] hover:border-[#3A3A36] transition-colors">
      {/* COLLAPSED HEADER */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left p-5 md:p-6 grid grid-cols-[1fr_auto] gap-6 items-center"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {course.region && (
              <span className="font-rb-mono text-[0.55rem] tracking-[0.2em] uppercase text-[#8C8A85]">
                {course.region}
                {course.country !== "België" ? ` · ${course.country}` : ""}
              </span>
            )}
            {course.type && (
              <span className="font-rb-mono text-[0.55rem] tracking-[0.2em] uppercase px-2 py-0.5 bg-[#252523] text-[#C8C5BC] rounded-sm">
                {course.type}
              </span>
            )}
            {course.fee_category && (
              <span className="font-rb-mono text-[0.6rem] text-[#BA7517]">{course.fee_category}</span>
            )}
            {disagree && (
              <span className="inline-flex items-center gap-1 font-rb-mono text-[0.55rem] tracking-[0.15em] uppercase text-[#DB6B4A] bg-[#2E1810] px-2 py-0.5 rounded-sm">
                <Flame size={10} /> Verdeeld oordeel
              </span>
            )}
            {onlyOneRated && (
              <span className="font-rb-mono text-[0.55rem] tracking-[0.15em] uppercase text-[#8C8A85] bg-[#252523] px-2 py-0.5 rounded-sm">
                Enkel door {course.ratings[0].host}
              </span>
            )}
          </div>
          <h3 className="font-rb-serif text-[1.6rem] md:text-[1.85rem] text-[#F5F3EE] leading-tight">
            {course.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            {HOSTS.map((h) => {
              const r = course.ratings.find((x) => x.host === h);
              return <HostDot key={h} host={h} rated={ratedHosts.has(h)} score={r?.host_score} />;
            })}
            {course.episode_url && (
              <a
                href={course.episode_url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 font-rb-mono text-[0.6rem] tracking-[0.15em] uppercase text-[#1DB954] hover:text-[#2DBF7E] ml-1"
              >
                <Play size={10} /> Episode
              </a>
            )}
          </div>
          {reviewSnippet && (
            <p className="font-rb-sans text-[0.85rem] text-[#8C8A85] mt-3 line-clamp-2 max-w-2xl">
              "{reviewSnippet.slice(0, 140)}{reviewSnippet.length > 140 ? "…" : ""}"
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end gap-1.5">
            <PampasScoreBadge score={course.pampasScore} />
            {activePersona && personal != null && (
              <div
                className="font-rb-mono text-[0.6rem] tracking-[0.1em] uppercase px-2 py-0.5 rounded-sm"
                style={{
                  color: activePersona.color,
                  background: activePersona.color + "1F",
                }}
                title={`Berekend op basis van wat ${activePersona.name} het meest waardeert`}
              >
                {activePersona.icon} jouw: {personal}
              </div>
            )}
          </div>
          <ChevronDown
            size={20}
            className="text-[#8C8A85] transition-transform"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}
          />
        </div>
      </button>

      {/* EXPANDED */}
      {open && (
        <div className="border-t border-[#2E2E2B] p-5 md:p-6 space-y-8 bg-[#1A1A18]">
          {/* PER HOST */}
          <div>
            <h4 className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#8C8A85] mb-4">
              Per host
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {HOSTS.map((h) => {
                const r = course.ratings.find((x) => x.host === h);
                const p = HOST_PERSONAS[h];
                if (!r) {
                  return (
                    <div
                      key={h}
                      className="p-3 border border-dashed border-[#2E2E2B] rounded-sm"
                    >
                      <div className="font-rb-mono text-[0.65rem] uppercase tracking-[0.15em] text-[#5C5C58]">
                        {p.icon} {h}
                      </div>
                      <div className="font-rb-sans text-[0.78rem] text-[#5C5C58] mt-1.5">
                        Nog niet gespeeld
                      </div>
                    </div>
                  );
                }
                return (
                  <div
                    key={h}
                    className="p-3 rounded-sm"
                    style={{ background: p.bgLight, border: `1px solid ${p.color}33` }}
                  >
                    <div className="flex items-baseline justify-between mb-2">
                      <span
                        className="font-rb-mono text-[0.65rem] uppercase tracking-[0.15em]"
                        style={{ color: p.color }}
                      >
                        {p.icon} {h}
                      </span>
                      <span
                        className="font-rb-serif text-[1.6rem] leading-none"
                        style={{ color: p.color }}
                      >
                        {r.host_score.toFixed(0)}
                      </span>
                    </div>
                    {/* mini bars */}
                    <div className="space-y-1 mt-2">
                      {CRITERIA.map(({ key, label }) => (
                        <div
                          key={key}
                          className="grid grid-cols-[1fr_28px] items-center gap-2"
                        >
                          <div
                            className="h-[3px] rounded-full"
                            style={{ background: `${p.color}22` }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${(r[key] / 10) * 100}%`, background: p.color }}
                              title={label}
                            />
                          </div>
                          <span className="font-rb-mono text-[0.55rem] text-[#8C8A85] text-right">
                            {r[key]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CRITERIA AVG */}
          <div>
            <h4 className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#8C8A85] mb-4">
              Gemiddelde per criterium
            </h4>
            <CriteriaBars ratings={course.ratings} />
          </div>

          {/* VERDICTS */}
          <div>
            <h4 className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#8C8A85] mb-4">
              Verdicts
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-rb-sans text-[0.8rem]">
                <thead>
                  <tr className="text-[#5C5C58] font-rb-mono text-[0.55rem] tracking-[0.15em] uppercase">
                    <th className="pb-2 pr-4">Host</th>
                    <th className="pb-2 pr-4">Hole van de dag</th>
                    <th className="pb-2 pr-4">Terugkomen?</th>
                    <th className="pb-2 pr-4">Eén woord</th>
                  </tr>
                </thead>
                <tbody>
                  {course.ratings.map((r) => {
                    const p = HOST_PERSONAS[r.host];
                    return (
                      <tr key={r.id} className="border-t border-[#2E2E2B]">
                        <td className="py-2 pr-4" style={{ color: p.color }}>
                          {p.icon} {r.host}
                        </td>
                        <td className="py-2 pr-4 text-[#C8C5BC]">{r.hole_of_day ?? "—"}</td>
                        <td className="py-2 pr-4 text-[#C8C5BC]">{r.would_return ?? "—"}</td>
                        <td className="py-2 pr-4 italic text-[#C8C5BC]">
                          {r.one_word ?? "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* DETAILS */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-rb-mono text-[0.65rem] uppercase tracking-[0.12em] text-[#8C8A85]">
            {course.greenfee != null && (
              <span>
                Greenfee · <span className="text-[#F5F3EE]">€{course.greenfee}</span>
              </span>
            )}
            <span>
              Holes · <span className="text-[#F5F3EE]">{course.holes}</span>
            </span>
            {course.website && (
              <a
                href={course.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[#378ADD] hover:text-[#5BA8E8]"
              >
                Website <ExternalLink size={10} />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// satisfy unused import linter
void Link;
