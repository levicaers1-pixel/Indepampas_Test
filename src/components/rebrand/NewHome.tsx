import { useState } from "react";
import { Link, useLoaderData } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { latestEpisode as staticLatestEpisode, type Episode } from "@/data/episodes";
import { hosts } from "@/data/hosts";
import heroPhoto from "@/assets/hero-belgian-course.webp";
import detailPhoto from "@/assets/golf-detail.webp";
import { SpotifyEmbed } from "@/components/SpotifyEmbed";
import { subscribeToBrevo } from "@/lib/brevo.functions";
import { useCombinedScore } from "@/lib/useCourseVotes";
import { formatDescription } from "@/lib/formatDescription";
import { buildEpisodeSlugs } from "@/lib/episodeSlug";
import { ExpandableText } from "@/components/rebrand/ExpandableText";
import { Marquee } from "@/components/rebrand/Marquee";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CAPTURED_KEY = "emailCaptured";

const HOST_COLOR: Record<string, string> = {
  lars: "var(--rb-lars)",
  levi: "var(--rb-levi)",
  niels: "var(--rb-niels)",
};

/** "15" for numbered episodes, a short word for specials. */
function episodeLabel(ep: Pick<Episode, "number">) {
  const n = ep.number ?? "";
  return n.toLowerCase().includes("special") || n === "18" ? "special" : n;
}

function fmtScore(n: number) {
  return Number.isInteger(n) ? n.toFixed(0) : n.toFixed(1);
}

/** Static waveform: one bar per value; the CSS animates it (and stops for reduced motion). */
const WAVE = [5, 14, 8, 20, 11, 26, 16, 30, 12, 22, 9, 28, 18, 24, 7, 19, 29, 13, 21, 10, 25, 15, 27, 8, 17, 23, 11, 30, 14, 20];

function Waveform({ className = "" }: { className?: string }) {
  return (
    <svg className={`rb-wave ${className}`} viewBox="0 0 240 34" width="240" height="34" aria-hidden="true">
      <g fill="var(--rb-lime)" opacity="0.9">
        {WAVE.map((h, i) => (
          <rect key={i} x={i * 8 + 1} y={17 - h / 2} width="4" height={h} rx="1" />
        ))}
      </g>
    </svg>
  );
}

function SectionHead({ index, label }: { index: string; label: string }) {
  return (
    <div className="rb-idx">
      <span className="rb-mono text-[var(--rb-lime)]">{index}</span>
      <i />
      <span className="rb-mono text-[var(--rb-muted)]">{label}</span>
    </div>
  );
}

