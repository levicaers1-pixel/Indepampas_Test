import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SpotifyEmbed } from "@/components/SpotifyEmbed";
import { episodes } from "@/data/episodes";

const SITE_URL = "https://indepampas.be";
const EPISODES_DESCRIPTION =
  "Het volledige archief van PAMPAS — de Belgische golfpodcast. Beluister elke aflevering rechtstreeks via Spotify, elke dinsdag een nieuwe episode.";

export const Route = createFileRoute("/afleveringen")({
  head: () => ({
    meta: [
      { title: "Afleveringen — PAMPAS Podcast" },
      { name: "description", content: EPISODES_DESCRIPTION },
      { property: "og:title", content: "Afleveringen — PAMPAS Podcast" },
      { property: "og:description", content: EPISODES_DESCRIPTION },
      { property: "og:url", content: SITE_URL + "/afleveringen" },
      { name: "twitter:title", content: "Afleveringen — PAMPAS Podcast" },
      { name: "twitter:description", content: EPISODES_DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/afleveringen" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Afleveringen — PAMPAS Podcast",
          description: EPISODES_DESCRIPTION,
          url: SITE_URL + "/afleveringen",
        }),
      },
    ],
  }),
  component: Afleveringen,
});

function Afleveringen() {
  const [openId, setOpenId] = useState<string | null>(episodes[0].number);

  return (
    <section className="pt-28 sm:pt-36 lg:pt-48 pb-12 px-6 lg:px-12">
      <div className="max-w-[1200px] mx-auto">
        <p className="text-[11px] uppercase tracking-[0.3em] text-sage font-medium mb-6">
          Het Archief
        </p>
        <h1 className="font-serif text-6xl lg:text-8xl leading-[0.9] tracking-tighter text-charcoal mb-8">
          Afleveringen<span className="text-sage">.</span>
        </h1>
        <p className="text-lg lg:text-xl text-charcoal/75 max-w-2xl leading-relaxed mb-16">
          Elke dinsdag een nieuwe episode. Klik om te luisteren, of open in Spotify voor de
          volledige show.
        </p>

        <ul className="divide-y divide-charcoal/10 border-y border-charcoal/10">
          {episodes.map((ep) => {
            const isOpen = openId === ep.number;
            return (
              <li key={ep.number} className="py-6">
                <button
                  onClick={() => setOpenId(isOpen ? null : ep.number)}
                  className="w-full grid grid-cols-12 gap-4 items-baseline text-left group"
                >
                  <span className="col-span-3 sm:col-span-2 font-serif italic text-sage text-xl">
                    {ep.season}·{ep.number}
                  </span>
                  <div className="col-span-9 sm:col-span-7">
                    <h2 className="font-serif text-2xl lg:text-4xl text-charcoal group-hover:text-sage transition-colors">
                      {ep.title}
                    </h2>
                    <p className="text-sm text-charcoal/60 mt-2 line-clamp-2">{ep.description}</p>
                  </div>
                  <span className="hidden sm:block sm:col-span-2 text-xs uppercase tracking-[0.18em] text-charcoal/50">
                    {ep.date}
                  </span>
                  <span className="hidden sm:flex sm:col-span-1 justify-end">
                    <span
                      className={`size-9 rounded-full border border-charcoal/30 flex items-center justify-center transition-all ${
                        isOpen ? "bg-charcoal text-mist border-charcoal" : "text-charcoal/60"
                      }`}
                    >
                      <span className={`transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
                    </span>
                  </span>
                </button>

                {isOpen && (
                  <div className="grid grid-cols-12 gap-4 mt-6">
                    <div className="col-span-12 sm:col-start-3 sm:col-span-10">
                      <SpotifyEmbed
                        uri={ep.spotifyId}
                        type="episode"
                        title={`${ep.title} — Spotify player`}
                      />
                      <div className="flex flex-wrap gap-2 mt-4">
                        {ep.topics.map((t) => (
                          <span
                            key={t}
                            className="text-[11px] uppercase tracking-[0.18em] px-3 py-1.5 rounded-full border border-charcoal/15 text-charcoal/70"
                          >
                            {t}
                          </span>
                        ))}
                        <span className="ml-auto text-xs text-charcoal/50 self-center">
                          {ep.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
