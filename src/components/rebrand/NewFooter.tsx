import { Link } from "@tanstack/react-router";

export function NewFooter() {
  return (
    <footer className="bg-[#1C3D2A] text-[#F4EFE5] border-t border-[rgba(28,61,42,0.15)]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 px-6 lg:px-14 py-16">
        <div className="md:col-span-2">
          <div className="font-rb-serif text-3xl font-bold tracking-[0.1em] uppercase">
            PAMPAS
            <span className="font-rb-serif italic font-light text-base tracking-[0.05em] text-[rgba(244,239,229,0.5)] ml-2 normal-case">
              / Belgian Golf Community
            </span>
          </div>
          <p className="font-rb-sans text-sm text-[rgba(244,239,229,0.6)] leading-relaxed mt-6 max-w-md">
            Een Belgische golfpodcast over de mooie, harde en soms belachelijke kanten van het spel.
            Drie vrienden, één microfoon, achttien holes.
          </p>
        </div>

        <div>
          <div className="font-rb-mono text-[0.58rem] tracking-[0.18em] uppercase text-[#8FBF4A] mb-4">
            Navigatie
          </div>
          <ul className="space-y-2 font-rb-sans text-sm text-[rgba(244,239,229,0.75)]">
            <li><Link to="/afleveringen" className="hover:text-[#8FBF4A]">Afleveringen</Link></li>
            <li><Link to="/blog" className="hover:text-[#8FBF4A]">Blog</Link></li>
            <li><Link to="/hosts" className="hover:text-[#8FBF4A]">De Hosts</Link></li>
            <li><Link to="/contact" className="hover:text-[#8FBF4A]">Contact</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-rb-mono text-[0.58rem] tracking-[0.18em] uppercase text-[#8FBF4A] mb-4">
            Luister
          </div>
          <ul className="space-y-2 font-rb-sans text-sm text-[rgba(244,239,229,0.75)]">
            <li><a href="https://open.spotify.com" target="_blank" rel="noreferrer" className="hover:text-[#8FBF4A]">Spotify</a></li>
            <li><a href="https://podcasts.apple.com" target="_blank" rel="noreferrer" className="hover:text-[#8FBF4A]">Apple Podcasts</a></li>
            <li><a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-[#8FBF4A]">YouTube</a></li>
            <li><a href="https://www.instagram.com/pampas.golfpodcast" target="_blank" rel="noreferrer" className="hover:text-[#8FBF4A]">Instagram</a></li>
          </ul>
        </div>
      </div>

      <div className="px-6 lg:px-14 py-6 border-t border-[rgba(244,239,229,0.1)] flex flex-col md:flex-row justify-between gap-3 font-rb-mono text-[0.58rem] tracking-[0.18em] uppercase text-[rgba(244,239,229,0.7)]">
        <div>© {new Date().getFullYear()} PAMPAS — Onafhankelijk geproduceerd in België</div>
        <div className="text-[#8FBF4A]">Made on the back nine</div>
      </div>
    </footer>
  );
}
