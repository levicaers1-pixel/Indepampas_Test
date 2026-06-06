import { useEffect, useState } from "react";

const STORAGE_KEY = "emailPopupSeen";

export function EmailPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY) === "true") return;

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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <button
        aria-label="Sluiten"
        onClick={close}
        className="absolute inset-0 w-full h-full bg-black/60 backdrop-blur-sm cursor-default"
      />
      <div className="relative bg-[#F4EFE5] border border-[rgba(28,61,42,0.2)] shadow-[0_20px_60px_rgba(0,0,0,0.3)] w-full max-w-[580px] p-6 sm:p-8 animate-scale-in">
        <button
          onClick={close}
          aria-label="Sluiten"
          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-9 h-9 flex items-center justify-center text-[#1C3D2A] hover:bg-[#EDE6D9] transition-colors font-rb-serif text-2xl leading-none"
        >
          ×
        </button>
        <div className="w-full overflow-hidden">
          <iframe
            title="Inschrijven nieuwsbrief"
            width="540"
            height="305"
            src="https://89708d2f.sibforms.com/v2/serve/MUIFAHceTgTPUDKkwJGKU_ulIEgIjLnqmzw6wPfxJJRkd6GftZyivcynXNq6u41tVR6mohQFPSZ_9pRlLuyXVp7EAu0xydReTZaxpe3HkngMpft_Xx5mD4wjPGTJUbHn-YG_xrF6olcUnsCFSXUog-oR3rP3Ua6kWeMfErGRCSX8wk6oRX_FNGWlYM_3kJMPGsjgwhghYqyFqGLUxQ=="
            frameBorder="0"
            scrolling="auto"
            allowFullScreen
            style={{ display: "block", marginLeft: "auto", marginRight: "auto", maxWidth: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}
