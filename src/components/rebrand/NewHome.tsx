import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { episodes as staticEpisodes, latestEpisode as staticLatestEpisode, mergeEpisodes, type Episode } from "@/data/episodes";
import { hosts } from "@/data/hosts";
import hostsWalking from "@/assets/hosts-walking.webp";
import { SpotifyEmbed } from "@/components/SpotifyEmbed";
import { subscribeToBrevo } from "@/lib/brevo.functions";
import { supabase } from "@/integrations/supabase/client";
import { PampasScoreBadge } from "@/components/ratings/PampasScoreBadge";
import { useCombinedScore } from "@/lib/useCourseVotes";
import { buildSlugMap, slugifyName } from "@/lib/courseSlug";



const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CAPTURED_KEY = "emailCaptured";

const TOP_COURSE_NAMES = [
  "Royal Ternesse Golf Club",
  "Royal Antwerp Golf Club",
  "Royal Ostend Golf Club",
];

type TopRating = { host_score: number; host?: string | null; one_word?: string | null; review?: string | null };

type TopCourse = {
  id: string;
  name: string;
  country: string;
  region: string | null;
  slug: string;
  pampasScore: number | null;
  ratings: TopRating[];
  quote: string | null;
  quoteHost: string | null;
  oneWord: string | null;
};

