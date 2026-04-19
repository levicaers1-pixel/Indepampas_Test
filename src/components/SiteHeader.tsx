import { Link } from "@tanstack/react-router";
import { useState } from "react";

const nav = [
  { to: "/", label: "Thuis" },
  { to: "/afleveringen", label: "Afleveringen" },
  { to: "/hosts", label: "De Hosts" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-5 sm:px-6 lg:px-12 py-5 sm:py-8">
      <div className="flex items-start justify-between gap-4">
        <Link to="/" className="flex flex-col group shrink-0">
          <span className="font-serif italic lowercase text-2xl sm:text-3xl text-charcoal leading-none group-hover:text-sage transition-colors">
            pampas<span className="text-sage">.</span>
          </span>
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-sage mt-1.5 sm:mt-2 font-medium">
            Belgian Golf Podcast
          </span>
        </Link>

        <nav className="hidden md:flex gap-6 lg:gap-10 text-xs uppercase tracking-[0.2em] font-medium text-charcoal/60 pt-2">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeProps={{ className: "!text-charcoal" }}
              activeOptions={{ exact: n.to === "/" }}
              className="hover:text-charcoal transition-colors duration-300"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block text-xs uppercase tracking-[0.2em] font-medium text-charcoal/60 text-right pt-2">
          <div>ANTWERPEN· BE</div>
          <div className="text-sage">Vol. I — 2025</div>
        </div>

        <button
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden flex flex-col gap-1.5 pt-2 -mr-1 p-2"
        >
          <span className={`block h-px w-7 bg-charcoal transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-px w-7 bg-charcoal transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block h-px w-7 bg-charcoal transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <nav className="md:hidden mt-6 pt-6 border-t border-charcoal/10 flex flex-col gap-5 text-sm uppercase tracking-[0.2em] font-medium">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              activeProps={{ className: "!text-charcoal" }}
              activeOptions={{ exact: n.to === "/" }}
              className="text-charcoal/60 hover:text-charcoal"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
