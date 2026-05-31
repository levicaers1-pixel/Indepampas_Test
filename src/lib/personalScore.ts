import { CRITERIA, type CriterionKey, type Persona } from "@/data/personas";

export type RatingScores = Record<CriterionKey, number>;

export function personalScore(
  ratings: RatingScores[],
  affinities: Persona["affinities"],
): number | null {
  if (!ratings.length) return null;
  const avg: Partial<Record<CriterionKey, number>> = {};
  for (const { key } of CRITERIA) {
    const vals = ratings.map((r) => r[key]).filter((v) => v != null) as number[];
    avg[key] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : undefined;
  }
  const totalAff = CRITERIA.reduce((s, { key, weight }) => s + weight * (affinities[key] ?? 1), 0);
  const sum = CRITERIA.reduce((s, { key, weight }) => {
    const v = avg[key];
    if (v == null) return s;
    return s + v * weight * (affinities[key] ?? 1);
  }, 0);
  return Math.round((sum / totalAff) * 10);
}

export function scoreColor(score: number | null) {
  if (score == null) return { hex: "#5C5C58", label: "—" };
  if (score >= 80) return { hex: "#1D9E75", label: "Topklasse" };
  if (score >= 70) return { hex: "#378ADD", label: "Sterk" };
  if (score >= 55) return { hex: "#BA7517", label: "Degelijk" };
  return { hex: "#A32D2D", label: "Matig" };
}