/** Rebranded homepage — bordered editorial grid (cream/green/lime). */
export function NewHome() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [dbEpisodes, setDbEpisodes] = useState<Episode[]>([]);
  const [topCourses, setTopCourses] = useState<TopCourse[]>([]);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const getScore = useCombinedScore();

  useEffect(() => {
    if (paused || topCourses.length < 2) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % topCourses.length), 6000);
    return () => clearInterval(id);
  }, [paused, topCourses.length]);


  const subscribe = useServerFn(subscribeToBrevo);

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

  useEffect(() => {
    Promise.all([
      supabase
        .from("courses")
        .select("id,name,country,region,ratings(host_score,host,one_word,review)")
        .in("name", TOP_COURSE_NAMES),
      supabase.from("courses").select("id,name"),
    ]).then(([{ data: topData }, { data: allCourses }]) => {
      if (!topData || !allCourses) return;
      const slugMap = buildSlugMap(allCourses);
      const mapped = TOP_COURSE_NAMES.map((name) => {
        const c = (topData as any[]).find((x) => x.name === name);
        if (!c) return null;
        const ratings = ((c.ratings ?? []) as TopRating[]).filter((r) => r.host_score != null);
        const withQuote = ratings.find((r) => r.review && r.review.trim().length > 0);
        const withWord = ratings.find((r) => r.one_word && r.one_word.trim().length > 0);
        const hostScores = ratings.map((r) => Number(r.host_score)).filter((n) => Number.isFinite(n));
        const pampasScore = hostScores.length
          ? Math.round((hostScores.reduce((s, v) => s + v, 0) / hostScores.length) * 10) / 10
          : null;
        return {
          id: c.id,
          name: c.name,
          country: c.country,
          region: c.region,
          slug: slugMap.get(c.id) ?? slugifyName(c.name),
          pampasScore,
          ratings,
          quote: withQuote?.review?.trim() ?? null,
          quoteHost: withQuote?.host ?? null,
          oneWord: withWord?.one_word?.trim() ?? null,
        };
      }).filter(Boolean) as TopCourse[];
      setTopCourses(mapped);
    });
  }, []);

  const siteEpisodes = useMemo(() => mergeEpisodes(dbEpisodes, staticEpisodes), [dbEpisodes]);

  const latestEpisode = siteEpisodes[0] ?? staticLatestEpisode;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setError(null);

    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed) || trimmed.length > 255) {
      setError("Vul een geldig e-mailadres in.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      await subscribe({ data: { email: trimmed, source: "home-newsletter" } });
      if (typeof window !== "undefined") {
        localStorage.setItem(CAPTURED_KEY, "true");
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Oeps, iets ging mis. Probeer het opnieuw.");
    }
  };

  return (
    <>
      {/* HERO */}
      <section className="grid grid-cols-1 lg:grid-cols-2 border-b border-[rgba(28,61,42,0.15)] min-h-[calc(100vh-92px)]">
        <div className="px-8 lg:px-16 py-16 lg:py-20 flex flex-col justify-center border-r border-[rgba(28,61,42,0.15)]">
          <p className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#635C4B] mb-8 flex items-center gap-4 before:content-[''] before:block before:w-8 before:h-px before:bg-[#8FBF4A]">
            Vol. I — MMXXVI · Belgische golfpassie
          </p>
          <h1 className="font-rb-serif font-light text-[clamp(3rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.02em] text-[#1C3D2A] mb-8">
            Achttien holes, <em className="italic">één</em> microfoon, <em className="italic">drie</em> vrienden.
          </h1>
          <p className="font-rb-sans text-base text-[#635C4B] max-w-md leading-[1.75] mb-12">
            PAMPAS is dé Belgische golfcommunity. Wekelijks praten Lars, Levi en Niels over alles wat
            de fairway én de rough te bieden heeft. Voor golfers, door golfers.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <Link
              to="/afleveringen"
              className="font-rb-mono text-[0.62rem] tracking-[0.14em] uppercase text-[#F4EFE5] bg-[#1C3D2A] no-underline px-8 py-[0.9rem] hover:bg-[#2B5C3E] transition-colors"
            >
              Alle afleveringen
            </Link>
            <Link
              to="/hosts"
              className="font-rb-mono text-[0.62rem] tracking-[0.14em] uppercase text-[#1C3D2A] no-underline px-8 py-[0.9rem] border border-[rgba(28,61,42,0.3)] hover:border-[#1C3D2A] hover:bg-[#EDE6D9] transition-all"
            >
              Maak kennis
            </Link>
          </div>
        </div>

        <div className="bg-[#1C3D2A] relative overflow-hidden flex flex-col justify-end p-8 lg:p-12">
          <div
            aria-hidden
            className="font-rb-serif font-bold pointer-events-none select-none absolute -top-[0.15em] -left-[0.05em] leading-none whitespace-nowrap"
            style={{ fontSize: "22vw", color: "rgba(255,255,255,0.04)" }}
          >
            PAMPAS
          </div>
          <img
            src={hostsWalking}
            alt="Drie vrienden lopen over een Belgische links-baan"
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity"
          />
          <div className="relative z-10">
            <p className="font-rb-mono text-[0.58rem] tracking-[0.18em] uppercase text-[rgba(244,239,229,0.4)] mb-6">
              Nieuwste aflevering
            </p>
            <p className="font-rb-mono text-[0.6rem] tracking-[0.14em] uppercase text-[#8FBF4A] mb-2">
              {latestEpisode.season} · E{latestEpisode.number?.toLowerCase().includes("special") || latestEpisode.number === "18" ? "special" : latestEpisode.number}
            </p>
            <h2 className="font-rb-serif text-[2rem] font-normal text-[#F4EFE5] leading-[1.2] mb-4">
              {latestEpisode.title}
            </h2>
            <p className="font-rb-sans text-sm text-[rgba(244,239,229,0.65)] leading-[1.7] max-w-md mb-6 line-clamp-3">
              {latestEpisode.description}
            </p>
            <div className="flex gap-6 items-center mb-6 font-rb-mono text-[0.6rem] tracking-[0.1em] text-[rgba(244,239,229,0.5)]">
              <span>{latestEpisode.date}</span>
              <span>{latestEpisode.duration}</span>
            </div>
            <a
              href={`https://open.spotify.com/episode/${latestEpisode.spotifyId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-block font-rb-mono text-[0.62rem] tracking-[0.14em] uppercase text-[#1C3D2A] bg-[#8FBF4A] no-underline px-8 py-[0.9rem] hover:bg-[#a0d45a] transition-colors"
            >
              ▶ Beluister nu
            </a>
          </div>
        </div>
      </section>

      {/* STAT STRIP */}
      <section className="grid grid-cols-1 md:grid-cols-3 border-b border-[rgba(28,61,42,0.15)]">
        {[
          { num: siteEpisodes.length.toString().padStart(2, "0"), label: "Afleveringen", text: "Gepubliceerd sinds april 2026 — elke dinsdag een nieuwe." },
          { num: "03", label: "Hosts", text: "Lars, Levi en Niels — drie handicaps, één liefde." },
          { num: "∞", label: "Verhalen", text: "Van Ternesse tot Augusta. Geen onderwerp te scherp." },
        ].map((b, i) => (
          <div
            key={i}
            className={`px-10 py-12 ${i < 2 ? "border-r border-[rgba(28,61,42,0.15)]" : ""}`}
          >
            <p className="font-rb-mono text-[0.58rem] tracking-[0.18em] uppercase text-[#635C4B] mb-4">
              {b.label}
            </p>
            <p className="font-rb-serif font-light text-5xl text-[#1C3D2A] leading-none mb-2">
              {b.num}
            </p>
            <p className="font-rb-sans text-sm text-[#635C4B] leading-[1.65]">{b.text}</p>
          </div>
        ))}
      </section>

      {/* TOPKLASSE */}
      <section className="px-6 lg:px-14 py-16 border-b border-[rgba(28,61,42,0.15)] bg-[#F4EFE5]">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-10">
            <p className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#8FBF4A] mb-3">
              Beoordeeld door onze hosts — jij stemt mee
            </p>
            <h2 className="font-rb-serif font-light text-4xl md:text-5xl text-[#1C3D2A] leading-[1]">
              Topklasse
            </h2>
          </div>

          {topCourses.length > 0 && (
            <div
              className="relative"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div className="overflow-hidden border border-[rgba(28,61,42,0.15)] bg-white/[0.35]">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${(slide % topCourses.length) * 100}%)` }}
                >
                  {topCourses.map((course) => {
                    const score = getScore(course);
                    return (
                      <article
                        key={course.id}
                        className="w-full shrink-0 p-6 md:p-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-10"
                      >
                        <div className="shrink-0">
                          <PampasScoreBadge score={score} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-rb-serif text-2xl md:text-3xl text-[#1C3D2A] leading-[1.15] mb-2">
                            {course.name}
                          </h3>
                          <p className="font-rb-sans text-sm text-[#635C4B] leading-[1.6] mb-4">
                            {[course.region, course.country].filter(Boolean).join(", ")}
                          </p>
                          {course.quote ? (
                            <blockquote className="font-rb-serif italic text-base md:text-lg text-[#1C3D2A] leading-[1.6] max-w-2xl">
                              “{course.quote}”
                              {course.quoteHost && (
                                <footer className="font-rb-mono not-italic text-[0.55rem] tracking-[0.14em] uppercase text-[#635C4B] mt-2">
                                  — {course.quoteHost}
                                </footer>
                              )}
                            </blockquote>
                          ) : course.oneWord ? (
                            <p className="font-rb-mono text-[0.6rem] tracking-[0.14em] uppercase text-[#1C3D2A] border border-[rgba(28,61,42,0.3)] inline-block px-3 py-1.5">
                              In één woord: {course.oneWord}
                            </p>
                          ) : null}
                        </div>
                        <div className="shrink-0">
                          <Link
                            to="/ratings"
                            search={{ q: course.name } as never}
                            className="inline-block font-rb-mono text-[0.62rem] tracking-[0.14em] uppercase text-[#1C3D2A] bg-[#8FBF4A] no-underline px-7 py-[0.9rem] hover:bg-[#a0d45a] transition-colors"
                          >
                            Stem op deze baan →
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between mt-5">
                <div className="flex gap-2">
                  {topCourses.map((c, i) => (
                    <button
                      key={c.id}
                      type="button"
                      aria-label={`Toon ${c.name}`}
                      aria-current={i === slide}
                      onClick={() => setSlide(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === slide ? "w-6 bg-[#1C3D2A]" : "w-2 bg-[rgba(28,61,42,0.25)]"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    aria-label="Vorige baan"
                    onClick={() =>
                      setSlide((s) => (s - 1 + topCourses.length) % topCourses.length)
                    }
                    className="w-9 h-9 border border-[rgba(28,61,42,0.3)] text-[#1C3D2A] hover:bg-[#EDE6D9] transition-colors"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label="Volgende baan"
                    onClick={() => setSlide((s) => (s + 1) % topCourses.length)}
                    className="w-9 h-9 border border-[rgba(28,61,42,0.3)] text-[#1C3D2A] hover:bg-[#EDE6D9] transition-colors"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8">
            <Link
              to="/ratings"
              className="font-rb-mono text-[0.62rem] tracking-[0.14em] uppercase text-[#1C3D2A] no-underline border-b border-[#8FBF4A] pb-1 hover:text-[#8FBF4A]"
            >
              Alle golfbanen bekijken →
            </Link>
          </div>
        </div>
      </section>

      {/* SPOTIFY PLAYER */}

      <section className="px-6 lg:px-14 py-16 border-b border-[rgba(28,61,42,0.15)] bg-[#EDE6D9]">
        <div className="grid lg:grid-cols-12 gap-10 items-center max-w-[1400px] mx-auto">
          <div className="lg:col-span-5">
            <p className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#8FBF4A] mb-4">
              Nu beluisteren
            </p>
            <h2 className="font-rb-serif font-light text-5xl text-[#1C3D2A] leading-[1] mb-6">
              {latestEpisode.title}
            </h2>
            <p className="font-rb-sans text-[#635C4B] leading-[1.75] mb-6">
              {latestEpisode.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {latestEpisode.topics.map((t) => (
                <span
                  key={t}
                  className="font-rb-mono text-[0.55rem] tracking-[0.12em] uppercase border border-[rgba(28,61,42,0.3)] text-[#635C4B] px-2.5 py-1"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7">
            <SpotifyEmbed uri={latestEpisode.spotifyId} type="episode" height={232} />
          </div>
        </div>
      </section>

      {/* HOSTS PREVIEW */}
      <section className="grid grid-cols-1 lg:grid-cols-3 border-b border-[rgba(28,61,42,0.15)]">
        <div className="px-10 py-14 border-r border-[rgba(28,61,42,0.15)] flex flex-col justify-center lg:col-span-1">
          <h2 className="font-rb-serif font-light text-4xl text-[#1C3D2A] leading-[1.2] mb-4">
            De stemmen achter <em className="italic">PAMPAS</em>.
          </h2>
          <p className="font-rb-sans text-sm text-[#635C4B] leading-[1.7] mb-6">
            Drie vrienden met elk hun eigen kijk op het spel. Van diplomaat tot professor tot
            romanticus.
          </p>
          <Link
            to="/hosts"
            className="font-rb-mono text-[0.62rem] tracking-[0.14em] uppercase text-[#1C3D2A] no-underline border-b border-[#8FBF4A] pb-1 self-start hover:text-[#8FBF4A]"
          >
            Leer ze kennen →
          </Link>
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3">
          {hosts.map((h, i) => (
            <Link
              key={h.id}
              to="/hosts"
              className={`group block px-8 py-12 transition-colors hover:bg-[#EDE6D9] ${
                i < 2 ? "border-r border-[rgba(28,61,42,0.15)]" : ""
              } border-t lg:border-t-0 border-[rgba(28,61,42,0.15)]`}
            >
              <p className="font-rb-mono text-[0.55rem] tracking-[0.15em] uppercase text-[#635C4B] mb-3">
                0{i + 1} / Host
              </p>
              <div className="aspect-square overflow-hidden mb-4 bg-[#E2D9C8]">
                <img
                  src={h.image}
                  alt={`Portret van ${h.name}`}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <p className="font-rb-mono text-[0.55rem] tracking-[0.12em] uppercase text-[#8FBF4A] mb-1">
                {h.role}
              </p>
              <h3 className="font-rb-serif font-semibold text-xl text-[#1C3D2A]">{h.name}</h3>
              <p className="font-rb-mono text-[0.6rem] tracking-[0.1em] text-[#635C4B] mt-1">
                HCP {h.handicap}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-[#1C3D2A] px-6 lg:px-14 py-14 flex flex-col lg:flex-row gap-10 items-center">
        <div className="lg:flex-1">
          <h3 className="font-rb-serif font-light text-3xl text-[#F4EFE5] mb-2">
            Wil je op de hoogte gebracht worden bij een nieuwe aflevering?
          </h3>
          <p className="font-rb-sans text-sm text-[rgba(244,239,229,0.55)] max-w-md">
            Geen spam. Alleen een mail per nieuwe aflevering.
          </p>
        </div>
        {status === "success" ? (
          <p className="font-rb-serif italic text-[#8FBF4A] text-lg">
            Bedankt! Je hoort het als eerste.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex w-full lg:w-auto lg:min-w-[440px]"
          >
            <label htmlFor="home-email" className="sr-only">
              E-mailadres
            </label>
            <input
              id="home-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") {
                  setStatus("idle");
                  setError(null);
                }
              }}
              placeholder="je@email.be"
              maxLength={255}
              className="flex-1 px-5 py-3 bg-white/[0.08] border border-[rgba(244,239,229,0.2)] border-r-0 text-[#F4EFE5] font-rb-sans text-sm outline-none placeholder:text-[rgba(244,239,229,0.6)] focus:border-[#8FBF4A] transition-colors"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="font-rb-mono text-[0.6rem] tracking-[0.14em] uppercase bg-[#8FBF4A] text-[#1C3D2A] px-6 hover:bg-[#a0d45a] transition-colors font-medium disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {status === "loading" ? "Bezig…" : "Inschrijven"}
            </button>
          </form>
        )}
        {status === "error" && error && (
          <p className="font-rb-sans text-[0.8rem] text-[#E89B8B] lg:w-auto w-full lg:text-left text-center">
            {error}
          </p>
        )}
      </section>
    </>
  );
}
