import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { VersionToggle } from "@/components/VersionToggle";

const nav = [
  { to: "/", label: "Home" },
  { to: "/afleveringen", label: "Afleveringen" },
  { to: "/blog", label: "Blog" },
  { to: "/hosts", label: "Hosts" },
  { to: "/contact", label: "Contact" },
] as const;

export function NewHeader() {
  const { location } = useRouterState();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 h-[60px] flex items-center justify-between px-6 lg:px-14 bg-[#F4EFE5] border-b border-[rgba(28,61,42,0.15)] transition-shadow ${
        scrolled ? "shadow-[0_2px_24px_rgba(28,61,42,0.08)]" : ""
      }`}
    >
      <Link to="/" className="font-rb-serif text-[1.3rem] font-bold tracking-[0.1em] uppercase text-[#1C3D2A] no-underline">
        PAMPAS
        <span className="font-rb-serif italic font-light text-[0.75rem] tracking-[0.05em] text-[#7A7260] ml-1.5 align-middle normal-case">
          / Belgian Golf Podcast
        </span>
      </Link>

      <nav className="hidden md:flex items-stretch">
        {nav.map((n, i) => {
          const isActive =
            n.to === "/" ? location.pathname === "/" : location.pathname.startsWith(n.to);
          return (
            <Link
              key={n.to}
              to={n.to}
              className={`font-rb-mono text-[0.62rem] tracking-[0.14em] uppercase no-underline px-[1.1rem] py-2 border-r border-[rgba(28,61,42,0.15)] transition-colors ${
                i === 0 ? "border-l border-[rgba(28,61,42,0.15)]" : ""
              } ${
                isActive ? "text-[#1C3D2A] bg-[#EDE6D9]" : "text-[#7A7260] hover:text-[#1C3D2A]"
              }`}
            >
              {n.label}
            </Link>
          );
        })}
      </nav>

      <div className="hidden md:flex items-center gap-3">
        <VersionToggle />
        <a
          href="https://open.spotify.com/show/3Mi5qC8RDqL5RDqDxDxYqZ"
          target="_blank"
          rel="noreferrer"
          className="font-rb-mono text-[0.6rem] tracking-[0.14em] uppercase text-[#F4EFE5] bg-[#1C3D2A] no-underline px-[1.2rem] py-[0.55rem] hover:bg-[#2B5C3E] transition-colors"
        >
          ▶ Listen
        </a>
      </div>

      <div className="md:hidden flex items-center gap-2">
        <VersionToggle />
        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col gap-1 p-2"
        >
          <span className={`block h-px w-6 bg-[#1C3D2A] transition-transform ${open ? "translate-y-1.5 rotate-45" : ""}`} />
          <span className={`block h-px w-6 bg-[#1C3D2A] transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block h-px w-6 bg-[#1C3D2A] transition-transform ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <nav className="md:hidden absolute top-[60px] left-0 right-0 bg-[#F4EFE5] border-b border-[rgba(28,61,42,0.15)] flex flex-col">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="font-rb-mono text-[0.7rem] tracking-[0.14em] uppercase text-[#1C3D2A] px-6 py-4 border-b border-[rgba(28,61,42,0.1)] no-underline"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Ticker() {
  const items = [
    "Belgian Golf Podcast",
    "Vol. I — MMXXVI",
    "Antwerpen · BE",
    "Onafhankelijk geproduceerd",
    "Drie vrienden, één microfoon",
    "Wekelijks op Spotify",
  ];
  const all = [...items, ...items];
  return (
    <div className="fixed top-[60px] left-0 right-0 z-30 h-8 bg-[#1C3D2A] border-b border-[rgba(28,61,42,0.15)] flex items-center overflow-hidden">
      <div className="rb-ticker flex whitespace-nowrap">
        {all.map((t, i) => (
          <span
            key={i}
            className={`font-rb-mono text-[0.58rem] tracking-[0.18em] uppercase px-10 ${
              i % items.length === 1 ? "text-[#8FBF4A]" : "text-[rgba(244,239,229,0.6)]"
            }`}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
