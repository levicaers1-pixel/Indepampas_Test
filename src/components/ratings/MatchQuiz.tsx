import { useState } from "react";
import { HOST_PERSONAS, type HostName } from "@/data/personas";

type QuizAnswer = "challenge" | "experience" | "value";

const QUESTIONS: {
  q: string;
  options: { label: string; icon: string; map: QuizAnswer }[];
}[] = [
  {
    q: "Wat telt het meest voor jou op de golf?",
    options: [
      { label: "De uitdaging van de layout", icon: "🎯", map: "challenge" },
      { label: "De beleving en het kader", icon: "🌄", map: "experience" },
      { label: "Waar ik mijn geld voor krijg", icon: "💶", map: "value" },
    ],
  },
  {
    q: "Welk type baan ga jij voor?",
    options: [
      { label: "Heide of links — rauw en eerlijk", icon: "🌾", map: "challenge" },
      { label: "Parkland — elegant en groen", icon: "🌳", map: "experience" },
      { label: "Maakt niet uit, als de kwaliteit klopt", icon: "⚖️", map: "value" },
    ],
  },
  {
    q: "Na de ronde, wat is je eerste gedachte?",
    options: [
      { label: "Was elke hole interessant?", icon: "🧠", map: "challenge" },
      { label: "Zou ik hier vrienden meenemen?", icon: "🥂", map: "experience" },
      { label: "Was het de greenfee waard?", icon: "💸", map: "value" },
    ],
  },
];

const ANSWER_TO_HOST: Record<QuizAnswer, HostName> = {
  challenge: "Lars",
  experience: "Levi",
  value: "Niels",
};

export function MatchQuiz({ onMatch }: { onMatch: (host: HostName) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [result, setResult] = useState<HostName | null>(null);

  const handlePick = (a: QuizAnswer) => {
    const next = [...answers, a];
    setAnswers(next);
    if (step === QUESTIONS.length - 1) {
      // tally
      const counts: Record<QuizAnswer, number> = { challenge: 0, experience: 0, value: 0 };
      next.forEach((x) => counts[x]++);
      const winner = (Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]) as QuizAnswer;
      setResult(ANSWER_TO_HOST[winner]);
    } else {
      setStep(step + 1);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setResult(null);
  };

  if (result) {
    const p = HOST_PERSONAS[result];
    return (
      <div
        className="p-6 md:p-8 rounded-sm"
        style={{ background: p.bgLight, border: `1px solid ${p.color}55` }}
      >
        <div className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase mb-2" style={{ color: p.color }}>
          Jouw match
        </div>
        <h3 className="font-rb-serif text-[2rem] md:text-[2.4rem] leading-tight" style={{ color: p.color }}>
          {p.icon} {p.name} <span className="opacity-70">— {p.tagline}</span>
        </h3>
        <p className="font-rb-sans text-[0.92rem] text-[#F5F3EE] mt-3 max-w-2xl leading-[1.7]">
          {p.description}
        </p>
        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={() => onMatch(result)}
            className="font-rb-mono text-[0.7rem] tracking-[0.15em] uppercase px-4 py-2.5 rounded-sm transition"
            style={{ background: p.color, color: "#141412" }}
          >
            Toon parcours door {p.name}'s ogen →
          </button>
          <button
            onClick={reset}
            className="font-rb-mono text-[0.65rem] tracking-[0.15em] uppercase text-[#8C8A85] hover:text-[#F5F3EE]"
          >
            Opnieuw
          </button>
        </div>
      </div>
    );
  }

  const cur = QUESTIONS[step];
  return (
    <div className="p-6 md:p-8 bg-[#1E1E1C] border border-[#2E2E2B] rounded-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#8C8A85]">
          Vind je host · {step + 1}/{QUESTIONS.length}
        </div>
        <div className="flex gap-1">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className="h-[3px] w-8 rounded-full"
              style={{ background: i <= step ? "#F5F3EE" : "#2E2E2B" }}
            />
          ))}
        </div>
      </div>
      <h3 className="font-rb-serif text-[1.5rem] md:text-[1.85rem] text-[#F5F3EE] mb-5 leading-tight">
        {cur.q}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {cur.options.map((o) => (
          <button
            key={o.label}
            onClick={() => handlePick(o.map)}
            className="text-left p-4 bg-[#252523] hover:bg-[#2E2E2B] border border-[#2E2E2B] hover:border-[#4A4A45] transition rounded-sm"
          >
            <div className="text-2xl mb-2">{o.icon}</div>
            <div className="font-rb-sans text-[0.88rem] text-[#F5F3EE] leading-[1.4]">{o.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
