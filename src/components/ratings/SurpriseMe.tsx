import { useMemo, useState } from "react";
import type { CourseWithRatings } from "@/data/courses-db";
import { CourseCard } from "./CourseCard";

type Budget = "" | "€" | "€€" | "€€€" | "€€€€";
type Vibe = "" | "score" | "fun" | "uitdaging" | "rustig";

export function SurpriseMe({ courses }: { courses: CourseWithRatings[] }) {
  const countries = useMemo(
    () => Array.from(new Set(courses.map((c) => c.country).filter(Boolean))) as string[],
    [courses],
  );
  const types = useMemo(
    () => Array.from(new Set(courses.map((c) => c.type).filter(Boolean))) as string[],
    [courses],
  );

  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState<Budget>("");
  const [vibe, setVibe] = useState<Vibe>("");
  const [submitted, setSubmitted] = useState(false);

  const regions = useMemo(() => {
    const src = country ? courses.filter((c) => c.country === country) : courses;
    return Array.from(new Set(src.map((c) => c.region).filter(Boolean))) as string[];
  }, [courses, country]);

  const feeRank: Record<string, number> = { "€": 1, "€€": 2, "€€€": 3, "€€€€": 4 };

  const top3 = useMemo(() => {
    if (!submitted) return [];
    const scored = courses
      .map((c) => {
        let score = 0;
        let matches = 0;

        if (country) {
          if (c.country !== country) return null;
          matches++;
        }
        if (region) {
          if (c.region !== region) return null;
          matches++;
        }
        if (type) {
          if (c.type === type) { score += 15; matches++; }
          else score -= 5;
        }
        if (budget) {
          const want = feeRank[budget] ?? 0;
          const have = feeRank[c.fee_category ?? ""] ?? 0;
          if (have && have <= want) score += 10;
          else if (have && have === want + 1) score += 2;
          else if (have && have > want) score -= (have - want) * 6;
        }

        // Vibe weighting based on rating dimensions
        const avg = (key: keyof CourseWithRatings["ratings"][number]) => {
          const vals = c.ratings.map((r) => Number(r[key] ?? 0)).filter((n) => n > 0);
          if (!vals.length) return 0;
          return vals.reduce((a, b) => a + b, 0) / vals.length;
        };

        const pampas = c.pampasScore ?? avg("host_score");
        score += pampas * 1.5;

        if (vibe === "fun") score += (avg("score_value") + avg("score_design")) * 1.5;
        else if (vibe === "uitdaging") score += avg("score_challenge") * 3;
        else if (vibe === "rustig") score += (avg("score_scenery") + avg("score_hospitality")) * 1.5;
        else if (vibe === "score") score += pampas * 2;

        // Prefer courses with actual ratings
        score += Math.min(c.ratings.length, 3) * 2;

        return { course: c, score, matches };
      })
      .filter((x): x is { course: CourseWithRatings; score: number; matches: number } => x !== null);

    return scored.sort((a, b) => b.score - a.score).slice(0, 3);
  }, [submitted, courses, country, region, type, budget, vibe]);

  const reset = () => {
    setCountry(""); setRegion(""); setType(""); setBudget(""); setVibe(""); setSubmitted(false);
  };

  return (
    <div className="px-6 lg:px-14 py-10">
      <div className="max-w-3xl">
        <p className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#635C4B] mb-3">
          Verras mij
        </p>
        <h2 className="font-rb-serif font-light text-[2rem] text-[#1C3D2A] leading-tight mb-3">
          Beantwoord een paar vragen, wij kiezen <em className="italic">drie banen</em> voor jou.
        </h2>
        <p className="font-rb-sans text-[0.9rem] text-[#635C4B] leading-[1.7] mb-8">
          Laat een veld leeg als je geen voorkeur hebt. We wegen je antwoorden tegen de scores en reviews van Lars, Levi &amp; Niels.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          <Field label="Land">
            <select value={country} onChange={(e) => { setCountry(e.target.value); setRegion(""); }} className="quiz-select">
              <option value="">Geen voorkeur</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="Regio">
            <select value={region} onChange={(e) => setRegion(e.target.value)} className="quiz-select" disabled={!regions.length}>
              <option value="">Geen voorkeur</option>
              {regions.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>

          <Field label="Type baan">
            <select value={type} onChange={(e) => setType(e.target.value)} className="quiz-select">
              <option value="">Geen voorkeur</option>
              {types.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>

          <Field label="Budget (greenfee)">
            <select value={budget} onChange={(e) => setBudget(e.target.value as Budget)} className="quiz-select">
              <option value="">Geen voorkeur</option>
              <option value="€">€ — betaalbaar</option>
              <option value="€€">€€ — gemiddeld</option>
              <option value="€€€">€€€ — premium</option>
              <option value="€€€€">€€€€ — top-tier</option>
            </select>
          </Field>

          <Field label="Wat zoek je vooral?">
            <select value={vibe} onChange={(e) => setVibe(e.target.value as Vibe)} className="quiz-select">
              <option value="">Geen voorkeur</option>
              <option value="score">Algemeen de beste score</option>
              <option value="fun">Plezier &amp; speelbaarheid</option>
              <option value="uitdaging">Uitdaging &amp; pittig parcours</option>
              <option value="rustig">Sfeer &amp; rust</option>
            </select>
          </Field>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setSubmitted(true)}
            className="font-rb-mono text-[0.65rem] tracking-[0.18em] uppercase px-5 py-3 bg-[#1C3D2A] text-[#F4EFE5] hover:bg-[#2a5640] transition"
          >
            Verras mij →
          </button>
          {submitted && (
            <button
              onClick={reset}
              className="font-rb-mono text-[0.65rem] tracking-[0.18em] uppercase px-5 py-3 border border-[rgba(28,61,42,0.3)] text-[#1C3D2A] hover:bg-[rgba(28,61,42,0.05)] transition"
            >
              Opnieuw
            </button>
          )}
        </div>
      </div>

      {submitted && (
        <div className="mt-12">
          <p className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#635C4B] mb-5">
            {top3.length ? `Top ${top3.length} voor jou` : "Geen match"}
          </p>
          {top3.length === 0 ? (
            <div className="font-rb-sans text-[#635C4B] py-8">
              Geen passende banen gevonden met deze filters. Probeer minder strikt te zijn.
            </div>
          ) : (
            <div className="space-y-4">
              {top3.map((t, i) => (
                <div key={t.course.id} className="relative">
                  <div className="absolute -left-2 -top-2 z-10 w-9 h-9 rounded-full bg-[#1C3D2A] text-[#F4EFE5] font-rb-serif text-[1.1rem] flex items-center justify-center shadow">
                    {i + 1}
                  </div>
                  <CourseCard course={t.course} activePersona={null} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        .quiz-select {
          background: #ffffff;
          border: 1px solid rgba(28,61,42,0.25);
          color: #1C3D2A;
          font-family: inherit;
          font-size: 0.88rem;
          padding: 0.7rem 0.85rem;
          width: 100%;
        }
        .quiz-select:focus { outline: none; border-color: #1C3D2A; }
        .quiz-select:disabled { opacity: 0.5; }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-rb-mono text-[0.58rem] tracking-[0.18em] uppercase text-[#635C4B] mb-1.5 block">
        {label}
      </span>
      {children}
    </label>
  );
}
