import { useEffect, useMemo, useState } from "react";
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
import { PhotoCarousel } from "@/components/ratings/PhotoCarousel";
import { CommunityVote } from "@/components/ratings/CommunityVote";
import { useCourseVotes } from "@/lib/useCourseVotes";
import { weightedCommunityScore } from "@/lib/communityVotes";

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
          background: `radial-gradient(circle at 30% 30%, ${hex}18, transparent 70%)`,
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

const COMMUNITY_COLOR = "#9B6AD4";

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
      className="inline-flex items-center gap-1.5 px-2 py-1 text-[0.7rem] font-rb-sans border"
      style={{
        background: rated ? `${p.color}14` : "transparent",
        color: rated ? p.color : "#A09684",
        borderColor: rated ? `${p.color}55` : "rgba(28,61,42,0.15)",
      }}
    >
      <span
        className="inline-block w-2 h-2 rounded-full"
        style={{
          background: rated ? p.color : "transparent",
          border: rated ? "none" : "1.5px solid #A09684",
        }}
      />
      {host}
      {rated && score != null && (
        <span className="opacity-80 font-rb-mono text-[0.65rem]">{score.toFixed(0)}</span>
      )}
    </div>
  );
}

function CommunityDot({
  avg,
  count,
}: {
  avg: number | null;
  count: number;
}) {
  const rated = count > 0 && avg != null;
  return (
    <div
      className="inline-flex items-center gap-1.5 px-2 py-1 text-[0.7rem] font-rb-sans border"
      style={{
        background: rated ? `${COMMUNITY_COLOR}14` : "transparent",
        color: rated ? COMMUNITY_COLOR : "#A09684",
        borderColor: rated ? `${COMMUNITY_COLOR}55` : "rgba(28,61,42,0.15)",
      }}
    >
      <span
        className="inline-block w-2 h-2 rounded-full"
        style={{
          background: rated ? COMMUNITY_COLOR : "transparent",
          border: rated ? "none" : "1.5px solid #A09684",
        }}
      />
      <span>Community</span>
      {rated && (
        <span className="opacity-80 font-rb-mono text-[0.65rem]">
          {avg.toFixed(0)} ({count} {count === 1 ? "stem" : "stemmen"})
        </span>
      )}
    </div>
  );
}

