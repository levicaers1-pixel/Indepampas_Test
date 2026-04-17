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

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [reason, setReason] = useState("hello");

  return (
    <section className="pt-40 lg:pt-48 pb-12 px-6 lg:px-12 relative overflow-hidden">
      <PampasMark
        className="hidden lg:block absolute top-40 right-16 w-20 h-64 text-sage/30"
        sway
      />

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5">
          <p className="text-[11px] uppercase tracking-[0.3em] text-sage font-medium mb-6">
            Stuur een bericht
          </p>
          <h1 className="font-serif text-6xl lg:text-7xl leading-[0.9] tracking-tighter text-charcoal mb-8">
            Contact<span className="text-sage">.</span>
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
              <dt className="text-[10px] uppercase tracking-[0.25em] text-sage mb-1">Sponsors</dt>
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
              <dt className="text-[10px] uppercase tracking-[0.25em] text-sage mb-1">
                Thuishaven
              </dt>
              <dd className="text-charcoal/80">Antwerpen</dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-7">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
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
              ) : (
                <p className="text-xs text-charcoal/50">We antwoorden meestal binnen 48 uur.</p>
              )}
              <button
                type="submit"
                disabled={sent}
                className="rounded-full px-6 py-3 bg-charcoal text-mist text-sm uppercase tracking-[0.18em] hover:bg-sage transition-colors disabled:opacity-50"
              >
                {sent ? "Verstuurd" : "Versturen"}
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
