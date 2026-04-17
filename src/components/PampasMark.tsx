// Decorative pampas grass plume — pure SVG, themed via currentColor
type Props = { className?: string; sway?: boolean };

export function PampasMark({ className = "", sway = false }: Props) {
  return (
    <svg
      viewBox="0 0 60 200"
      className={`${className} ${sway ? "pampas-sway" : ""}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M30 200 L30 70" stroke="currentColor" strokeWidth="0.8" />
      {/* plume — a series of soft strokes */}
      {Array.from({ length: 28 }).map((_, i) => {
        const angle = -55 + (i % 14) * 8;
        const len = 24 + (i % 7) * 3;
        const y = 30 + i * 2;
        const x2 = 30 + Math.cos((angle * Math.PI) / 180) * len;
        const y2 = y + Math.sin((angle * Math.PI) / 180) * len;
        return (
          <line
            key={i}
            x1={30}
            y1={y}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="0.7"
            strokeLinecap="round"
            opacity={0.55 + (i % 5) * 0.08}
          />
        );
      })}
    </svg>
  );
}
