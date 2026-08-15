import { scoreColor } from "@/lib/personalScore";

export function PampasScoreBadge({
  score,
  small,
}: {
  score: number | null;
  small?: boolean;
}) {
  const { hex, label } = scoreColor(score);
  const size = small ? 56 : 88;
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at 30% 30%, ${hex}18, transparent 70%)`,
          border: `2px solid ${hex}`,
        }}
      >
        <span
          className="font-rb-serif leading-none"
          style={{ color: hex, fontSize: small ? 20 : 30 }}
        >
          {score != null ? score.toFixed(0) : "—"}
        </span>
      </div>
      {!small && (
        <span
          className="font-rb-mono uppercase tracking-[0.15em]"
          style={{ fontSize: 9, color: hex }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
