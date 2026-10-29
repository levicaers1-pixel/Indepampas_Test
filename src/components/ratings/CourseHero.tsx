import { Link } from "@tanstack/react-router";
import { HOSTS, HOST_PERSONAS } from "@/data/personas";
import type { CourseWithRatings } from "@/data/courses-db";
import { useCourseVotes } from "@/lib/useCourseVotes";
import { weightedCommunityScore } from "@/lib/communityVotes";

function fmt(n: number) {
  return Number.isInteger(n) ? n.toFixed(0) : n.toFixed(1);
}

/** Splits a course name into an outlined start and a glowing lime end. */
function splitName(name: string): [string, string] {
  const words = name.trim().split(/\s+/);
  if (words.length <= 1) return [name, ""];
  const tail = words.length >= 4 ? 2 : 1;
  return [words.slice(0, -tail).join(" "), words.slice(-tail).join(" ")];
}

/** Hero of a course page: outline title, giant score on a ruler, one tile per host. */
export function CourseHero({ course }: { course: CourseWithRatings }) {
  const { scores: communityScores } = useCourseVotes(course.id);
  const hostScores = course.ratings.map((r) => Number(r.host_score));
  const score = weightedCommunityScore(hostScores, communityScores) ?? course.pampasScore;
  const [head, tail] = splitName(course.name);
  const cover = course.photos[0]?.image_url;
  const location = [course.region, course.country].filter(Boolean).join(" · ");

  return (
    <section className="rb-noise relative -mt-[64px] overflow-hidden border-b border-[var(--rb-rule)] pt-[64px]">
      {cover && (
        <img
          src={cover}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,26,18,0.6)_0%,rgba(12,26,18,0.25)_35%,rgba(12,26,18,0.95)_100%)]"
      />
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
        className="rb-grid absolute inset-0 opacity-70 [mask-image:linear-gradient(180deg,transparent,#000_40%,transparent)]"
      />

      <div className="relative mx-auto max-w-[1320px] px-6 pb-12 pt-10 lg:px-14">
        <nav
          aria-label="Broodkruimels"
          className="rb-mono mb-8 flex flex-wrap gap-2 text-[var(--rb-ink-2)]"
        >
          <Link to="/" className="no-underline hover:text-[var(--rb-lime)]">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/golfbanen" className="no-underline hover:text-[var(--rb-lime)]">Golfbanen</Link>
          <span aria-hidden="true">/</span>
          <span className="text-[var(--rb-lime)]">{course.name}</span>
        </nav>

        <div className="flex flex-wrap items-end justify-between gap-10">
          <div className="min-w-0 flex-1 basis-[520px]">
            <h1 className="rb-disp rb-rise !font-black !leading-[0.9] text-[clamp(2.4rem,7.6vw,6.8rem)] [overflow-wrap:anywhere]">
              <span className="rb-outline">{head}</span>
              {tail && (
                <>
                  {" "}
                  <span className="rb-glow text-[var(--rb-lime)]">{tail}</span>
                </>
              )}
            </h1>
            <ul className="m-0 mt-7 flex list-none flex-wrap gap-2.5 p-0">
              {[location, course.type, `${course.holes} holes`, course.fee_category]
                .filter(Boolean)
                .map((t) => (
                  <li
                    key={t as string}
                    className="rb-mono border-[1.5px] border-[rgba(242,239,230,0.5)] px-3.5 py-2 text-[0.7rem]"
                  >
                    {t}
                  </li>
                ))}
            </ul>
          </div>

          <div className="shrink-0 text-left sm:text-right" aria-label={score != null ? `Pampas Score ${fmt(score)} op 100` : "Nog geen Pampas Score"}>
            <p className="rb-mono mb-1.5 text-[var(--rb-lime)]">Pampas Score</p>
            <p className="rb-disp rb-num rb-glow rb-rise m-0 text-[clamp(5rem,13vw,11rem)] leading-[0.85] text-[var(--rb-lime)] [animation-delay:0.2s]">
              {score != null ? fmt(score) : "—"}
            </p>
            {score != null ? (
              <div className="relative ml-auto mt-5 w-full max-w-[320px]" aria-hidden="true">
                <div className="h-1 bg-[var(--rb-surface-2)]">
                  <div className="h-full bg-[var(--rb-lime)]" style={{ width: `${Math.min(100, score)}%` }} />
                </div>
                <span
                  className="absolute -top-2 h-6 w-[2px] bg-[var(--rb-lime)]"
                  style={{ left: `${Math.min(100, score)}%` }}
                />
                <div className="rb-mono rb-num mt-2 flex justify-between text-[0.6rem] text-[var(--rb-ink-2)]">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
            ) : (
              <p className="mt-3 max-w-[16rem] text-sm text-[var(--rb-muted)] sm:ml-auto">
                Nog niet door de hosts gespeeld. Geef jij alvast een score.
              </p>
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {HOSTS.map((h) => {
            const p = HOST_PERSONAS[h];
            const r = course.ratings.find((x) => x.host === h);
            return (
              <div
                key={h}
                className="rb-cut relative bg-[rgba(12,26,18,0.78)] px-5 pb-5 pt-6 backdrop-blur-sm"
              >
                <span className="absolute left-0 right-0 top-0 h-1" style={{ background: p.color }} />
                <p className="rb-mono text-[0.62rem]" style={{ color: p.color }}>
                  {h} · {p.tagline}
                </p>
                {r ? (
                  <>
                    <p className="rb-disp rb-num mt-2 text-[2.8rem]">{fmt(Number(r.host_score))}</p>
                    {r.one_word && (
                      <p className="rb-mono mt-1 text-[0.62rem] text-[var(--rb-ink-2)]">“{r.one_word}”</p>
                    )}
                  </>
                ) : (
                  <p className="mt-3 text-sm text-[var(--rb-dim)]">Nog niet gespeeld</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
