import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { subscribeToBrevo } from "@/lib/brevo.functions";

const STORAGE_KEY = "emailPopupSeen";
const CAPTURED_KEY = "emailCaptured";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const subscribe = useServerFn(subscribeToBrevo);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY) === "true") return;
    if (localStorage.getItem(CAPTURED_KEY) === "true") return;

    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = scrollTop / docHeight;
      if (pct >= 0.5) {
        setOpen(true);
        localStorage.setItem(STORAGE_KEY, "true");
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setError(null);

    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed) || trimmed.length > 255) {
      setError("Vul een geldig e-mailadres in.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      await subscribe({ data: { email: trimmed, source: "scroll-popup" } });
      localStorage.setItem(CAPTURED_KEY, "true");
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Oeps, iets ging mis. Probeer het opnieuw.");
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-popup-title"
    >
      <button
        aria-label="Sluiten"
        onClick={close}
        className="absolute inset-0 w-full h-full bg-black/70 backdrop-blur-sm cursor-default"
      />
      <div className="relative bg-[#1C3D2A] border border-[rgba(244,239,229,0.15)] shadow-[0_20px_60px_rgba(0,0,0,0.5)] w-full max-w-[520px] p-8 sm:p-10 animate-scale-in">
        <button
          onClick={close}
          aria-label="Sluiten"
          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-9 h-9 flex items-center justify-center text-[#F4EFE5] hover:bg-[rgba(244,239,229,0.08)] transition-colors font-rb-serif text-2xl leading-none"
        >
          ×
        </button>

        <p className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[rgba(244,239,229,0.5)] mb-4">
          Nieuwsbrief
        </p>
        <h2
          id="email-popup-title"
          className="font-rb-serif font-light text-[2rem] sm:text-[2.4rem] text-[#F4EFE5] leading-[1.1] mb-3"
        >
          Mis geen <em className="italic">aflevering</em>.
        </h2>
        <p className="font-rb-sans text-[0.9rem] text-[rgba(244,239,229,0.65)] leading-[1.6] mb-7">
          Schrijf je in en je hoort het als eerste wanneer er een nieuwe podcast,
          course rating of blog online staat.
        </p>

        {status === "success" ? (
          <p className="font-rb-serif italic text-[#8FBF4A] text-lg">
            Bedankt! Je hoort het als eerste.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <label htmlFor="popup-email" className="sr-only">
              E-mailadres
            </label>
            <input
              id="popup-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") {
                  setStatus("idle");
                  setError(null);
                }
              }}
              placeholder="jouw@email.com"
              maxLength={255}
              className="flex-1 px-4 py-3 bg-[rgba(244,239,229,0.06)] border border-[rgba(244,239,229,0.15)] font-rb-sans text-[0.9rem] text-[#F4EFE5] placeholder:text-[rgba(244,239,229,0.35)] outline-none focus:border-[#8FBF4A] transition-colors"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="font-rb-mono text-[0.62rem] tracking-[0.14em] uppercase text-[#1C3D2A] bg-[#8FBF4A] px-7 py-3 hover:bg-[#A3D255] transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {status === "loading" ? "Bezig…" : "Inschrijven"}
            </button>
          </form>
        )}

        {status === "error" && error && (
          <p className="mt-3 font-rb-sans text-[0.8rem] text-[#E89B8B]">{error}</p>
        )}
      </div>
    </div>
  );
}
