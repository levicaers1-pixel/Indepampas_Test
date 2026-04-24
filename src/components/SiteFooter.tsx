import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-charcoal/10 mt-32 px-6 lg:px-12 py-16 bg-sand/40">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
        <div className="md:col-span-2">
          <div className="font-serif italic lowercase text-5xl text-charcoal leading-none">
            pampas<span className="text-sage">.</span>
          </div>
          <p className="mt-6 max-w-md text-sm text-charcoal/70 leading-relaxed">
            Een Belgische golfpodcast over de mooie, harde en soms belachelijke kanten van het spel.
            Drie vrienden, één microfoon, achttien holes.
          </p>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-sage font-medium mb-4">Navigatie</div>
          <ul className="space-y-2 text-sm text-charcoal/80">
            <li><Link to="/afleveringen" className="hover:text-charcoal hover:underline underline-offset-4">Afleveringen</Link></li>
            <li><Link to="/blog" className="hover:text-charcoal hover:underline underline-offset-4">Blog</Link></li>
            <li><Link to="/hosts" className="hover:text-charcoal hover:underline underline-offset-4">De Hosts</Link></li>
            <li><Link to="/contact" className="hover:text-charcoal hover:underline underline-offset-4">Contact & Sponsors</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-sage font-medium mb-4">Luister</div>
          <ul className="space-y-2 text-sm text-charcoal/80">
            <li><a href="https://open.spotify.com" target="_blank" rel="noreferrer" className="hover:text-charcoal hover:underline underline-offset-4">Spotify</a></li>
            <li><a href="https://podcasts.apple.com" target="_blank" rel="noreferrer" className="hover:text-charcoal hover:underline underline-offset-4">Apple Podcasts</a></li>
            <li><a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-charcoal hover:underline underline-offset-4">YouTube</a></li>
            <li><a href="https://www.instagram.com/pampas.golfpodcast?igsh=MTJiemJ1MHlncG14bA==" target="_blank" rel="noreferrer" className="hover:text-charcoal hover:underline underline-offset-4">Instagram</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-charcoal/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] uppercase tracking-[0.2em] text-charcoal/50">
        <div>© {new Date().getFullYear()} PAMPAS Podcast — Onafhankelijk geproduceerd in België</div>
        <div className="text-sage">Made on the back nine</div>
      </div>
    </footer>
  );
}
