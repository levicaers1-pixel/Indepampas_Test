import { useEffect, useState } from "react";
import type { CourseWithRatings } from "@/data/courses-db";
import {
  castVote,
  fetchCourseVotes,
  getVoterId,
  weightedCommunityScore,
} from "@/lib/communityVotes";

export function CommunityVote({ course }: { course: CourseWithRatings }) {
  const [voterId, setVoterId] = useState<string | null>(null);
  const [votes, setVotes] = useState<number[]>([]);
  const [myVote, setMyVote] = useState<number | null>(null);
  const [value, setValue] = useState(75);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = getVoterId();
    setVoterId(id);
    let active = true;
    fetchCourseVotes(course.id)
      .then((rows) => {
        if (!active) return;
        setVotes(rows.map((r) => r.score));
        const mine = rows.find((r) => r.voter_id === id);
        if (mine) {
          setMyVote(mine.score);
          setValue(mine.score);
        }
      })
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [course.id]);

  const hostScores = course.ratings.map((r) => Number(r.host_score));
  const communityScore = weightedCommunityScore(hostScores, votes);

  async function submit() {
    if (!voterId) return;
    setSaving(true);
    setError(null);
    try {
      const clean = await castVote(course.id, voterId, value);
      setVotes((prev) => {
        const next = prev.slice();
        if (myVote != null) {
          const i = next.indexOf(myVote);
          if (i >= 0) next.splice(i, 1);
        }
        next.push(clean);
        return next;
      });
      setMyVote(clean);
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Stemmen mislukt");
    } finally {
      setSaving(false);
    }
  }

  const showForm = myVote == null || editing;

  return (
    <section className="mt-10 border border-[rgba(28,61,42,0.15)] bg-[#FBF8F1] p-6 md:p-8">
      <h2 className="font-rb-mono text-[0.6rem] tracking-[0.22em] uppercase text-[#635C4B]">
        Scores
      </h2>

      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="font-rb-mono text-[0.6rem] tracking-[0.18em] uppercase text-[#635C4B]">
            Pampas-score
          </p>
          <p className="font-rb-serif text-4xl text-[#1C3D2A] leading-none mt-1">
            {course.pampasScore != null ? course.pampasScore.toFixed(0) : "—"}
            <span className="text-base text-[#635C4B]">/100</span>
          </p>
          <p className="font-rb-sans text-[0.75rem] text-[#635C4B] mt-1">
            {course.ratings.length} host-rating{course.ratings.length === 1 ? "" : "s"}
          </p>
        </div>
        <div>
          <p className="font-rb-mono text-[0.6rem] tracking-[0.18em] uppercase text-[#635C4B]">
            Community-score
          </p>
          <p className="font-rb-serif text-4xl text-[#3D7A52] leading-none mt-1">
            {communityScore != null ? communityScore.toFixed(1) : "—"}
            <span className="text-base text-[#635C4B]">/100</span>
          </p>
          <p className="font-rb-sans text-[0.75rem] text-[#635C4B] mt-1">
            {votes.length} stem{votes.length === 1 ? "" : "men"} · hosts wegen 10×
          </p>
        </div>
      </div>

      <div className="mt-6 border-t border-[rgba(28,61,42,0.12)] pt-5">
        {loading ? (
          <p className="font-rb-sans text-sm text-[#635C4B]">Stemmen laden…</p>
        ) : showForm ? (
          <div>
            <label
              htmlFor="community-vote"
              className="font-rb-sans text-sm text-[#2E2B25] block"
            >
              Geef {course.name} een score van 0 tot 100
            </label>
            <div className="mt-3 flex items-center gap-4">
              <input
                id="community-vote"
                type="range"
                min={0}
                max={100}
                step={1}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="flex-1 accent-[#3D7A52]"
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
                className="w-20 border border-[rgba(28,61,42,0.25)] bg-white px-2 py-1 font-rb-mono text-sm text-[#1C3D2A]"
              />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={submit}
                disabled={saving}
                className="font-rb-mono text-[0.65rem] tracking-[0.18em] uppercase bg-[#1C3D2A] text-[#F4EFE5] px-5 py-2.5 disabled:opacity-60"
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
                  className="font-rb-mono text-[0.65rem] tracking-[0.18em] uppercase text-[#635C4B] hover:text-[#1C3D2A]"
                >
                  Annuleer
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-4">
            <p className="font-rb-sans text-sm text-[#2E2B25]">
              Jouw stem:{" "}
              <span className="font-rb-serif text-2xl text-[#1C3D2A] align-middle">{myVote}</span>
              <span className="text-[#635C4B]">/100</span>
            </p>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="font-rb-mono text-[0.65rem] tracking-[0.18em] uppercase text-[#3D7A52] hover:text-[#1C3D2A] underline"
            >
              Wijzig stem
            </button>
          </div>
        )}
        {error && <p className="font-rb-sans text-sm text-[#A32D2D] mt-3">{error}</p>}
      </div>
    </section>
  );
}
