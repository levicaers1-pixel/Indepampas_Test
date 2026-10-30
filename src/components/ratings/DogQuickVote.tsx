import { useEffect, useState } from "react";
import type { CourseWithRatings } from "@/data/courses-db";
import {
  DOG_ANSWER_LABEL,
  DOG_ANSWER_SHORT,
  DOG_MIN_VOTES,
  useDogInfo,
  type DogAnswer,
} from "@/lib/dogVotes";
import { DogBadge, PawIcon } from "./DogPaw";

const ANSWERS: DogAnswer[] = ["course", "clubhouse", "no"];

/**
 * Pawprint on the collapsed course card: the certified badge when dogs are welcome on the
 * course, otherwise a small chip that opens the quick vote. It sits inside the card's header
 * button, hence the span with role="button" and the stopped events (like the "Stem nu" chip).
 */
export function DogChip({ courseId, onOpen }: { courseId: string; onOpen: () => void }) {
  const { loading, info, myAnswer } = useDogInfo(courseId);
  if (loading) return null;
  if (info.status === "course") return <DogBadge courseId={courseId} />;

  let label = "Hond mee?";
  if (info.status === "clubhouse") label = "Honden: alleen terras";
  else if (info.status === "no") label = "Honden: niet toegelaten";
  else if (myAnswer) label = `Hond: jouw antwoord ${DOG_ANSWER_SHORT[myAnswer]}`;

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onOpen();
        }
      }}
      className="inline-flex cursor-pointer items-center gap-1.5 border border-[rgba(242,239,230,0.25)] px-2 py-1 font-rb-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--rb-ink-2)] transition hover:border-[var(--rb-lime)] hover:text-[var(--rb-lime)]"
    >
      <PawIcon size={12} />
      {label}
    </span>
  );
}

/** One-click dog vote: picking an answer saves it straight away. */
export function DogQuickModal({ course, onClose }: { course: CourseWithRatings; onClose: () => void }) {
  const { myAnswer, vote } = useDogInfo(course.id);
  const [saving, setSaving] = useState<DogAnswer | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function pick(answer: DogAnswer) {
    setSaving(answer);
    setError(null);
    try {
      await vote(answer);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Stemmen mislukt");
      setSaving(null);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md border border-[rgba(242,239,230,0.2)] bg-[var(--rb-surface)] p-6"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Mag je hond mee op ${course.name}?`}
      >
        <p className="flex items-center gap-2 font-rb-mono text-[0.7rem] uppercase tracking-[0.22em] text-[var(--rb-muted)]">
          <PawIcon size={13} /> Mag je hond mee?
        </p>
        <h3 className="mt-1 font-rb-serif text-2xl text-[var(--rb-ink)]">{course.name}</h3>
        <p className="mt-3 font-rb-sans text-sm text-[var(--rb-ink-2)]">
          Was je hond welkom, of heb je het gecontroleerd bij de club?
        </p>
        <div className="mt-4 flex flex-col gap-2">
          {ANSWERS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => pick(a)}
              disabled={saving != null}
              aria-pressed={myAnswer === a}
              className={`border px-4 py-3 text-left font-rb-mono text-[0.7rem] uppercase tracking-[0.14em] transition disabled:opacity-60 ${
                myAnswer === a
                  ? "border-[var(--rb-lime)] bg-[rgba(182,240,74,0.12)] text-[var(--rb-lime)]"
                  : "border-[rgba(242,239,230,0.25)] text-[var(--rb-ink)] hover:border-[var(--rb-lime)]"
              }`}
            >
              {saving === a ? "Bezig…" : DOG_ANSWER_LABEL[a]}
            </button>
          ))}
        </div>
        {error && <p className="mt-3 font-rb-sans text-sm text-[var(--rb-danger)]">{error}</p>}
        <p className="mt-4 font-rb-sans text-[0.75rem] text-[var(--rb-muted)]">
          Het pootje komt er pas als minstens {DOG_MIN_VOTES} verschillende bezoekers het eens zijn.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 font-rb-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--rb-muted)] hover:text-[var(--rb-ink)]"
        >
          Annuleer
        </button>
      </div>
    </div>
  );
}
