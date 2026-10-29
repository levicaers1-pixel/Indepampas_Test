/**
 * Endless text band. Pure CSS (transform animation, no JS) and aria-hidden: it repeats
 * words that are already in the page, so it adds no content for screen readers or crawlers.
 */
const DEFAULT_ITEMS = ["Made on the back nine", "Elke dinsdag een nieuwe aflevering"];

export function Marquee({ items = DEFAULT_ITEMS }: { items?: string[] }) {
  const group = (key: string) => (
    <div key={key} className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <span key={t} className="flex items-center">
          <span
            className={`rb-disp whitespace-nowrap px-5 sm:px-7 text-[clamp(1.6rem,4.4vw,4rem)] ${
              i % 2 === 1 ? "rb-outline !text-[clamp(1.6rem,4.4vw,4rem)]" : ""
            }`}
            style={i % 2 === 1 ? { WebkitTextStroke: "1.5px var(--rb-ink)" } : undefined}
          >
            {t}
          </span>
          <span className="rb-disp text-[var(--rb-lime)] text-[clamp(1.4rem,3.6vw,3.2rem)]">◆</span>
        </span>
      ))}
    </div>
  );
  return (
    <div
      aria-hidden="true"
      className="relative z-[4] overflow-hidden border-y border-[var(--rb-rule)] bg-[var(--rb-ground)] py-4 sm:py-5"
    >
      <div className="rb-ticker flex w-max">
        {group("a")}
        {group("b")}
        {group("c")}
        {group("d")}
      </div>
    </div>
  );
}
