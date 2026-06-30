// Generates a uniform 1080x1080 Instagram-ready PNG for a course rating.
// Matches the editorial cream design of the ratings page.

import type { Tables } from "@/integrations/supabase/types";
import { CRITERIA, HOSTS, HOST_PERSONAS, type HostName } from "@/data/personas";

type Course = Tables<"courses">;
type Rating = Tables<"ratings">;

const W = 1080;
const H = 1080;

const COLORS = {
  bg: "#F4EFE5",
  ink: "#1C3D2A",
  ink2: "#2E2B25",
  muted: "#635C4B",
  pill: "#EDE6D9",
  border: "rgba(28,61,42,0.18)",
  accent: "#BA7517",
  barTrack: "#E3DCCC",
  good: "#3D7A52",
  great: "#1D9E75",
  okBlue: "#378ADD",
  warn: "#BA7517",
  bad: "#A32D2D",
};

const SERIF = `"Cormorant Garamond", "EB Garamond", Georgia, "Times New Roman", serif`;
const SANS = `"Helvetica Neue", Arial, sans-serif`;
const MONO = `"SF Mono", "Roboto Mono", "Courier New", monospace`;

function scoreColor(score: number): { hex: string; label: string } {
  if (score >= 80) return { hex: COLORS.great, label: "Topklasse" };
  if (score >= 70) return { hex: COLORS.okBlue, label: "Sterk" };
  if (score >= 55) return { hex: COLORS.warn, label: "Degelijk" };
  return { hex: COLORS.bad, label: "Matig" };
}

