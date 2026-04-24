import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SpotifyEmbed } from "@/components/SpotifyEmbed";
import { PampasMark } from "@/components/PampasMark";
import { episodes, latestEpisode } from "@/data/episodes";
import { hosts } from "@/data/hosts";
import hostsWalking from "@/assets/hosts-walking.webp";
import pampasGrass from "@/assets/pampas-grass.webp";
import golfDetail from "@/assets/golf-detail.webp";
import pampasWordmark from "@/assets/pampas-wordmark.webp";

const SITE_URL = "https://indepampas.be";
const HOME_DESCRIPTION =
  "Drie Belgische vrienden, achttien holes, één microfoon. Beluister PAMPAS — de podcast over Belgische golfcultuur. Wekelijks op Spotify.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PAMPAS — Belgische Golf Podcast" },
      { name: "description", content: HOME_DESCRIPTION },
      { property: "og:title", content: "PAMPAS — Belgische Golf Podcast" },
      { property: "og:description", content: HOME_DESCRIPTION },
      { property: "og:url", content: SITE_URL + "/" },
      { property: "og:image", content: SITE_URL + hostsWalking },
      { name: "twitter:title", content: "PAMPAS — Belgische Golf Podcast" },
      { name: "twitter:description", content: HOME_DESCRIPTION },
      { name: "twitter:image", content: SITE_URL + hostsWalking },
    ],
    links: [
      { rel: "canonical", href: SITE_URL + "/" },
      { rel: "preload", as: "image", href: pampasWordmark, fetchPriority: "high" },
      { rel: "preconnect", href: "https://open.spotify.com" },
      { rel: "preconnect", href: "https://image-cdn-fa.spotifycdn.com", crossOrigin: "anonymous" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "PodcastSeries",
          name: "PAMPAS",
          description: HOME_DESCRIPTION,
          url: SITE_URL,
          inLanguage: "nl-BE",
          author: { "@type": "Organization", name: "PAMPAS Podcast" },
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <LatestEpisodeSection />
      <HostsTeaser />
      <RecentEpisodes />
      <Newsletter />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-24 lg:pt-48 lg:pb-32 px-6 lg:px-12">
      {/* Atmospheric blurred backgrounds */}
      <div className="pointer-events-none absolute -top-32 -right-32 size-[800px] rounded-full bg-dune/40 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 -left-64 size-[900px] rounded-full bg-sage/15 blur-[160px]" />

      {/* Vertical text rail */}
      <div
        className="hidden xl:block absolute left-6 top-1/2 -translate-y-1/2 -rotate-180"
        style={{ writingMode: "vertical-rl" }}
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-medium">
          Onafhankelijk geproduceerd · Vol. II · MMXXV
        </p>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-[1500px] mx-auto items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7"
        >
          <p className="text-sage uppercase tracking-[0.3em] text-xs lg:text-sm mb-6 font-medium">
            BELGISCHE GOLFPASSIE· SINDS 2026
          </p>

          <h1 className="mb-10 -ml-2 sm:-ml-4">
            <span className="sr-only">Pampas.</span>
            <img
              src={pampasWordmark}
              alt="PAMPAS"
              width={680}
              height={190}
              fetchPriority="high"
              className="w-full max-w-[560px] sm:max-w-[720px] lg:max-w-[900px] h-auto select-none"
              draggable={false}
            />
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl font-light text-pretty max-w-[44ch] leading-relaxed mb-12 text-charcoal/80">
            Voor golfers, door golfers.
          </p>

          {/* Spotify-style CTA pill */}
          <Link
            to="/afleveringen"
            className="group flex items-center gap-3 sm:gap-5 p-2 pr-5 sm:pr-8 bg-white/60 backdrop-blur-md border border-charcoal/5 shadow-sm rounded-full w-full max-w-md sm:w-max hover:bg-white/90 transition-all duration-500"
          >
            <div className="size-12 sm:size-16 rounded-full bg-charcoal flex items-center justify-center shrink-0 shadow-lg shadow-charcoal/20 group-hover:scale-105 transition-transform duration-500">
              <div className="w-0 h-0 border-y-[6px] sm:border-y-[7px] border-y-transparent border-l-[10px] sm:border-l-[12px] border-l-mist ml-0.5 sm:ml-1" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-0.5 sm:mb-1">
                <span className="size-1.5 sm:size-2 rounded-full bg-sage animate-pulse shrink-0" />
                <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
                  Nieuwste aflevering
                </p>
              </div>
              <p className="text-sm sm:text-lg font-serif italic text-charcoal truncate">
                {latestEpisode.season} · E{latestEpisode.number} — {latestEpisode.title}
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Editorial collage */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="hidden lg:block lg:col-span-5 relative h-[640px] w-full"
        >
          <div className="absolute top-12 right-0 w-[70%] aspect-[3/4] bg-dune p-3 shadow-xl shadow-charcoal/10 rotate-3 z-10 transition-all duration-700 hover:rotate-0 hover:z-40">
            <img
              src={pampasGrass}
              loading="lazy"
              width={800}
              height={1024}
              className="w-full h-full object-cover ring-1 ring-inset ring-charcoal/10"
              alt="Pampasgras tegen warme zandkleur"
            />
          </div>
          <div className="absolute top-48 -left-8 w-[80%] aspect-square bg-white p-3 shadow-2xl shadow-charcoal/15 -rotate-2 z-20 transition-all duration-700 hover:rotate-0 hover:z-40">
            <img
              src={hostsWalking}
              width={1280}
              height={1280}
              className="w-full h-full object-cover sepia-[0.25] contrast-110 ring-1 ring-inset ring-charcoal/10"
              alt="Drie vrienden lopen over een Belgische links-baan"
            />
          </div>
          <div className="absolute -bottom-8 right-12 w-[45%] aspect-[4/3] bg-sand p-2 shadow-lg shadow-charcoal/5 rotate-6 z-30 transition-all duration-700 hover:rotate-0 hover:z-40">
            <img
              src={golfDetail}
              loading="lazy"
              width={800}
              height={600}
              className="w-full h-full object-cover ring-1 ring-inset ring-charcoal/10"
              alt="Golfclub in het zand"
            />
          </div>

          <PampasMark className="absolute -right-4 top-4 w-12 h-40 text-sage/60" sway />
        </motion.div>
      </div>
    </section>
  );
}