function QuickVoteModal({
  courseName,
  initial,
  saving,
  error,
  onClose,
  onSubmit,
}: {
  courseName: string;
  initial: number | null;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (score: number) => void;
}) {
  const [value, setValue] = useState(initial ?? 75);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md bg-[#FBF8F1] border border-[rgba(28,61,42,0.2)] p-6"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Stem op ${courseName}`}
      >
        <p className="font-rb-mono text-[0.6rem] tracking-[0.22em] uppercase text-[#635C4B]">
          Stem nu
        </p>
        <h3 className="font-rb-serif text-2xl text-[#1C3D2A] mt-1">{courseName}</h3>
        <p className="font-rb-sans text-sm text-[#2E2B25] mt-3">
          Geef deze baan een score van 0 tot 100
        </p>
        <div className="mt-3 flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={value}
            aria-label="Score (0-100)"
            onChange={(e) => setValue(Number(e.target.value))}
            className="flex-1 accent-[#3D7A52]"
          />
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            value={value}
            aria-label="Score getal (0-100)"
            onChange={(e) =>
              setValue(Math.max(0, Math.min(100, Math.round(Number(e.target.value) || 0))))
            }
            className="w-20 border border-[rgba(28,61,42,0.25)] bg-white px-2 py-1 font-rb-mono text-sm text-[#1C3D2A]"
          />
        </div>
        {error && <p className="font-rb-sans text-sm text-[#A32D2D] mt-3">{error}</p>}
        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSubmit(value)}
            disabled={saving}
            className="font-rb-mono text-[0.65rem] tracking-[0.18em] uppercase bg-[#1C3D2A] text-[#F4EFE5] px-5 py-2.5 disabled:opacity-60"
          >
            {saving ? "Bezig…" : initial == null ? "Stem" : "Stem bijwerken"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="font-rb-mono text-[0.65rem] tracking-[0.18em] uppercase text-[#635C4B] hover:text-[#1C3D2A]"
          >
            Annuleer
          </button>
        </div>
      </div>
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
        const col = avg >= 8 ? "#3D7A52" : avg >= 7 ? "#8FBF4A" : avg >= 5.5 ? "#BA7517" : "#A32D2D";
        return (
          <div key={key} className="grid grid-cols-[90px_1fr_56px] md:grid-cols-[140px_1fr_60px] items-center gap-2 md:gap-3">
            <span className="font-rb-sans text-[0.72rem] md:text-[0.78rem] text-[#2E2B25] truncate">{label}</span>
            <div className="h-[6px] bg-[#EDE6D9] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: col }}
              />
            </div>
            <span className="font-rb-mono text-[0.65rem] md:text-[0.7rem] text-[#635C4B] text-right whitespace-nowrap">
              {avg.toFixed(1)} <span className="opacity-60">· {Math.round(weight * 100)}%</span>
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
  autoOpen,
  detailSlug,
}: {
  course: CourseWithRatings;
  activePersona: Persona | null;
  autoOpen?: boolean;
  detailSlug?: string;
}) {
  const [open, setOpen] = useState(!!autoOpen);
  useEffect(() => {
    if (autoOpen) setOpen(true);
  }, [autoOpen]);

  const { scores: communityScores } = useCourseVotes(course.id);
  const hostScores = course.ratings.map((r) => Number(r.host_score));
  const combinedScore =
    weightedCommunityScore(hostScores, communityScores) ?? course.pampasScore;

  const ratedHosts = new Set(course.ratings.map((r) => r.host));
  const personal = useMemo(
    () => (activePersona ? personalScore(course.ratings, activePersona.affinities) : null),
    [course.ratings, activePersona],
  );

  const scores = course.ratings.map((r) => r.host_score);
  const spread = scores.length >= 2 ? Math.max(...scores) - Math.min(...scores) : 0;
  const disagree = spread > 15;

  const onlyOneRated = course.ratings.length === 1;
  const reviewSnippet = course.ratings.find((r) => r.review)?.review ?? "";



  return (
    <div className="bg-white border border-[rgba(28,61,42,0.15)] hover:border-[rgba(28,61,42,0.35)] transition-colors">
      {/* COLLAPSED HEADER */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left p-4 md:p-6 grid grid-cols-[minmax(0,1fr)_auto] gap-3 md:gap-6 items-start md:items-center"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {course.region && (
              <span className="font-rb-mono text-[0.55rem] tracking-[0.2em] uppercase text-[#635C4B]">
                {course.region}
                {course.country !== "België" ? ` · ${course.country}` : ""}
              </span>
            )}
            {course.type && (
              <span className="font-rb-mono text-[0.55rem] tracking-[0.2em] uppercase px-2 py-0.5 bg-[#EDE6D9] text-[#1C3D2A]">
                {course.type}
              </span>
            )}
            {course.fee_category && (
              <span className="font-rb-mono text-[0.6rem] text-[#BA7517]">{course.fee_category}</span>
            )}
            {disagree && (
              <span className="inline-flex items-center gap-1 font-rb-mono text-[0.55rem] tracking-[0.15em] uppercase text-[#A32D2D] bg-[#F5E4DC] px-2 py-0.5">
                <Flame size={10} /> Verdeeld oordeel
              </span>
            )}
            {onlyOneRated && (
              <span className="font-rb-mono text-[0.55rem] tracking-[0.15em] uppercase text-[#635C4B] bg-[#EDE6D9] px-2 py-0.5">
                Enkel door {course.ratings[0].host}
              </span>
            )}
          </div>
          <h3 className="font-rb-serif text-[1.6rem] md:text-[1.85rem] text-[#1C3D2A] leading-tight">
            {course.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            {HOSTS.map((h) => {
              const r = course.ratings.find((x) => x.host === h);
              return <HostDot key={h} host={h} rated={ratedHosts.has(h)} score={r?.host_score} />;
            })}
            <CommunityDot
              avg={communityScores.length > 0 ? communityScores.reduce((a, b) => a + b, 0) / communityScores.length : null}
              count={communityScores.length}
            />
            {course.episode_url && (
              <a
                href={course.episode_url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 font-rb-mono text-[0.6rem] tracking-[0.14em] uppercase text-[#3D7A52] hover:text-[#1C3D2A] ml-1"
              >
                <Play size={10} /> Episode
              </a>
            )}
          </div>
          {reviewSnippet && (
            <p className="font-rb-sans text-[0.8rem] md:text-[0.85rem] text-[#635C4B] mt-3 line-clamp-3 md:line-clamp-2 max-w-2xl italic">
              "{reviewSnippet}"
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <div className="flex flex-col items-end gap-1.5">
            <div className="md:hidden">
              <PampasScoreBadge score={combinedScore} small />
            </div>
            <div className="hidden md:block">
              <PampasScoreBadge score={combinedScore} />
            </div>
            {activePersona && personal != null && (
              <div
                className="font-rb-mono text-[0.55rem] md:text-[0.6rem] tracking-[0.1em] uppercase px-1.5 md:px-2 py-0.5 whitespace-nowrap"
                style={{
                  color: activePersona.color,
                  background: `${activePersona.color}18`,
                }}
                title={`Berekend op basis van wat ${activePersona.name} het meest waardeert`}
              >
                {activePersona.icon} jouw: {personal}
              </div>
            )}
          </div>
          <ChevronDown
            size={20}
            className="text-[#635C4B] transition-transform"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}
          />
        </div>
      </button>

      {/* EXPANDED */}
      {open && (
        <div className="border-t border-[rgba(28,61,42,0.15)] p-4 md:p-6 space-y-6 md:space-y-8 bg-[#F4EFE5]">
          {/* PHOTOS */}
          {course.photos.length > 0 && (
            <div>
              <h4 className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#1C3D2A] mb-3">
                Foto's
              </h4>
              <PhotoCarousel photos={course.photos} alt={course.name} />
            </div>
          )}

          {/* PER HOST */}
          <div>
            <h4 className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#1C3D2A] mb-4">
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
                      className="p-4 border border-dashed border-[rgba(28,61,42,0.2)] bg-white/40"
                    >
                      <div className="font-rb-mono text-[0.65rem] uppercase tracking-[0.15em] text-[#A09684]">
                        {p.icon} {h}
                      </div>
                      <div className="font-rb-sans text-[0.78rem] text-[#A09684] mt-1.5">
                        Nog niet gespeeld
                      </div>
                    </div>
                  );
                }
                return (
                  <div
                    key={h}
                    className="p-4 bg-white flex flex-col"
                    style={{ border: `1px solid ${p.color}44` }}
                  >
                    <div className="flex items-baseline justify-between mb-3">
                      <span
                        className="font-rb-mono text-[0.65rem] uppercase tracking-[0.15em]"
                        style={{ color: p.color }}
                      >
                        {p.icon} {h}
                      </span>
                      <span
                        className="font-rb-serif text-[1.8rem] leading-none"
                        style={{ color: p.color }}
                      >
                        {r.host_score.toFixed(0)}
                        <span className="text-[0.75rem] opacity-50 ml-0.5">/100</span>
                      </span>
                    </div>

                    {r.review && (
                      <p className="font-rb-sans text-[0.82rem] text-[#2E2B25] leading-[1.6] italic mb-3 flex-1">
                        “{r.review}”
                      </p>
                    )}

                    <div className="mt-auto space-y-2 pt-3 border-t border-[rgba(28,61,42,0.1)]">
                      {r.one_word && (
                        <div className="flex flex-col gap-0.5">
                          <span className="font-rb-mono text-[0.55rem] uppercase tracking-[0.12em] text-[#A09684]">In één woord</span>
                          <span className="font-rb-sans text-[0.8rem] text-[#1C3D2A] break-words">{r.one_word}</span>
                        </div>
                      )}
                      {r.hole_of_day && (
                        <div className="flex flex-col gap-0.5">
                          <span className="font-rb-mono text-[0.55rem] uppercase tracking-[0.12em] text-[#A09684]">Hole van de dag</span>
                          <span className="font-rb-sans text-[0.8rem] text-[#1C3D2A] break-words">{r.hole_of_day}</span>
                        </div>
                      )}
                      {r.would_return && (
                        <div className="flex flex-col gap-0.5">
                          <span className="font-rb-mono text-[0.55rem] uppercase tracking-[0.12em] text-[#A09684]">Terugkomen?</span>
                          <span className="font-rb-sans text-[0.8rem] text-[#1C3D2A] break-words">{r.would_return}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CRITERIA AVG */}
          <div>
            <h4 className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#1C3D2A] mb-4">
              Gemiddelde per criterium
            </h4>
            <CriteriaBars ratings={course.ratings} />
          </div>

          {/* COMMUNITY VOTE */}
          <CommunityVote course={course} />



          {/* DETAILS */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-rb-mono text-[0.65rem] uppercase tracking-[0.12em] text-[#635C4B]">
            {course.greenfee != null && (
              <span>
                Greenfee · <span className="text-[#1C3D2A]">€{course.greenfee}</span>
              </span>
            )}
            <span>
              Holes · <span className="text-[#1C3D2A]">{course.holes}</span>
            </span>
            {course.website && (
              <a
                href={course.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[#3D7A52] hover:text-[#1C3D2A]"
              >
                Website <ExternalLink size={10} />
              </a>
            )}
            {detailSlug && (
              <Link
                to="/courses/$slug"
                params={{ slug: detailSlug }}
                className="inline-flex items-center gap-1 text-[#3D7A52] hover:text-[#1C3D2A] ml-auto"
              >
                Volledige pagina →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
