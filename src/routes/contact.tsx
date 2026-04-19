import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PampasMark } from "@/components/PampasMark";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Sponsors — PAMPAS Podcast" },
      {
        name: "description",
        content:
          "Neem contact op met de PAMPAS podcast. Voor sponsoring, samenwerkingen of een goed verhaal van op de baan.",
      },
      { property: "og:title", content: "Contact & Sponsors — PAMPAS Podcast" },
      {
        property: "og:description",
        content: "Sponsoring, samenwerkingen of een goed golfverhaal? Stuur een bericht.",
      },
    ],
  }),
  component: ContactPage,
});

const WEB3FORMS_ACCESS_KEY = "53e7aa49-deb0-4e21-8060-498fa043cedc";

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState("hello");

  return (
    <section className="pt-28 sm:pt-36 lg:pt-48 pb-12 px-6 lg:px-12 relative overflow-hidden">
      <PampasMark
        className="hidden lg:block absolute top-40 right-16 w-20 h-64 text-sage/30"
        sway
      />

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5">
          <p className="text-[11px] uppercase tracking-[0.3em] text-sage font-medium mb-6">
            STUUR EEN BERICHT -&nbsp; IN PROGRESS&nbsp;
          </p>
          <h1 className="font-serif text-6xl lg:text-7xl leading-[0.9] tracking-tighter text-charcoal mb-8">
            Contact<span className="text-sage">.</span> - in progress
          </h1>
          <p className="text-lg text-charcoal/75 leading-relaxed mb-10">
            Sponsoring, een uitnodiging op je baan, of gewoon een verhaal dat verteld moet worden —
            we lezen alles.
          </p>

          <dl className="space-y-6 text-sm">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.25em] text-sage mb-1">E-mail</dt>
              <dd>
                <a
                  href="mailto:pampas.podcast@gmail.com"
                  className="font-serif italic text-2xl text-charcoal hover:text-sage transition-colors"
                >
                  pampas.podcast@gmail.com
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.25em] text-sage mb-1">Instagram</dt>
              <dd>
                <a
                  href="https://www.instagram.com/pampas.golfpodcast?igsh=MTJiemJ1MHlncG14bA=="
                  target="_blank"
                  rel="noreferrer"
                  className="font-serif italic text-2xl text-charcoal hover:text-sage transition-colors"
                >
                  @pampas.golfpodcast
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.25em] text-sage mb-1">
                Thuishaven
              </dt>
              <dd className="text-charcoal/80">Antwerpen</dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-7">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (sending || sent) return;
              setError(null);
              setSending(true);
              const formEl = e.currentTarget;
              const formData = new FormData(formEl);
              formData.append("access_key", WEB3FORMS_ACCESS_KEY);
              formData.append("reason", reason);
              formData.append("from_name", "PAMPAS Podcast Website");
              formData.append(
                "subject",
                `[PAMPAS contact - ${reason}] ${formData.get("subject") ?? ""}`,
              );
              try {
                const res = await fetch("https://api.web3forms.com/submit", {
                  method: "POST",
                  body: formData,
                });
                const json = (await res.json().catch(() => null)) as
                  | { success?: boolean; message?: string }
                  | null;
                if (res.ok && json?.success) {
                  setSent(true);
                  formEl.reset();
                } else {
                  setError(json?.message ?? "Er ging iets mis. Probeer het opnieuw.");
                }
              } catch {
                setError("Geen verbinding. Probeer het opnieuw.");
              } finally {
                setSending(false);
              }
            }}
            className="bg-white p-8 lg:p-12 rounded-2xl border border-charcoal/10 shadow-sm space-y-6"
          >
            <div className="flex flex-wrap gap-2">
              {[
                { id: "hello", label: "Algemeen" },
                { id: "sponsor", label: "Sponsoring" },
                { id: "guest", label: "Gast" },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setReason(r.id)}
                  className={`text-[11px] uppercase tracking-[0.18em] px-4 py-2 rounded-full border transition-colors ${
                    reason === r.id
                      ? "bg-charcoal text-mist border-charcoal"
                      : "border-charcoal/15 text-charcoal/70 hover:border-charcoal/40"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Naam" name="name" required />
              <Field label="E-mail" name="email" type="email" required />
            </div>
            <Field label="Onderwerp" name="subject" required />
            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] text-sage font-medium mb-2">
                Bericht
              </label>
              <textarea
                required
                rows={6}
                className="w-full rounded-lg px-4 py-3 bg-mist border border-charcoal/15 focus:border-sage focus:ring-2 focus:ring-sage/30 outline-none text-charcoal resize-none"
                placeholder="Vertel ons je verhaal…"
              />
            </div>

            <div className="flex items-center justify-between gap-4 pt-2">
              {sent ? (
                <p className="text-sage font-serif italic text-lg">
                  Bedankt — we komen snel bij je terug.
                </p>
              ) : error ? (
                <p className="text-sm text-red-600">{error}</p>
              ) : (
                <p className="text-xs text-charcoal/50">We antwoorden meestal binnen 48 uur.</p>
              )}
              <button
                type="submit"
                disabled={sent || sending}
                className="rounded-full px-6 py-3 bg-charcoal text-mist text-sm uppercase tracking-[0.18em] hover:bg-sage transition-colors disabled:opacity-50"
              >
                {sent ? "Verstuurd" : sending ? "Versturen…" : "Versturen"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-[10px] uppercase tracking-[0.25em] text-sage font-medium mb-2"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg px-4 py-3 bg-mist border border-charcoal/15 focus:border-sage focus:ring-2 focus:ring-sage/30 outline-none text-charcoal"
      />
    </div>
  );
}
