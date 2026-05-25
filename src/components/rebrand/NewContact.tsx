import { useState } from "react";

const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY ?? "";

export function NewContact() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState("hello");

  return (
    <>
      <div className="px-6 lg:px-14 pt-16 pb-12 border-b border-[rgba(28,61,42,0.15)]">
        <p className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#7A7260] mb-4">
          Stuur een bericht
        </p>
        <h1 className="font-rb-serif font-light text-[clamp(2.8rem,5vw,4.5rem)] text-[#1C3D2A] leading-none">
          <em className="italic">Contact</em>.
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-[#1C3D2A] px-8 lg:px-14 py-14 lg:border-r border-[rgba(28,61,42,0.15)]">
          <h2 className="font-rb-serif font-light text-[2.5rem] text-[#F4EFE5] leading-[1.2] mb-3">
            Een verhaal, een baan, een <em className="italic">sponsor</em>?
          </h2>
          <p className="font-rb-sans text-[0.9rem] text-[rgba(244,239,229,0.6)] leading-[1.7] max-w-md mb-12">
            Sponsoring, een uitnodiging op je baan, of gewoon een verhaal dat verteld moet worden —
            we lezen alles.
          </p>

          {[
            { label: "E-mail", val: "pampas.podcast@gmail.com", href: "mailto:pampas.podcast@gmail.com" },
            { label: "Instagram", val: "@pampas.golfpodcast", href: "https://www.instagram.com/pampas.golfpodcast" },
            { label: "Locatie", val: "Antwerpen, BE" },
          ].map((row) => (
            <div key={row.label} className="flex items-start gap-4 mb-6">
              <span className="font-rb-mono text-[0.58rem] tracking-[0.16em] uppercase text-[rgba(244,239,229,0.4)] pt-1 min-w-[80px]">
                {row.label}
              </span>
              {row.href ? (
                <a
                  href={row.href}
                  target={row.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="font-rb-sans text-[0.9rem] text-[#F4EFE5] hover:text-[#8FBF4A]"
                >
                  {row.val}
                </a>
              ) : (
                <span className="font-rb-sans text-[0.9rem] text-[#F4EFE5]">{row.val}</span>
              )}
            </div>
          ))}
        </div>

        <div className="px-8 lg:px-14 py-14">
          <h3 className="font-rb-serif text-[1.5rem] text-[#1C3D2A] mb-8">Schrijf ons.</h3>

          <div className="flex border-b border-[rgba(28,61,42,0.15)] mb-10">
            {[
              { id: "hello", label: "Algemeen" },
              { id: "sponsor", label: "Sponsoring" },
              { id: "guest", label: "Gast" },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setReason(r.id)}
                className={`font-rb-mono text-[0.6rem] tracking-[0.12em] uppercase px-6 py-3 border-b-2 -mb-px transition-colors ${
                  reason === r.id
                    ? "text-[#1C3D2A] border-[#8FBF4A]"
                    : "text-[#7A7260] border-transparent hover:text-[#1C3D2A]"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (sending || sent) return;
              setError(null);
              setSending(true);
              const formEl = e.currentTarget;
              const fd = new FormData(formEl);
              fd.append("access_key", WEB3FORMS_ACCESS_KEY);
              fd.append("reason", reason);
              fd.append("from_name", "PAMPAS Website");
              fd.append("subject", `[PAMPAS contact - ${reason}] ${fd.get("subject") ?? ""}`);
              try {
                const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: fd });
                const json = (await res.json().catch(() => null)) as { success?: boolean; message?: string } | null;
                if (res.ok && json?.success) {
                  setSent(true);
                  formEl.reset();
                } else {
                  setError(json?.message ?? "Er ging iets mis. Probeer opnieuw.");
                }
              } catch {
                setError("Geen verbinding.");
              } finally {
                setSending(false);
              }
            }}
            className="flex flex-col gap-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <RbField label="Naam" name="name" required />
              <RbField label="E-mail" name="email" type="email" required />
            </div>
            <RbField label="Onderwerp" name="subject" required />
            <div className="flex flex-col gap-1.5">
              <label className="font-rb-mono text-[0.58rem] tracking-[0.14em] uppercase text-[#7A7260]">
                Bericht
              </label>
              <textarea
                required
                rows={6}
                name="message"
                className="px-4 py-3 bg-[#EDE6D9] border border-[rgba(28,61,42,0.15)] font-rb-sans text-[0.9rem] text-[#18180F] outline-none focus:border-[#1C3D2A] resize-none"
              />
            </div>

            <div className="flex justify-between items-center pt-2 gap-4 flex-wrap">
              {sent ? (
                <p className="font-rb-serif italic text-[#8FBF4A] text-lg">Bedankt — we komen snel bij je terug.</p>
              ) : error ? (
                <p className="font-rb-sans text-sm text-red-700">{error}</p>
              ) : (
                <p className="font-rb-mono text-[0.58rem] tracking-[0.14em] uppercase text-[#7A7260]">
                  We antwoorden binnen 48u
                </p>
              )}
              <button
                type="submit"
                disabled={sending || sent}
                className="font-rb-mono text-[0.62rem] tracking-[0.14em] uppercase text-[#F4EFE5] bg-[#1C3D2A] px-8 py-[0.9rem] hover:bg-[#2B5C3E] transition-colors disabled:opacity-50"
              >
                {sent ? "Verstuurd" : sending ? "Versturen…" : "Versturen"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

function RbField({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="font-rb-mono text-[0.58rem] tracking-[0.14em] uppercase text-[#7A7260]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="px-4 py-3 bg-[#EDE6D9] border border-[rgba(28,61,42,0.15)] font-rb-sans text-[0.9rem] text-[#18180F] outline-none focus:border-[#1C3D2A]"
      />
    </div>
  );
}
