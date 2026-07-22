import { useEffect, useMemo, useState } from "react";
import { episodes as staticEpisodes, mergeEpisodes, type Episode } from "@/data/episodes";
import { SpotifyEmbed } from "@/components/SpotifyEmbed";
import { supabase } from "@/integrations/supabase/client";

export function NewEpisodes() {
  const [dbEpisodes, setDbEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    supabase
      .from("episodes")
      .select("spotify_id, number, season, title, description, date, duration, topics, image_url, release_date")
      .order("release_date", { ascending: false, nullsFirst: false })
      .then(({ data }) => {
        if (!data) return;
        setDbEpisodes(
          data.map((r: any) => ({
            number: r.number,
            season: r.season,
            title: r.title,
            description: r.description,
            date: r.date,
            releaseDate: r.release_date,
            duration: r.duration,
            spotifyId: r.spotify_id,
            imageUrl: r.image_url,
            topics: r.topics ?? [],
          })),
        );
      });
  }, []);

  const episodes = useMemo(() => mergeEpisodes(dbEpisodes, staticEpisodes), [dbEpisodes]);

  const [openId, setOpenId] = useState<string | null>(episodes[0]?.spotifyId ?? null);
  useEffect(() => {
    if (!openId && episodes[0]) setOpenId(episodes[0].spotifyId);
  }, [episodes, openId]);

  return (
    <>
      <div className="px-6 lg:px-14 pt-16 pb-12 border-b border-[rgba(28,61,42,0.15)] flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <p className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#635C4B] mb-4">
            Het archief
          </p>
          <h1 className="font-rb-serif font-light text-[clamp(2.8rem,5vw,4.5rem)] text-[#1C3D2A] leading-none">
            Afleveringen<em className="italic">.</em>
          </h1>
          <p className="font-rb-sans text-[0.95rem] text-[#635C4B] mt-3 whitespace-pre-line">
            Elke dinsdag een nieuwe episode.{"\n"}
            Tijdens de zomermaanden doen we het net iets rustiger aan, verwacht enkele specials maar niets wekelijks!
          </p>
        </div>
        <div className="text-right font-rb-mono text-[0.6rem] tracking-[0.12em] uppercase text-[#635C4B] leading-[2]">
          <div>Seizoen 01 / 2026</div>
          <div className="text-[#8FBF4A]">{episodes.length.toString().padStart(2, "0")} afleveringen</div>
        </div>
      </div>

      <div className="px-6 lg:px-14">
        {episodes.map((ep) => {
          const isOpen = openId === ep.spotifyId;
          return (
            <div key={ep.spotifyId} className="border-b border-[rgba(28,61,42,0.15)]">
              <button
                onClick={() => setOpenId(isOpen ? null : ep.spotifyId)}
                className="w-full grid grid-cols-[100px_1fr_auto] gap-6 lg:gap-10 items-start py-10 text-left hover:bg-[#EDE6D9] transition-colors -mx-2 px-2 lg:-mx-6 lg:px-6"
              >
                <div>
                  <p className="font-rb-mono text-[0.58rem] tracking-[0.14em] uppercase text-[#635C4B] mb-1">
                    {ep.season}
                  </p>
                  <p className="font-rb-serif font-light text-[2.8rem] text-[#E2D9C8] leading-none">
                    {ep.number?.toLowerCase().includes("special") || ep.number === "18" ? "special" : ep.number}
                  </p>
                </div>
                <div>
                  <h2 className="font-rb-serif text-[1.5rem] font-normal text-[#1C3D2A] leading-[1.25] mb-2">
                    {ep.title}
                  </h2>
                  <p className="font-rb-sans text-[0.9rem] text-[#635C4B] leading-[1.65] max-w-2xl mb-3 line-clamp-2">
                    {ep.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {ep.topics.map((t) => (
                      <span
                        key={t}
                        className="font-rb-mono text-[0.55rem] tracking-[0.12em] uppercase border border-[rgba(28,61,42,0.3)] text-[#635C4B] px-2 py-0.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-rb-mono text-[0.6rem] tracking-[0.1em] text-[#635C4B]">{ep.date}</span>
                  <span className="font-rb-mono text-[0.6rem] tracking-[0.1em] text-[#8FBF4A]">{ep.duration}</span>
                  <span
                    className={`mt-3 w-10 h-10 flex items-center justify-center border transition-all ${
                      isOpen
                        ? "bg-[#1C3D2A] text-[#F4EFE5] border-[#1C3D2A]"
                        : "border-[rgba(28,61,42,0.3)] text-[#1C3D2A]"
                    }`}
                  >
                    <span className={`transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className="pb-10 pl-[calc(100px+1.5rem)] lg:pl-[calc(100px+2.5rem)]">
                  <SpotifyEmbed uri={ep.spotifyId} type="episode" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="px-6 lg:px-14 py-8 border-t border-[rgba(28,61,42,0.15)] flex flex-wrap items-center gap-0">
        <span className="font-rb-mono text-[0.6rem] tracking-[0.16em] uppercase text-[#635C4B] mr-8">
          Ook op
        </span>
        {[
          { label: "Spotify", href: "https://open.spotify.com" },
          { label: "Apple Podcasts", href: "https://podcasts.apple.com" },
          { label: "YouTube", href: "https://youtube.com" },
        ].map((p, i) => (
          <a
            key={p.label}
            href={p.href}
            target="_blank"
            rel="noreferrer"
            className={`font-rb-mono text-[0.62rem] tracking-[0.12em] uppercase text-[#1C3D2A] no-underline px-6 py-2.5 border border-[rgba(28,61,42,0.15)] hover:bg-[#1C3D2A] hover:text-[#F4EFE5] transition-colors ${
              i > 0 ? "border-l-0" : ""
            }`}
          >
            {p.label}
          </a>
        ))}
      </div>
    </>
  );
}
