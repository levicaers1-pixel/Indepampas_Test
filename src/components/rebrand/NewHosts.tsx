import { hosts } from "@/data/hosts";

export function NewHosts() {
  return (
    <>
      <div className="px-6 lg:px-14 pt-16 pb-12 border-b border-[rgba(242,239,230,0.15)] flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <p className="font-rb-mono text-[0.7rem] tracking-[0.2em] uppercase text-[var(--rb-muted)] mb-4">
            De drie stemmen
          </p>
          <h1 className="font-rb-serif font-light text-[clamp(2.8rem,5vw,4.5rem)] text-[var(--rb-ink)] leading-none">
            De <em className="italic">Hosts</em>.
          </h1>
          <p className="font-rb-sans text-[0.95rem] text-[var(--rb-muted)] mt-3 max-w-xl">
            Drie vrienden, met elk een uniek traject, geven hun verschillende kijk op de golfsport.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        {hosts.map((h, i) => (
          <article
            key={h.id}
            className={`p-10 lg:p-14 border-b border-[rgba(242,239,230,0.15)] ${
              i < 2 ? "lg:border-r border-[rgba(242,239,230,0.15)]" : ""
            }`}
          >
            <p className="font-rb-mono text-[0.7rem] tracking-[0.18em] uppercase text-[var(--rb-muted)] mb-5">
              0{i + 1} / Host
            </p>
            <div className="aspect-[3/4] mb-6 overflow-hidden bg-[var(--rb-surface-2)]">
              <img
                src={h.image}
                alt={`Portret van ${h.name}`}
                className="w-full h-full object-cover grayscale-[0.3]"
              />
            </div>
            <p className="font-rb-mono text-[0.7rem] tracking-[0.16em] uppercase text-[var(--rb-lime)] mb-1">
              {h.role}
            </p>
            <h2 className="font-rb-serif font-semibold text-[2rem] text-[var(--rb-ink)] leading-tight mb-2">
              {h.name}
            </h2>
            <span className="inline-block font-rb-mono text-[0.7rem] tracking-[0.1em] bg-[var(--rb-surface)] text-[var(--rb-lime)] px-3 py-1 mb-6">
              HCP {h.handicap}
            </span>
            <p className="font-rb-sans text-[0.88rem] text-[var(--rb-muted)] leading-[1.75] mb-6 whitespace-pre-line">
              {h.bio}
            </p>
            <dl className="border-t border-[rgba(242,239,230,0.15)]">
              <div className="flex justify-between py-2.5 border-b border-[rgba(242,239,230,0.15)]">
                <dt className="font-rb-mono text-[0.7rem] tracking-[0.1em] uppercase text-[var(--rb-muted)]">
                  Thuisbaan
                </dt>
                <dd className="font-rb-sans text-[0.82rem] text-[var(--rb-ink)]">{h.favoriteCourse}</dd>
              </div>
              <div className="flex justify-between py-2.5">
                <dt className="font-rb-mono text-[0.7rem] tracking-[0.1em] uppercase text-[var(--rb-muted)]">
                  Handicap
                </dt>
                <dd className="font-rb-sans text-[0.82rem] text-[var(--rb-ink)]">{h.handicap}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </>
  );
}
