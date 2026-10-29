import { scoreColor } from "@/lib/personalScore";

/** Pampas Score as a glowing scoreboard number (0–100), coloured by tier. */
export function PampasScoreBadge({
  score,
  small,
}: {
  score: number | null;
  small?: boolean;
}) {
  const { hex, label } = scoreColor(score);
  const text =
    score == null ? "—" : Number.isInteger(score) ? score.toFixed(0) : score.toFixed(1);
  return (
    <div
      className="flex flex-col items-end gap-1"
      aria-label={score == null ? "Nog geen score" : `Pampas Score ${text} op 100`}
    >
      <span
        className="rb-disp rb-num leading-none"
        style={{
          color: hex,
          fontSize: small ? 30 : 56,
          textShadow: `0 0 26px ${hex}88`,
        }}
      >
        {text}
      </span>
      {!small && (
        <span className="rb-mono" style={{ color: hex, fontSize: "0.62rem" }}>
          {label}
        </span>
      )}
    </div>
  );
}