/** Home — dark and sporty. */
export function NewHome() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  // Episodes and the featured courses are loaded on the server (route loader), so the
  // server-rendered HTML already contains the newest episodes and links to the top courses.
  const { episodes: siteEpisodes, topCourses, courseCount } = useLoaderData({ from: "/" });
  const getScore = useCombinedScore();
  const subscribe = useServerFn(subscribeToBrevo);

  const latestEpisode = siteEpisodes[0] ?? staticLatestEpisode;
  const slugs = buildEpisodeSlugs(siteEpisodes);
  const latestSlug = siteEpisodes[0] ? slugs.get(siteEpisodes[0].spotifyId) : undefined;
  const nextTwo = siteEpisodes.slice(1, 3);

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

  const stats = [
    { num: siteEpisodes.length.toString().padStart(2, "0"), label: "Afleveringen" },
    { num: "03", label: "Hosts" },
    courseCount
      ? { num: String(courseCount), label: "Golfbanen" }
      : { num: "∞", label: "Verhalen" },
    { num: "DI", label: "Elke dinsdag nieuw" },
  ];

  return (
    <>
      {/* HERO — photo, outline + glow headline, newest episode */}
      <section className="rb-noise relative -mt-[64px] flex min-h-[min(100svh,56rem)] flex-col overflow-hidden">
        <img
          src={heroPhoto}
          alt=""
          aria-hidden="true"
          width={1920}
          height={1047}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[50%_55%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,26,18,0.55)_0%,rgba(12,26,18,0.15)_35%,rgba(12,26,18,0.92)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,26,18,0.62)_0%,rgba(12,26,18,0.3)_40%,transparent_65%)]"
        />
        <div
          aria-hidden="true"
          className="rb-blob rb-drift -left-40 -bottom-48 h-[760px] w-[760px] bg-[radial-gradient(circle,rgba(182,240,74,0.38)_0%,rgba(182,240,74,0)_65%)]"
        />
        <div
          aria-hidden="true"
          className="rb-blob rb-drift -right-32 -top-24 h-[620px] w-[620px] bg-[radial-gradient(circle,rgba(74,158,219,0.28)_0%,rgba(74,158,219,0)_65%)] [animation-direction:reverse] [animation-duration:18s]"
        />
        <div
          aria-hidden="true"
          className="rb-grid absolute inset-0 opacity-80 [mask-image:linear-gradient(180deg,transparent,#000_35%,transparent_85%)]"
        />

        <p className="rb-mono absolute bottom-4 right-6 z-[3] m-0 text-[0.6rem] text-[var(--rb-ink-2)] lg:right-14">
          Foto: La Marache · Royal Waterloo Golf Club
        </p>

        <div className="relative z-[3] mt-auto mx-auto flex w-full max-w-[1320px] flex-wrap items-end justify-between gap-10 px-6 pb-14 pt-[120px] lg:px-14 lg:pb-[72px]">
          <div className="min-w-0 flex-1 basis-[480px]">
            <p className="rb-mono mb-5 text-[var(--rb-lime)]">Belgische golfpodcast · Elke dinsdag</p>
            <h1 className="rb-disp rb-rise text-[clamp(3.4rem,10vw,9rem)] leading-[0.88]">
              <span className="rb-outline">Made</span>
              <br />
              <span className="rb-outline">on the</span>
              <br />
              <span className="rb-glow text-[var(--rb-lime)]">back</span>
              <br />
              <span className="rb-glow text-[var(--rb-lime)]">nine.</span>
            </h1>
            <p className="mt-7 max-w-[34rem] text-[1.05rem] leading-[1.6] text-[var(--rb-ink-2)] sm:text-lg">
              Drie vrienden, één microfoon. Lars, Levi en Niels over alles wat de fairway én de
              rough te bieden heeft. Voor golfers, door golfers.
            </p>
            <div className="mt-9 flex flex-wrap gap-3.5">
              <a
                href="https://open.spotify.com/show/37wE4nKPeQNjYLYoMFelLP"
                target="_blank"
                rel="noreferrer"
                className="rb-btn rb-btn-lime"
              >
                Beluister op Spotify
              </a>
              <Link to="/afleveringen" className="rb-btn rb-btn-line">
                Alle afleveringen
              </Link>
            </div>
          </div>

          {latestSlug ? (
            <Link
              to="/afleveringen/$slug"
              params={{ slug: latestSlug }}
              className="rb-rise group flex w-full max-w-[380px] items-center gap-4 border border-[rgba(242,239,230,0.25)] bg-[rgba(12,26,18,0.78)] p-5 no-underline backdrop-blur-md transition-transform hover:-translate-y-1 [animation-delay:0.3s] sm:p-6 lg:basis-[380px]"
            >
              <span
                aria-hidden="true"
                className="rb-pulse flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--rb-lime)] sm:h-16 sm:w-16"
              >
                <svg width="22" height="22" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M5 3l12 7-12 7z" fill="var(--rb-ground)" />
                </svg>
              </span>
              <span className="min-w-0">
                <span className="rb-mono mb-2 block text-[var(--rb-lime)]">
                  Nu uit · #{episodeLabel(latestEpisode)}
                </span>
                <span className="font-rb-serif block text-[1.05rem] font-bold leading-[1.2] text-[var(--rb-ink)] sm:text-[1.2rem]">
                  {latestEpisode.title}
                </span>
              </span>
            </Link>
          ) : null}
        </div>
      </section>

      <Marquee />

      {/* STATS BAND */}
      <section aria-label="PAMPAS in cijfers" className="bg-[var(--rb-lime)] text-[var(--rb-ground)]">
        <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-2.5 px-4 py-3.5 sm:px-6 md:grid-cols-4 lg:px-14 lg:py-5 lg:gap-4">
          {stats.map((b) => (
            <div key={b.label} className="rb-tile flex flex-col justify-center px-4 py-3.5 sm:flex-row sm:items-baseline sm:gap-4 sm:px-6 sm:py-5">
              <span className="rb-disp rb-num text-[2.1rem] text-[var(--rb-lime)] sm:text-[3.1rem]">{b.num}</span>
              <span className="rb-mono mt-1.5 text-[0.62rem] text-[var(--rb-ink-2)] sm:mt-0 sm:text-[0.7rem]">{b.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* AFLEVERINGEN */}
      <section className="rb-cv relative mx-auto max-w-[1320px] px-6 pb-6 pt-20 lg:px-14 lg:pt-28">
        <p
          aria-hidden="true"
          className="rb-disp pointer-events-none absolute right-6 top-14 hidden select-none whitespace-nowrap text-[clamp(5rem,9vw,8.5rem)] text-transparent lg:block"
          style={{ WebkitTextStroke: "1.5px rgba(242,239,230,0.07)" }}
        >
          Aflevering
        </p>
        <div className="relative">
          <SectionHead index="01" label="Afleveringen" />
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 lg:mb-10">
            <h2 className="rb-disp text-[clamp(2.4rem,6vw,4.5rem)]">
              Laatste
              <br />
              afleveringen
            </h2>
            <Link
              to="/afleveringen"
              className="rb-mono border-b-2 border-[var(--rb-lime)] pb-1.5 text-[var(--rb-lime)] no-underline hover:text-[var(--rb-ink)]"
            >
              Alle {siteEpisodes.length} afleveringen →
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
            {latestSlug ? (
              <Link
                to="/afleveringen/$slug"
                params={{ slug: latestSlug }}
                className="rb-photo group relative flex min-h-[360px] flex-col justify-end border border-[var(--rb-rule)] p-6 no-underline lg:min-h-[460px] lg:p-9"
              >
                <img
                  src={detailPhoto}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  width={598}
                  height={336}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,26,18,0.1)_15%,rgba(12,26,18,0.94)_100%)]" />
                <span className="relative">
                  <span className="rb-disp rb-outline-lime block text-[clamp(4.5rem,9vw,7.5rem)]">
                    {episodeLabel(latestEpisode)}
                  </span>
                  <span className="rb-mono mt-2 block text-[var(--rb-lime)]">
                    {latestEpisode.season} · {latestEpisode.date}
                  </span>
                  <span className="font-rb-serif mt-3 block text-[1.5rem] font-extrabold leading-[1.1] text-[var(--rb-ink)] sm:text-[2rem]">
                    {latestEpisode.title}
                  </span>
                  <span className="mt-3 line-clamp-3 max-w-xl text-[0.95rem] leading-[1.6] text-[var(--rb-ink-2)]">
                    {formatDescription(latestEpisode.description)}
                  </span>
                  <Waveform className="mt-5 max-w-full" />
                </span>
              </Link>
            ) : null}

            <div className="flex flex-col gap-4">
              {nextTwo.map((ep) => (
                <Link
                  key={ep.spotifyId}
                  to="/afleveringen/$slug"
                  params={{ slug: slugs.get(ep.spotifyId)! }}
                  className="rb-row group flex flex-1 flex-col justify-end border border-[var(--rb-rule)] bg-[var(--rb-surface)] p-6 no-underline transition-colors hover:bg-[var(--rb-surface-2)] lg:p-7"
                >
                  <span className="rb-disp rb-outline-lime text-[3.2rem] lg:text-[4.4rem]">{episodeLabel(ep)}</span>
                  <span className="rb-mono mt-2 text-[var(--rb-lime)]">{ep.date}</span>
                  <span className="font-rb-serif mt-2 text-[1.1rem] font-bold leading-[1.2] text-[var(--rb-ink)] lg:text-[1.3rem]">
                    {ep.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NU BELUISTEREN — Spotify player */}
      <section className="rb-cv mx-auto max-w-[1320px] px-6 py-16 lg:px-14 lg:py-20">
        <div className="grid items-center gap-10 border border-[var(--rb-rule)] bg-[var(--rb-surface)] p-6 sm:p-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="rb-mono mb-4 text-[var(--rb-lime)]">Nu beluisteren</p>
            <h2 className="rb-disp mb-6 text-[clamp(1.9rem,3.6vw,2.9rem)]">{latestEpisode.title}</h2>
            <ExpandableText
              text={formatDescription(latestEpisode.description)}
              className="font-rb-sans leading-[1.75] text-[var(--rb-muted)]"
            />
            <div className="flex flex-wrap gap-2">
              {latestEpisode.topics.map((t) => (
                <span key={t} className="rb-chip !px-2.5 !py-1 !text-[0.62rem]">
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

      {/* HOSTS */}
      <section className="rb-cv mx-auto max-w-[1320px] px-6 pb-6 pt-8 lg:px-14 lg:pt-16">
        <SectionHead index="02" label="Hosts" />
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 lg:mb-10">
          <h2 className="rb-disp text-[clamp(2.4rem,6vw,4.5rem)]">Aan tafel</h2>
          <Link
            to="/hosts"
            className="rb-mono border-b-2 border-[var(--rb-lime)] pb-1.5 text-[var(--rb-lime)] no-underline hover:text-[var(--rb-ink)]"
          >
            Leer ze kennen →
          </Link>
        </div>
        <p className="mb-8 max-w-xl text-[var(--rb-muted)]">
          Drie vrienden met elk hun eigen kijk op het spel. Van diplomaat tot professor tot
          romanticus.
        </p>

        <div className="grid gap-0 sm:grid-cols-3 sm:gap-5">
          {hosts.map((h) => (
            <Link
              key={h.id}
              to="/hosts"
              className="group flex items-stretch gap-4 border-b border-[var(--rb-rule)] py-3 no-underline sm:block sm:border-0 sm:py-0"
            >
              <span className="rb-photo relative block h-[104px] w-[104px] shrink-0 sm:h-[460px] sm:w-auto">
                <img
                  src={h.image}
                  alt={`Portret van ${h.name}`}
                  loading="lazy"
                  decoding="async"
                  width={640}
                  height={800}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,26,18,0)_45%,rgba(12,26,18,0.95)_100%)] max-sm:hidden" />
                <span className="absolute left-0 right-0 top-0 h-1 sm:h-[5px]" style={{ background: HOST_COLOR[h.id] }} />
                <span className="absolute inset-x-5 bottom-5 hidden sm:block">
                  <span className="rb-disp block text-[clamp(2.2rem,4vw,3.2rem)] text-[var(--rb-ink)]">{h.name.split(" ")[0]}</span>
                  <span className="rb-mono mt-2 block text-[var(--rb-ink-2)]">{h.role}</span>
                </span>
                <span className="rb-mono absolute right-4 top-4 hidden border border-[rgba(242,239,230,0.5)] bg-[rgba(12,26,18,0.6)] px-2.5 py-1 text-[0.62rem] sm:block">
                  HCP {h.handicap}
                </span>
              </span>
              <span className="flex min-w-0 flex-1 flex-col justify-center sm:hidden">
                <span className="rb-disp text-[2.1rem]">{h.name.split(" ")[0]}</span>
                <span className="rb-mono mt-2 text-[0.62rem] text-[var(--rb-ink-2)]">{h.role}</span>
              </span>
              <span className="flex shrink-0 flex-col justify-center text-right sm:hidden">
                <span className="rb-disp rb-num text-[1.6rem]" style={{ color: HOST_COLOR[h.id] }}>{h.handicap}</span>
                <span className="rb-mono mt-1 text-[0.55rem] text-[var(--rb-dim)]">HCP</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* PARCOURS */}
      {topCourses.length > 0 && (
        <section className="rb-cv relative mx-auto max-w-[1320px] px-6 pb-24 pt-16 lg:px-14 lg:pt-28 lg:pb-32">
          <SectionHead index="03" label="Parcours" />
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2fr)] lg:gap-14">
            <div>
              <h2 className="rb-disp text-[clamp(2.4rem,6vw,4.5rem)]">
                Hoog
                <br />
                gewaar&shy;deerd
              </h2>
              <p className="mt-6 max-w-sm text-[var(--rb-muted)]">
                Beoordeeld door onze hosts. Jij stemt mee! De Pampas Score is het gemiddelde van de
                scores van Lars, Levi en Niels op 100.
              </p>
              <Link to="/ratings" className="rb-btn rb-btn-lime mt-8">
                {courseCount ? `Alle ${courseCount} golfbanen` : "Alle golfbanen"}
              </Link>
            </div>

            <ol className="m-0 list-none border-t border-[var(--rb-rule)] p-0">
              {topCourses.map((course, i) => {
                const score = getScore(course);
                return (
                  <li key={course.id}>
                    <Link
                      to="/courses/$slug"
                      params={{ slug: course.slug }}
                      className="rb-row flex items-center gap-4 border-b border-[var(--rb-rule)] px-3 py-5 no-underline transition-colors hover:bg-[var(--rb-surface)] sm:gap-6 sm:py-6"
                    >
                      <span className="rb-mono w-6 text-[var(--rb-dim)]">{String(i + 1).padStart(2, "0")}</span>
                      <span className="min-w-0 flex-1">
                        <span className="font-rb-serif block text-[1.15rem] font-extrabold leading-[1.1] text-[var(--rb-ink)] sm:text-[1.6rem]">
                          {course.name}
                        </span>
                        <span className="rb-mono mt-2 block text-[0.62rem] text-[var(--rb-dim)] sm:text-[0.7rem]">
                          {[course.region, course.country].filter(Boolean).join(" · ")}
                        </span>
                        {score != null && (
                          <span className="rb-scale max-w-[340px]" aria-hidden="true">
                            <b style={{ width: `${Math.min(100, score)}%` }} />
                            <u style={{ left: "50%" }} />
                            <u style={{ left: "75%" }} />
                          </span>
                        )}
                        {course.quote && (
                          <span className="mt-3 line-clamp-2 hidden max-w-xl text-sm leading-[1.55] text-[var(--rb-muted)] sm:block">
                            “{course.quote}”{course.quoteHost ? ` — ${course.quoteHost}` : ""}
                          </span>
                        )}
                      </span>
                      <span
                        className="rb-disp rb-num rb-glow text-[2.1rem] text-[var(--rb-lime)] sm:text-[3rem]"
                        aria-label={score != null ? `Pampas Score ${fmtScore(score)} op 100` : "Nog geen score"}
                      >
                        {score != null ? fmtScore(score) : "—"}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      )}

      {/* NIEUWSBRIEF — lime band with a slanted top edge */}
      <section className="bg-[var(--rb-lime)] text-[var(--rb-ground)] [clip-path:polygon(0_40px,100%_0,100%_100%,0_100%)] lg:[clip-path:polygon(0_56px,100%_0,100%_100%,0_100%)]">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-10 px-6 pb-14 pt-24 lg:px-14 lg:pb-[72px] lg:pt-[132px]">
          <div className="min-w-0 flex-1 basis-[420px]">
            <h2 className="rb-disp text-[clamp(1.9rem,4.4vw,3.3rem)] leading-[0.98]">
              Hoor het als er een nieuwe aflevering valt.
            </h2>
            <p className="mt-3 max-w-md text-sm font-medium opacity-80">
              Eén mail, enkel bij een nieuwe aflevering. Verder stilte.
            </p>
          </div>
          {status === "success" ? (
            <p className="rb-disp text-2xl">Bedankt! Je hoort het als eerste.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex w-full max-w-[560px] flex-col gap-2.5 sm:flex-row sm:gap-0 lg:flex-1 lg:basis-[420px]">
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
                placeholder="jouw@e-mailadres.be"
                maxLength={255}
                className="min-w-0 flex-1 border-2 border-[var(--rb-ground)] bg-transparent px-[1.1rem] py-[1.05rem] text-base text-[var(--rb-ground)] outline-none placeholder:text-[rgba(12,26,18,0.6)] focus:bg-[rgba(12,26,18,0.06)] sm:border-r-0"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="rb-btn bg-[var(--rb-ground)] !text-[var(--rb-lime)] hover:!bg-[var(--rb-surface)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading" ? "Bezig…" : "Inschrijven"}
              </button>
            </form>
          )}
          {status === "error" && error && (
            <p role="alert" className="w-full text-sm font-semibold text-[var(--rb-ground)]">
              {error}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
