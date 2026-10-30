import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { LEGAL_UPDATED } from "@/lib/legal";

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

interface Props {
  kicker: string;
  title: ReactNode;
  intro: ReactNode;
  sections: LegalSection[];
  other: { to: "/privacy" | "/disclaimer"; label: string };
}

const proseClass =
  "font-rb-sans text-[0.95rem] text-[var(--rb-muted)] leading-[1.8] space-y-4 [&_strong]:text-[var(--rb-ink)] [&_a]:text-[var(--rb-lime)] [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_li]:pl-1";

export function LegalPage({ kicker, title, intro, sections, other }: Props) {
  return (
    <>
      <div className="px-6 lg:px-14 pt-16 pb-12 border-b border-[rgba(242,239,230,0.15)]">
        <p className="font-rb-mono text-[0.7rem] tracking-[0.2em] uppercase text-[var(--rb-muted)] mb-4">
          {kicker}
        </p>
        <h1 className="font-rb-serif font-light text-[clamp(2.8rem,5vw,4.5rem)] text-[var(--rb-ink)] leading-none">
          {title}
        </h1>
        <div className={`${proseClass} mt-5 max-w-2xl`}>{intro}</div>
        <p className="font-rb-mono text-[0.7rem] tracking-[0.14em] uppercase text-[var(--rb-dim)] mt-6">
          Laatst bijgewerkt: {LEGAL_UPDATED}
        </p>
      </div>

      <div className="px-6 lg:px-14 py-12 grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)] gap-10 lg:gap-16">
        <nav aria-label="Inhoud" className="lg:sticky lg:top-24 self-start">
          <div className="font-rb-mono text-[0.7rem] tracking-[0.2em] uppercase text-[var(--rb-lime)] mb-4">
            Inhoud
          </div>
          <ol className="space-y-2 font-rb-sans text-sm text-[var(--rb-muted)]">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="no-underline hover:text-[var(--rb-lime)] transition-colors">
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="max-w-3xl space-y-12">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="font-rb-serif font-semibold text-[1.6rem] text-[var(--rb-ink)] leading-tight mb-4">
                {i + 1}. {s.title}
              </h2>
              <div className={proseClass}>{s.body}</div>
            </section>
          ))}

          <p className="font-rb-sans text-sm text-[var(--rb-muted)] border-t border-[rgba(242,239,230,0.15)] pt-6">
            Lees ook onze{" "}
            <Link to={other.to} className="text-[var(--rb-lime)] underline">
              {other.label}
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