function LatestEpisodeSection() {
  return (
    <section className="px-6 lg:px-12 py-24 lg:py-32 bg-sand/30 border-y border-charcoal/5">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-sage" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-sage font-medium">
              Nu beluisteren
            </span>
          </div>
          <h2 className="font-serif text-5xl lg:text-7xl leading-[0.95] tracking-tight text-charcoal mb-6">
            {latestEpisode.title}
          </h2>
          <p className="text-charcoal/75 text-lg leading-relaxed mb-8 max-w-prose">
            {latestEpisode.description}
          </p>
          <div className="flex flex-wrap gap-3 mb-10">
            {latestEpisode.topics.map((t) => (
              <span
                key={t}
                className="text-[11px] uppercase tracking-[0.18em] px-3 py-1.5 rounded-full border border-charcoal/15 text-charcoal/70"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-6 text-sm text-charcoal/60">
            <span>{latestEpisode.date}</span>
            <span className="size-1 rounded-full bg-charcoal/30" />
            <span>{latestEpisode.duration}</span>
          </div>
        </div>

        <div className="lg:col-span-7">
          <SpotifyEmbed uri={latestEpisode.spotifyId} type="episode" height={232} />
          <p className="text-xs text-charcoal/50 mt-4 text-center">
            Of luister op{" "}
            <a className="underline underline-offset-4 hover:text-charcoal" href="https://podcasts.apple.com" target="_blank" rel="noreferrer">
              Apple Podcasts
            </a>
            ,{" "}
            <a className="underline underline-offset-4 hover:text-charcoal" href="https://youtube.com" target="_blank" rel="noreferrer">
              YouTube
            </a>{" "}
            of via je favoriete podcast-app.
          </p>
        </div>
      </div>
    </section>
  );
}

function HostsTeaser() {
  return (
    <section className="px-6 lg:px-12 py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-sage font-medium mb-4">
              De drie stemmen
            </p>
            <h2 className="font-serif text-5xl lg:text-7xl leading-[0.95] tracking-tight text-charcoal max-w-2xl">
              Drie vrienden, drie handicaps, één <em className="font-serif italic text-sage">liefde</em>.
            </h2>
          </div>
          <Link
            to="/hosts"
            className="text-sm uppercase tracking-[0.2em] text-charcoal/70 hover:text-charcoal border-b border-charcoal/20 hover:border-charcoal pb-1 transition-colors"
          >
            Leer ze kennen →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {hosts.map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[3/4] bg-dune overflow-hidden mb-5">
                <img
                  src={h.image}
                  loading="lazy"
                  width={800}
                  height={1024}
                  alt={`Portret van ${h.name}`}
                  className="w-full h-full object-cover sepia-[0.15] group-hover:sepia-0 group-hover:scale-[1.03] transition-all duration-700"
                />
                <div className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.25em] text-mist bg-charcoal/70 backdrop-blur px-2 py-1">
                  0{i + 1} / {h.role}
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <h3 className="font-serif text-3xl text-charcoal">{h.name}</h3>
                <span className="text-xs uppercase tracking-[0.2em] text-charcoal/50">
                  HCP {h.handicap}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RecentEpisodes() {
  return (
    <section className="px-6 lg:px-12 py-24 lg:py-32 bg-sand/40 border-t border-charcoal/5">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-sage font-medium mb-4">
              Recente afleveringen
            </p>
            <h2 className="font-serif text-5xl lg:text-6xl leading-[0.95] tracking-tight text-charcoal">
              Het archief, vers gemaaid.
            </h2>
          </div>
          <Link
            to="/afleveringen"
            className="text-sm uppercase tracking-[0.2em] text-charcoal/70 hover:text-charcoal border-b border-charcoal/20 hover:border-charcoal pb-1 transition-colors"
          >
            Alle afleveringen →
          </Link>
        </div>

        <ul className="divide-y divide-charcoal/10 border-y border-charcoal/10">
          {episodes.slice(0, 5).map((ep) => (
            <li
              key={ep.number}
              className="grid grid-cols-12 gap-4 py-7 items-center group hover:bg-white/40 transition-colors px-2 -mx-2 rounded-lg cursor-default"
            >
              <span className="col-span-2 sm:col-span-1 font-serif italic text-sage text-xl">
                {ep.season}·{ep.number}
              </span>
              <div className="col-span-10 sm:col-span-7">
                <h3 className="font-serif text-2xl lg:text-3xl text-charcoal group-hover:text-sage transition-colors">
                  {ep.title}
                </h3>
                <p className="text-sm text-charcoal/60 mt-1 line-clamp-1">{ep.description}</p>
              </div>
              <span className="hidden sm:block sm:col-span-2 text-xs uppercase tracking-[0.18em] text-charcoal/50">
                {ep.date}
              </span>
              <span className="hidden sm:block sm:col-span-2 text-right text-xs uppercase tracking-[0.18em] text-charcoal/50">
                {ep.duration}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="px-6 lg:px-12 py-24 lg:py-32 relative overflow-hidden">
      <PampasMark
        className="absolute -bottom-8 left-8 lg:left-24 w-20 h-64 text-sage/40"
        sway
      />
      <PampasMark
        className="absolute -bottom-8 right-8 lg:right-24 w-16 h-56 text-sage/30 scale-x-[-1]"
        sway
      />

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <p className="text-[11px] uppercase tracking-[0.25em] text-sage font-medium mb-6">
          De nieuwsbrief
        </p>
        <h2 className="font-serif text-5xl lg:text-6xl leading-[0.95] tracking-tight text-charcoal mb-6">
          Eerst horen wanneer er een nieuwe aflevering valt.
        </h2>
        <p className="text-charcoal/70 text-lg mb-10">
          Geen spam. Alleen een e-mail per nieuwe aflevering, en af en toe een verhaal dat niet de
          microfoon haalde.
        </p>

        <form
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Bedankt! We houden je op de hoogte.");
          }}
        >
          <input
            type="email"
            required
            placeholder="je@email.be"
            className="flex-1 rounded-full px-5 py-3 bg-white border border-charcoal/15 focus:border-sage focus:ring-2 focus:ring-sage/30 outline-none text-charcoal placeholder:text-charcoal/40"
          />
          <button
            type="submit"
            className="rounded-full px-6 py-3 bg-charcoal text-mist text-sm uppercase tracking-[0.18em] hover:bg-sage transition-colors"
          >
            Inschrijven
          </button>
        </form>
      </div>
    </section>
  );
}
