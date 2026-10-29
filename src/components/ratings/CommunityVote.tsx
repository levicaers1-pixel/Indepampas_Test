import { useEffect, useState } from "react";
import type { CourseWithRatings } from "@/data/courses-db";
import { useCourseVotes } from "@/lib/useCourseVotes";

export function CommunityVote({ course }: { course: CourseWithRatings }) {
  const { loading, error: loadError, scores, myVote, vote } = useCourseVotes(course.id);
  const [value, setValue] = useState(75);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (myVote != null) setValue(myVote);
  }, [myVote]);

  const communityAvg =
    scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null;

  async function submit() {
    setSaving(true);
    setError(null);
    try {
      await vote(value);
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Stemmen mislukt");
    } finally {
      setSaving(false);
    }
  }

  const showForm = myVote == null || editing;

  return (
    <section className="border border-[rgba(242,239,230,0.15)] bg-[var(--rb-surface)] p-5 md:p-6">
      <h2 className="font-rb-mono text-[0.7rem] tracking-[0.22em] uppercase text-[var(--rb-muted)]">
        Scores
      </h2>

      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="font-rb-mono text-[0.7rem] tracking-[0.18em] uppercase text-[var(--rb-muted)]">
            Gemiddelde hosts
          </p>
          <p className="font-rb-serif text-4xl text-[var(--rb-ink)] leading-none mt-1">
            {course.pampasScore != null ? course.pampasScore.toFixed(1) : "—"}
            <span className="text-base text-[var(--rb-muted)]">/100</span>
          </p>
          <p className="font-rb-sans text-[0.75rem] text-[var(--rb-muted)] mt-1">
            {course.ratings.length} host-rating{course.ratings.length === 1 ? "" : "s"}
          </p>
        </div>
        <div>
          <p className="font-rb-mono text-[0.7rem] tracking-[0.18em] uppercase text-[var(--rb-muted)]">
            Gemiddelde community
          </p>
          <p className="font-rb-serif text-4xl text-[var(--rb-lime)] leading-none mt-1">
            {communityAvg != null ? communityAvg.toFixed(1) : "—"}
            <span className="text-base text-[var(--rb-muted)]">/100</span>
          </p>
          <p className="font-rb-sans text-[0.75rem] text-[var(--rb-muted)] mt-1">
            {scores.length} stem{scores.length === 1 ? "" : "men"} · hosts wegen 10× in de
            Pampas-score
          </p>
        </div>
      </div>

      <div className="mt-6 border-t border-[rgba(242,239,230,0.12)] pt-5">
        {loading ? (
          <p className="font-rb-sans text-sm text-[var(--rb-muted)]">Stemmen laden…</p>
        ) : showForm ? (
          <div>
            <label
              htmlFor={`community-vote-${course.id}`}
              className="font-rb-sans text-sm text-[var(--rb-ink-2)] block"
            >
              Geef {course.name} een score van 0 tot 100
            </label>
            <div className="mt-3 flex items-center gap-4">
              <input
                id={`community-vote-${course.id}`}
                type="range"
                min={0}
                max={100}
                step={1}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="flex-1 accent-[var(--rb-lime)]"
              />
              <input
                type="number"
                min={0}
                max={100}
                step={1}
                value={value}
                aria-label="Score (0-100)"
                onChange={(e) =>
                  setValue(Math.max(0, Math.min(100, Math.round(Number(e.target.value) || 0))))
                }
                className="w-20 border border-[rgba(242,239,230,0.25)] bg-[var(--rb-surface)] px-2 py-1 font-rb-mono text-sm text-[var(--rb-ink)]"
              />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={submit}
                disabled={saving}
                className="font-rb-mono text-[0.7rem] tracking-[0.18em] uppercase bg-[var(--rb-lime)] text-[var(--rb-ground)] px-5 py-2.5 disabled:opacity-60"
              >
                {saving ? "Bezig…" : myVote == null ? "Stem" : "Stem bijwerken"}
              </button>
              {myVote != null && (
                <button
                  type="button"
                  onClick={() => {
                    setValue(myVote);
                    setEditing(false);
                  }}
                  className="font-rb-mono text-[0.7rem] tracking-[0.18em] uppercase text-[var(--rb-muted)] hover:text-[var(--rb-ink)]"
                >
                  Annuleer
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-4">
            <p className="font-rb-sans text-sm text-[var(--rb-ink-2)]">
              Jouw stem:{" "}
              <span className="font-rb-serif text-2xl text-[var(--rb-ink)] align-middle">{myVote}</span>
              <span className="text-[var(--rb-muted)]">/100</span>
            </p>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="font-rb-mono text-[0.7rem] tracking-[0.18em] uppercase text-[var(--rb-lime)] hover:text-[var(--rb-ink)] underline"
            >
              Wijzig stem
            </button>
          </div>
        )}
        {(error || loadError) && (
          <p className="font-rb-sans text-sm text-[var(--rb-danger)] mt-3">{error ?? loadError}</p>
        )}
      </div>
    </section>
  );
}
