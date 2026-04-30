import { hosts } from "@/data/hosts";

export function NewHosts() {
  return (
    <>
      <div className="px-6 lg:px-14 pt-16 pb-12 border-b border-[rgba(28,61,42,0.15)] flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <p className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#7A7260] mb-4">
            De drie stemmen
          </p>
          <h1 className="font-rb-serif font-light text-[clamp(2.8rem,5vw,4.5rem)] text-[#1C3D2A] leading-none">
            De <em className="italic">Hosts</em>.
          </h1>
          <p className="font-rb-sans text-[0.95rem] text-[#7A7260] mt-3 max-w-xl">
            Drie vrienden, met elk een uniek traject, geven hun verschillende kijk op de golfsport.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        {hosts.map((h, i) => (
          <article
            key={h.id}
            className={`p-10 lg:p-14 border-b border-[rgba(28,61,42,0.15)] ${
              i < 2 ? "lg:border-r border-[rgba(28,61,42,0.15)]" : ""
            }`}
          >
            <p className="font-rb-mono text-[0.6rem] tracking-[0.18em] uppercase text-[#7A7260] mb-5">
              0{i + 1} / Host
            </p>
            <div className="aspect-[3/4] mb-6 overflow-hidden bg-[#E2D9C8]">
              <img
                src={h.image}
                alt={`Portret van ${h.name}`}
                className="w-full h-full object-cover grayscale-[0.3]"
              />
            </div>
            <p className="font-rb-mono text-[0.58rem] tracking-[0.16em] uppercase text-[#8FBF4A] mb-1">
              {h.role}
            </p>
            <h2 className="font-rb-serif font-semibold text-[2rem] text-[#1C3D2A] leading-tight mb-2">
              {h.name}
            </h2>
            <span className="inline-block font-rb-mono text-[0.6rem] tracking-[0.1em] bg-[#1C3D2A] text-[#8FBF4A] px-3 py-1 mb-6">
              HCP {h.handicap}
            </span>
            <p className="font-rb-sans text-[0.88rem] text-[#7A7260] leading-[1.75] mb-6 whitespace-pre-line">
              {h.bio}
            </p>
            <dl className="border-t border-[rgba(28,61,42,0.15)]">
              <div className="flex justify-between py-2.5 border-b border-[rgba(28,61,42,0.15)]">
                <dt className="font-rb-mono text-[0.58rem] tracking-[0.1em] uppercase text-[#7A7260]">
                  Thuisbaan
                </dt>
                <dd className="font-rb-sans text-[0.82rem] text-[#1C3D2A]">{h.favoriteCourse}</dd>
              </div>
              <div className="flex justify-between py-2.5">
                <dt className="font-rb-mono text-[0.58rem] tracking-[0.1em] uppercase text-[#7A7260]">
                  Handicap
                </dt>
                <dd className="font-rb-sans text-[0.82rem] text-[#1C3D2A]">{h.handicap}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </>
  );
}
