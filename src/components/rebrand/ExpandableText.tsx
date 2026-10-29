import { useState } from "react";

/**
 * Long text clamped to a few lines with a "Lees meer" toggle. Short text is
 * rendered as-is, without a toggle. `className` styles the paragraph.
 */
export function ExpandableText({
  text,
  className = "",
  threshold = 340,
}: {
  text: string;
  className?: string;
  threshold?: number;
}) {
  const [open, setOpen] = useState(false);
  const long = text.length > threshold;

  return (
    <div className="mb-6">
      <p className={`${className} ${long && !open ? "line-clamp-5" : ""}`}>{text}</p>
      {long && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mt-4 font-rb-mono text-[0.7rem] tracking-[0.14em] uppercase text-[var(--rb-ink)] border-b border-[var(--rb-lime)] pb-1 hover:text-[var(--rb-lime)]"
        >
          {open ? "Minder tonen ↑" : "Lees meer ↓"}
        </button>
      )}
    </div>
  );
}
