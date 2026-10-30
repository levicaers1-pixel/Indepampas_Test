import { useState } from "react";
import { Link } from "@tanstack/react-router";
import type { CourseWithRatings } from "@/data/courses-db";
import {
  DOG_ANSWER_LABEL,
  DOG_MIN_VOTES,
  DOG_STATUS_LABEL,
  useDogInfo,
  type DogAnswer,
} from "@/lib/dogVotes";
import { PawIcon } from "./DogPaw";

const ANSWERS: DogAnswer[] = ["course", "clubhouse", "no"];

export function DogVote({ course }: { course: CourseWithRatings }) {
  const { loading, info, myAnswer, vote } = useDogInfo(course.id);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState<DogAnswer | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(answer: DogAnswer) {
    setSaving(answer);
    setError(null);
    try {
      await vote(answer);
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Stemmen mislukt");
    } finally {
      setSaving(null);
    }
  }

  const settled = info.status !== "unknown";
  const showButtons = myAnswer == null || editing;

  let statusLine: string;
  if (settled && info.hostConfirmed) {
    statusLine = `${DOG_STATUS_LABEL[info.status as DogAnswer]}. Bevestigd door PAMPAS.`;
  } else if (settled) {
    const agree =
      info.status === "course" ? info.votesCourse : info.status === "clubhouse" ? info.votesClubhouse : info.votesNo;
    statusLine = `${DOG_STATUS_LABEL[info.status as DogAnswer]}, volgens ${agree} van ${info.votesTotal} bezoekers.`;
  } else if (info.votesTotal === 0) {
    statusLine = "Nog niemand heeft dit doorgegeven. Weet jij het?";
  } else if (info.votesTotal < DOG_MIN_VOTES) {
    statusLine = `Nog niet bevestigd: ${info.votesTotal} van de ${DOG_MIN_VOTES} bezoekers die nodig zijn.`;
  } else {
    statusLine = `Nog niet bevestigd: de ${info.votesTotal} bezoekers die al stemden zijn het er nog niet genoeg over eens.`;
  }

  return (
    <section className="border border-[rgba(242,239,230,0.15)] bg-[var(--rb-surface)] p-5 md:p-6">
      <h2 className="flex items-center gap-2 font-rb-mono text-[0.7rem] uppercase tracking-[0.22em] text-[var(--rb-muted)]">
        <PawIcon size={14} className={info.status === "course" ? "text-[var(--rb-lime)]" : ""} />
        Mag je hond mee?
      </h2>

      <p className="mt-3 font-rb-sans text-sm text-[var(--rb-ink-2)]">{statusLine}</p>

      <div className="mt-5 border-t border-[rgba(242,239,230,0.12)] pt-5">
        {loading ? (
          <p className="font-rb-sans text-sm text-[var(--rb-muted)]">Laden…</p>
        ) : showButtons ? (
          <div>
            <p className="font-rb-sans text-sm text-[var(--rb-ink-2)]">
              Was je hond welkom op {course.name}, of heb je het gecontroleerd bij de club?
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {ANSWERS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => submit(a)}
                  disabled={saving != null}
                  aria-pressed={myAnswer === a}
                  className={`border px-4 py-2.5 font-rb-mono text-[0.7rem] uppercase tracking-[0.14em] transition disabled:opacity-60 ${
                    myAnswer === a
                      ? "border-[var(--rb-lime)] bg-[rgba(182,240,74,0.12)] text-[var(--rb-lime)]"
                      : "border-[rgba(242,239,230,0.25)] text-[var(--rb-ink)] hover:border-[var(--rb-lime)]"
                  }`}
                >
                  {saving === a ? "Bezig…" : DOG_ANSWER_LABEL[a]}
                </button>
              ))}
              {myAnswer != null && (
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="font-rb-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--rb-muted)] hover:text-[var(--rb-ink)]"
                >
                  Annuleer
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-4">
            <p className="font-rb-sans text-sm text-[var(--rb-ink-2)]">
              Jouw antwoord: <span className="text-[var(--rb-ink)]">{DOG_ANSWER_LABEL[myAnswer]}</span>
            </p>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="font-rb-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--rb-lime)] underline hover:text-[var(--rb-ink)]"
            >
              Wijzig antwoord
            </button>
          </div>
        )}
        {error && <p className="mt-3 font-rb-sans text-sm text-[var(--rb-danger)]">{error}</p>}
      </div>

      <p className="mt-4 font-rb-sans text-[0.75rem] text-[var(--rb-muted)]">
        Het pootje komt er pas als minstens {DOG_MIN_VOTES} verschillende bezoekers het eens zijn. Reglementen
        veranderen: check altijd even bij de club
        {course.website && (
          <>
            {" "}
            (
            <a
              href={course.website}
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-[var(--rb-ink)]"
            >
              website
            </a>
            )
          </>
        )}
        . Zie ook de{" "}
        <Link to="/disclaimer" hash="hond" className="underline">disclaimer</Link>.
      </p>
    </section>
  );
}