function barColor(v: number) {
  if (v >= 8) return COLORS.good;
  if (v >= 7) return "#8FBF4A";
  if (v >= 5.5) return COLORS.warn;
  return COLORS.bad;
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawPill(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  opts: { bg?: string; fg?: string; padX?: number; padY?: number; font?: string; border?: string },
): number {
  const padX = opts.padX ?? 16;
  const padY = opts.padY ?? 8;
  ctx.font = opts.font ?? `600 16px ${MONO}`;
  const w = ctx.measureText(text).width + padX * 2;
  const h = 28 + padY * 0;
  if (opts.bg) {
    ctx.fillStyle = opts.bg;
    roundedRect(ctx, x, y, w, h, 4);
    ctx.fill();
  }
  if (opts.border) {
    ctx.strokeStyle = opts.border;
    ctx.lineWidth = 1.5;
    roundedRect(ctx, x, y, w, h, 4);
    ctx.stroke();
  }
  ctx.fillStyle = opts.fg ?? COLORS.muted;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText(text, x + padX, y + h / 2 + 1);
  return w;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function generateInstagramFrontpage(
  course: Course,
  rating: Rating,
  ratedHosts: HostName[],
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Background
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, W, H);

  const PAD = 72;
  let cursorY = PAD;

  // ===== TOP CHIPS ROW =====
  ctx.textBaseline = "middle";
  const chipsY = cursorY;
  let chipX = PAD;

  // Region · Country
  const regionText = `${(course.region ?? "").toUpperCase()}${course.country ? ` · ${course.country.toUpperCase()}` : ""}`;
  ctx.font = `600 18px ${MONO}`;
  ctx.fillStyle = COLORS.muted;
  ctx.textAlign = "left";
  ctx.fillText(regionText, chipX, chipsY + 14);
  chipX += ctx.measureText(regionText).width + 24;

  // Type pill
  if (course.type) {
    const w = drawPill(ctx, course.type.toUpperCase(), chipX, chipsY, {
      bg: COLORS.pill,
      fg: COLORS.ink,
      font: `600 14px ${MONO}`,
    });
    chipX += w + 10;
  }
  // Fee pill
  if (course.fee_category) {
    const w = drawPill(ctx, course.fee_category, chipX, chipsY, {
      bg: COLORS.pill,
      fg: COLORS.muted,
      font: `600 14px ${MONO}`,
    });
    chipX += w + 10;
  }
  // Single-host chip if only one host has rated
  if (ratedHosts.length === 1) {
    drawPill(ctx, `ENKEL DOOR ${ratedHosts[0].toUpperCase()}`, chipX, chipsY, {
      bg: "#DCE6F2",
      fg: COLORS.okBlue,
      font: `600 14px ${MONO}`,
    });
  }

  cursorY += 70;

  // ===== TITLE =====
  ctx.fillStyle = COLORS.ink;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  const titleSize = course.name.length > 22 ? 78 : 96;
  ctx.font = `400 ${titleSize}px ${SERIF}`;
  const titleMaxW = W - PAD * 2 - 200; // leave room for badge
  const titleLines = wrapText(ctx, course.name, titleMaxW);
  const lineHeight = titleSize * 1.02;
  for (let i = 0; i < titleLines.length; i++) {
    ctx.fillText(titleLines[i], PAD, cursorY + i * lineHeight);
  }
  const titleEndY = cursorY + titleLines.length * lineHeight;

  // ===== SCORE BADGE (top right) =====
  const score = Number(rating.host_score);
  const sc = scoreColor(score);
  const badgeR = 78;
  const badgeCX = W - PAD - badgeR;
  const badgeCY = cursorY + badgeR + 6;
  ctx.beginPath();
  ctx.arc(badgeCX, badgeCY, badgeR, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.bg;
  ctx.fill();
  ctx.strokeStyle = sc.hex;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = sc.hex;
  ctx.font = `400 56px ${SERIF}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(Math.round(score)), badgeCX, badgeCY - 8);
  ctx.font = `700 13px ${MONO}`;
  ctx.fillText(sc.label.toUpperCase(), badgeCX, badgeCY + 30);

  cursorY = titleEndY + 32;

  // ===== HOST PILLS =====
  let hpX = PAD;
  const activeHost = rating.host as HostName;
  for (const h of HOSTS) {
    const isActive = h === activeHost;
    const isRated = ratedHosts.includes(h);
    const persona = HOST_PERSONAS[h];
    const padX = 22;
    const padY = 12;
    ctx.font = `600 18px ${SANS}`;
    const w = ctx.measureText(h).width + padX * 2;
    const hH = 38;
    roundedRect(ctx, hpX, cursorY, w, hH, hH / 2);
    if (isActive) {
      ctx.fillStyle = persona.color;
      ctx.fill();
      ctx.fillStyle = "#FFFFFF";
    } else {
      ctx.strokeStyle = isRated ? `${persona.color}66` : "rgba(28,61,42,0.25)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = isRated ? COLORS.ink : COLORS.muted;
    }
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(h, hpX + w / 2, cursorY + hH / 2 + 1);
    hpX += w + 12;
    void padY;
  }
  cursorY += 38 + 28;

  // ===== QUOTE =====
  if (rating.review) {
    const quoteX = PAD;
    const quoteMaxW = W - PAD * 2;
    ctx.font = `italic 22px ${SERIF}`;
    ctx.fillStyle = COLORS.muted;
    const lines = wrapText(ctx, `"${rating.review.trim()}"`, quoteMaxW - 24);
    const maxLines = 3;
    const shown = lines.slice(0, maxLines);
    if (lines.length > maxLines) {
      shown[shown.length - 1] = shown[shown.length - 1].replace(/[\s.,;:!?-]+$/, "") + "…";
    }
    // left bar
    const blockH = shown.length * 30;
    ctx.fillStyle = HOST_PERSONAS[activeHost].color;
    ctx.fillRect(quoteX, cursorY + 4, 3, blockH);
    ctx.fillStyle = COLORS.muted;
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    for (let i = 0; i < shown.length; i++) {
      ctx.fillText(shown[i], quoteX + 18, cursorY + i * 30);
    }
    cursorY += blockH + 28;
  }

  // ===== THREE DETAIL COLUMNS =====
  const details: { label: string; value: string }[] = [];
  if (rating.one_word) details.push({ label: "IN ÉÉN WOORD", value: rating.one_word });
  if (rating.hole_of_day) details.push({ label: "HOLE VAN DE DAG", value: rating.hole_of_day });
  if (rating.would_return) details.push({ label: "TERUGKOMEN?", value: rating.would_return });

  if (details.length > 0) {
    const colW = (W - PAD * 2) / 3;
    for (let i = 0; i < details.length; i++) {
      const d = details[i];
      const cx = PAD + i * colW;
      ctx.font = `700 13px ${MONO}`;
      ctx.fillStyle = COLORS.muted;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(d.label, cx, cursorY);
      ctx.font = `500 22px ${SANS}`;
      ctx.fillStyle = COLORS.ink2;
      const valLines = wrapText(ctx, d.value, colW - 16);
      ctx.fillText(valLines[0] ?? "", cx, cursorY + 26);
    }
    cursorY += 76;
  }

  // separator
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD, cursorY);
  ctx.lineTo(W - PAD, cursorY);
  ctx.stroke();
  cursorY += 24;

  // ===== SCORE PER CRITERIUM =====
  ctx.font = `700 14px ${MONO}`;
  ctx.fillStyle = COLORS.muted;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("SCORE PER CRITERIUM", PAD, cursorY);
  cursorY += 28;

  const labelW = 200;
  const valueW = 90;
  const barX = PAD + labelW;
  const barW = W - PAD * 2 - labelW - valueW;
  const rowH = 30;

  for (const c of CRITERIA) {
    const v = Number((rating as any)[c.key]) || 0;
    const pct = Math.min(v / 10, 1);

    ctx.font = `500 16px ${SANS}`;
    ctx.fillStyle = COLORS.ink2;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillText(c.label, PAD, cursorY + rowH / 2);

    // bar track
    const trackY = cursorY + rowH / 2 - 4;
    roundedRect(ctx, barX, trackY, barW, 8, 4);
    ctx.fillStyle = COLORS.barTrack;
    ctx.fill();
    // bar fill
    roundedRect(ctx, barX, trackY, Math.max(8, barW * pct), 8, 4);
    ctx.fillStyle = barColor(v);
    ctx.fill();

    // value
    ctx.font = `600 14px ${MONO}`;
    ctx.fillStyle = COLORS.muted;
    ctx.textAlign = "right";
    ctx.fillText(
      `${v.toFixed(1)} · ${Math.round(c.weight * 100)}%`,
      W - PAD,
      cursorY + rowH / 2,
    );

    cursorY += rowH + 4;
  }

  // ===== FOOTER =====
  cursorY = H - PAD - 4;
  ctx.font = `700 14px ${MONO}`;
  ctx.fillStyle = COLORS.muted;
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillText("INDEPAMPAS.BE", PAD, cursorY);
  ctx.textAlign = "right";
  ctx.fillStyle = COLORS.accent;
  ctx.fillText("PAMPAS · PARCOURS RATINGS", W - PAD, cursorY);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Canvas export failed"))), "image/png", 0.95);
  });
}

export async function downloadInstagramFrontpage(
  course: Course,
  rating: Rating,
  ratedHosts: HostName[],
) {
  const blob = await generateInstagramFrontpage(course, rating, ratedHosts);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const slug = course.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  a.href = url;
  a.download = `pampas-ig-${slug}-${rating.host.toLowerCase()}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
