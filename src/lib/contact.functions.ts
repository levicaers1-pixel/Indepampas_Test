import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/brevo";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email().max(255),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(5000),
  reason: z.enum(["hello", "sponsor", "guest"]),
});

const REASON_LABEL: Record<string, string> = {
  hello: "Algemeen",
  sponsor: "Sponsoring",
  guest: "Gast",
};

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const lovableKey = process.env.LOVABLE_API_KEY;
    const brevoKey = process.env.BREVO_API_KEY;
    if (!lovableKey || !brevoKey) {
      throw new Error("Brevo connector not configured");
    }

    const reasonLabel = REASON_LABEL[data.reason] ?? data.reason;
    const subject = `[PAMPAS contact – ${reasonLabel}] ${data.subject}`;
    const messageHtml = escapeHtml(data.message).replace(/\n/g, "<br/>");

    const htmlContent = `
      <div style="font-family:Arial,sans-serif;font-size:14px;color:#18180F;line-height:1.6;">
        <p><strong>Nieuw bericht via PAMPAS contactformulier</strong></p>
        <p>
          <strong>Type:</strong> ${escapeHtml(reasonLabel)}<br/>
          <strong>Naam:</strong> ${escapeHtml(data.name)}<br/>
          <strong>E-mail:</strong> ${escapeHtml(data.email)}<br/>
          <strong>Onderwerp:</strong> ${escapeHtml(data.subject)}
        </p>
        <hr/>
        <p>${messageHtml}</p>
      </div>
    `.trim();

    const res = await fetch(`${GATEWAY_URL}/smtp/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": brevoKey,
      },
      body: JSON.stringify({
        sender: { name: "PAMPAS Website", email: "pampas.podcast@gmail.com" },
        replyTo: { email: data.email, name: data.name },
        to: [{ email: "pampas.podcast@gmail.com", name: "PAMPAS Podcast" }],
        subject,
        htmlContent,
        textContent: `Type: ${reasonLabel}\nNaam: ${data.name}\nE-mail: ${data.email}\nOnderwerp: ${data.subject}\n\n${data.message}`,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Brevo error ${res.status}: ${body.slice(0, 200)}`);
    }

    return { ok: true as const };
  });
