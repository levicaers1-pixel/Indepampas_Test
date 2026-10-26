import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SpotifyEmbed } from "@/components/SpotifyEmbed";
import { fetchEpisodes } from "@/data/episodes-db";
import { buildEpisodeSlugs, episodeIsoDate, isoDuration } from "@/lib/episodeSlug";
import { formatDescription } from "@/lib/formatDescription";
import { SITE_URL } from "@/lib/site";

type EpisodeLink = { title: string; slug: string };

const isNumbered = (number: string) => /^\d+$/.test(number) && number !== "18";

export const Route = createFileRoute("/afleveringen/$slug")({
  loader: async ({ params }) => {
    const all = await fetchEpisodes();
    const slugs = buildEpisodeSlugs(all);
    const i = all.findIndex((e) => slugs.get(e.spotifyId) === params.slug);
    if (i < 0) throw notFound();
    const link = (e: (typeof all)[number]): EpisodeLink => ({ title: e.title, slug: slugs.get(e.spotifyId)! });
    return {
      episode: all[i],
      slug: params.slug,
      // list is newest first
      newer: i > 0 ? link(all[i - 1]) : null,
      older: i < all.length - 1 ? link(all[i + 1]) : null,
    };
  },
  head: ({ loaderData }) => {
    const ep = loaderData?.episode;
    if (!ep) return { meta: [{ title: "Aflevering niet gevonden — PAMPAS" }] };
    const url = `${SITE_URL}/afleveringen/${loaderData.slug}`;
    const title = `${ep.title} — PAMPAS Podcast`;
    const text = formatDescription(ep.description).replace(/\s+/g, " ");
    const description = text.length > 160 ? `${text.slice(0, 157).replace(/\s+\S*$/, "")}…` : text;
    const published = episodeIsoDate(ep);
    const duration = isoDuration(ep.duration);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        ...(published ? [{ property: "article:published_time", content: published }] : []),
        ...(ep.imageUrl
          ? [
              { property: "og:image", content: ep.imageUrl },
              { name: "twitter:image", content: ep.imageUrl },
            ]
          : []),
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "PodcastEpisode",
            name: ep.title,
            url,
            description: text,
            inLanguage: "nl-BE",
            ...(published && { datePublished: published }),
            ...(duration && { timeRequired: duration }),
            ...(isNumbered(ep.number) && { episodeNumber: Number(ep.number) }),
            ...(ep.imageUrl && { image: ep.imageUrl }),
            ...(ep.topics.length > 0 && { keywords: ep.topics.join(", ") }),
            sameAs: `https://open.spotify.com/episode/${ep.spotifyId}`,
            partOfSeries: { "@type": "PodcastSeries", name: "PAMPAS", url: `${SITE_URL}/afleveringen` },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <section className="px-6 lg:px-14 py-24">
      <p className="font-rb-mono text-[0.7rem] tracking-[0.2em] uppercase text-[#635C4B] mb-4">404</p>
      <h1 className="font-rb-serif font-light text-4xl text-[#1C3D2A] mb-6">Deze aflevering bestaat niet.</h1>
      <Link to="/afleveringen" className="text-[#1C3D2A] border-b border-[#8FBF4A] no-underline">
        Naar alle afleveringen →
      </Link>
    </section>
  ),
  component: EpisodePage,
});

function EpisodePage() {
  const { episode: ep, newer, older } = Route.useLoaderData();
  const published = episodeIsoDate(ep);
  const paragraphs = formatDescription(ep.description).split(/\n{1,}/).filter(Boolean);

  return (
    <article className="px-6 lg:px-14 pt-10 pb-16">
      <nav
        aria-label="Broodkruimels"
        className="font-rb-mono text-[0.7rem] tracking-[0.18em] uppercase text-[#635C4B] flex flex-wrap gap-2 mb-10"
      >
        <Link to="/" className="hover:text-[#1C3D2A]">Home</Link>
        <span>/</span>
        <Link to="/afleveringen" className="hover:text-[#1C3D2A]">Afleveringen</Link>
        <span>/</span>
        <span className="text-[#1C3D2A]">{isNumbered(ep.number) ? `Aflevering ${ep.number}` : ep.number}</span>
      </nav>

      <header className="max-w-3xl border-b border-[rgba(28,61,42,0.15)] pb-10">
        <p className="font-rb-mono text-[0.7rem] tracking-[0.2em] uppercase text-[#635C4B] mb-4">
          {ep.season} · {isNumbered(ep.number) ? `Aflevering ${ep.number}` : ep.number} ·{" "}
          {published ? <time dateTime={published}>{ep.date}</time> : ep.date} · {ep.duration}
        </p>
        <h1 className="font-rb-serif font-light text-[clamp(2rem,4vw,3.2rem)] text-[#1C3D2A] leading-[1.15]">{ep.title}</h1>
        {ep.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-6">
            {ep.topics.map((t) => (
              <span
                key={t}
                className="font-rb-mono text-[0.7rem] tracking-[0.12em] uppercase border border-[rgba(28,61,42,0.3)] text-[#635C4B] px-2 py-0.5"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="max-w-3xl py-10">
        <SpotifyEmbed uri={ep.spotifyId} type="episode" title={ep.title} />
        <div className="mt-10 space-y-5">
          {paragraphs.map((p, i) => (
            <p key={i} className="font-rb-sans text-[1rem] text-[#2E2B25] leading-[1.8]">
              {p}
            </p>
          ))}
        </div>
        <p className="mt-8">
          <a
            href={`https://open.spotify.com/episode/${ep.spotifyId}`}
            target="_blank"
            rel="noreferrer"
            className="font-rb-mono text-[0.7rem] tracking-[0.14em] uppercase text-[#1C3D2A] no-underline border-b border-[#8FBF4A] pb-1 hover:text-[#46701D]"
          >
            Beluister op Spotify →
          </a>
        </p>
      </div>

      <div className="max-w-3xl border-t border-[rgba(28,61,42,0.15)] pt-6 flex flex-wrap items-start justify-between gap-6">
        {older ? (
          <Link to="/afleveringen/$slug" params={{ slug: older.slug }} className="block max-w-[45%] no-underline group">
            <span className="font-rb-mono text-[0.7rem] tracking-[0.16em] uppercase text-[#635C4B] block mb-1">← Vorige aflevering</span>
            <span className="font-rb-serif text-[1.1rem] text-[#1C3D2A] leading-snug group-hover:text-[#46701D]">{older.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {newer && (
          <Link to="/afleveringen/$slug" params={{ slug: newer.slug }} className="block max-w-[45%] text-right no-underline group ml-auto">
            <span className="font-rb-mono text-[0.7rem] tracking-[0.16em] uppercase text-[#635C4B] block mb-1">Volgende aflevering →</span>
            <span className="font-rb-serif text-[1.1rem] text-[#1C3D2A] leading-snug group-hover:text-[#46701D]">{newer.title}</span>
          </Link>
        )}
      </div>

      <p className="max-w-3xl mt-10">
        <Link
          to="/afleveringen"
          className="font-rb-mono text-[0.7rem] tracking-[0.18em] uppercase text-[#3D7A52] hover:text-[#1C3D2A]"
        >
          ← Alle afleveringen
        </Link>
      </p>
    </article>
  );
}
