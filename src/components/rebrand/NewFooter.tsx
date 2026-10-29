import { Link } from "@tanstack/react-router";

const linkClass =
  "text-[var(--rb-muted)] no-underline hover:text-[var(--rb-lime)] transition-colors";

export function NewFooter() {
  return (
    <footer className="relative overflow-hidden bg-[var(--rb-ground-2)] border-t border-[var(--rb-rule)]">
      <div
        aria-hidden="true"
        className="rb-disp pointer-events-none select-none absolute -bottom-[0.18em] left-1/2 -translate-x-1/2 whitespace-nowrap text-[clamp(6rem,24vw,20rem)] rb-outline"
        style={{ WebkitTextStroke: "1.5px rgba(242,239,230,0.07)" }}
      >
        PAMPAS
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-4 gap-10 px-6 lg:px-14 pt-16 pb-24">
        <div className="md:col-span-2">
          <div className="font-rb-serif font-black text-3xl tracking-[0.18em] uppercase text-[var(--rb-ink)]">
            PAMPAS
          </div>
          <p className="font-rb-sans text-sm text-[var(--rb-muted)] leading-relaxed mt-5 max-w-md">
            Een Belgische golfpodcast over de mooie, harde en soms belachelijke kanten van het spel.
            Drie vrienden, één microfoon, achttien holes.
          </p>
        </div>

        <div>
          <div className="rb-mono text-[var(--rb-lime)] mb-4">Navigatie</div>
          <ul className="space-y-2 font-rb-sans text-sm">
            <li><Link to="/afleveringen" className={linkClass}>Afleveringen</Link></li>
            <li><Link to="/blog" className={linkClass}>Blog</Link></li>
            <li><Link to="/golfbanen" className={linkClass}>Golfbanen</Link></li>
            <li><Link to="/hosts" className={linkClass}>De Hosts</Link></li>
            <li><Link to="/contact" className={linkClass}>Contact</Link></li>
          </ul>
        </div>

        <div>
          <div className="rb-mono text-[var(--rb-lime)] mb-4">Luister</div>
          <ul className="space-y-2 font-rb-sans text-sm">
            <li><a href="https://open.spotify.com/show/37wE4nKPeQNjYLYoMFelLP" target="_blank" rel="noreferrer" className={linkClass}>Spotify</a></li>
            <li><a href="https://podcasts.apple.com" target="_blank" rel="noreferrer" className={linkClass}>Apple Podcasts</a></li>
            <li><a href="https://youtube.com" target="_blank" rel="noreferrer" className={linkClass}>YouTube</a></li>
            <li><a href="https://www.instagram.com/pampas.golfpodcast" target="_blank" rel="noreferrer" className={linkClass}>Instagram</a></li>
          </ul>
        </div>
      </div>

      <div className="relative px-6 lg:px-14 py-6 border-t border-[var(--rb-rule)] flex flex-col md:flex-row justify-between gap-3 rb-mono text-[var(--rb-dim)]">
        <div>© {new Date().getFullYear()} PAMPAS — Onafhankelijk geproduceerd in België</div>
        <div className="text-[var(--rb-lime)]">Made on the back nine</div>
      </div>
    </footer>
  );
}
