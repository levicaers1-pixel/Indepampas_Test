import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import monogram from "@/assets/monogram.webp";

const nav = [
  { to: "/", label: "Home" },
  { to: "/afleveringen", label: "Afleveringen" },
  { to: "/blog", label: "Blog" },
  { to: "/ratings", label: "Course Ratings" },
  { to: "/hosts", label: "Hosts" },
  { to: "/vrienden", label: "Vrienden" },
  { to: "/contact", label: "Contact" },
] as const;

export function NewHeader() {
  const { location } = useRouterState();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu after a navigation.
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 h-[64px] flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-14 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled || open
          ? "bg-[rgba(12,26,18,0.88)] backdrop-blur-md shadow-[0_1px_0_var(--rb-rule)]"
          : "bg-transparent"
      }`}
    >
      <Link
        to="/"
        aria-label="PAMPAS — naar de homepagina"
        className="shrink-0 flex items-center gap-2.5 no-underline text-[var(--rb-ink)]"
      >
        <span
          aria-hidden="true"
          className="inline-block h-7 w-7 bg-[var(--rb-lime)]"
          style={{
            WebkitMaskImage: `url(${monogram})`,
            maskImage: `url(${monogram})`,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            WebkitMaskSize: "contain",
            maskSize: "contain",
          }}
        />
        <span className="font-rb-serif font-black text-[1.15rem] sm:text-[1.3rem] tracking-[0.18em] uppercase">
          PAMPAS
        </span>
      </Link>

      <nav aria-label="Hoofdmenu" className="hidden xl:flex items-center gap-1">
        {nav.map((n) => {
          const isActive =
            n.to === "/" ? location.pathname === "/" : location.pathname.startsWith(n.to);
          return (
            <Link
              key={n.to}
              to={n.to}
              aria-current={isActive ? "page" : undefined}
              className={`font-rb-mono text-[0.7rem] tracking-[0.16em] uppercase whitespace-nowrap no-underline px-3 py-2 border-b-2 transition-colors ${
                isActive
                  ? "text-[var(--rb-lime)] border-[var(--rb-lime)]"
                  : "text-[var(--rb-ink)] border-transparent hover:text-[var(--rb-lime)]"
              }`}
            >
              {n.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3">
        <a
          href="https://open.spotify.com/show/37wE4nKPeQNjYLYoMFelLP"
          target="_blank"
          rel="noreferrer"
          className="rb-btn rb-btn-lime !py-[0.65rem] !px-[1.1rem] !text-[0.72rem]"
        >
          Luister nu
        </a>
        <button
          type="button"
          aria-label={open ? "Menu sluiten" : "Menu openen"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="xl:hidden flex h-11 w-11 flex-col items-center justify-center gap-[5px] border-[1.5px] border-[rgba(242,239,230,0.5)] bg-[rgba(12,26,18,0.4)]"
        >
          <span className={`block h-[2px] w-5 bg-[var(--rb-ink)] transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`block h-[2px] w-5 bg-[var(--rb-ink)] transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block h-[2px] w-5 bg-[var(--rb-ink)] transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <nav
          aria-label="Mobiel menu"
          className="xl:hidden absolute top-[64px] left-0 right-0 bg-[rgba(12,26,18,0.97)] backdrop-blur-md border-t border-[var(--rb-rule)] flex flex-col"
        >
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="font-rb-serif font-extrabold text-xl uppercase tracking-[-0.01em] text-[var(--rb-ink)] px-6 py-4 border-b border-[var(--rb-rule)] no-underline"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
