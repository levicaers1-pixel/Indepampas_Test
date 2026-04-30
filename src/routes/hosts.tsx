import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { motion } from "framer-motion";
import { hosts } from "@/data/hosts";
import { PampasMark } from "@/components/PampasMark";
import { VersionSwitch } from "@/components/VersionToggle";
const NewHosts = lazy(() => import("@/components/rebrand/NewHosts").then((m) => ({ default: m.NewHosts })));

const SITE_URL = "https://indepampas.be";
const HOSTS_DESCRIPTION =
  "Maak kennis met Lars, Levi en Niels — drie Belgische vrienden, drie handicaps, één liefde voor golf. De stemmen achter de PAMPAS podcast.";

export const Route = createFileRoute("/hosts")({
  head: () => ({
    meta: [
      { title: "De Hosts — PAMPAS Podcast" },
      { name: "description", content: HOSTS_DESCRIPTION },
      { property: "og:title", content: "De Hosts — PAMPAS Podcast" },
      { property: "og:description", content: HOSTS_DESCRIPTION },
      { property: "og:url", content: SITE_URL + "/hosts" },
      { property: "og:image", content: SITE_URL + hosts[0].image },
      { name: "twitter:title", content: "De Hosts — PAMPAS Podcast" },
      { name: "twitter:description", content: HOSTS_DESCRIPTION },
      { name: "twitter:image", content: SITE_URL + hosts[0].image },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/hosts" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "De Hosts — PAMPAS Podcast",
          description: HOSTS_DESCRIPTION,
          url: SITE_URL + "/hosts",
        }),
      },
    ],
  }),
  component: HostsPage,
});

function HostsPage() {
  return <VersionSwitch Old={OldHosts} New={NewHosts} />;
}

function OldHosts() {
  return (
    <section className="pt-28 sm:pt-36 lg:pt-48 pb-12 px-6 lg:px-12 relative overflow-hidden">
      <PampasMark
        className="hidden lg:block absolute top-32 right-12 w-16 h-56 text-sage/30"
        sway
      />

      <div className="max-w-[1300px] mx-auto">
        <p className="text-[11px] uppercase tracking-[0.3em] text-sage font-medium mb-6">
          De drie stemmen
        </p>
        <h1 className="font-serif text-6xl lg:text-8xl leading-[0.9] tracking-tighter text-charcoal mb-8 max-w-4xl">
          De Hosts<span className="text-sage">.</span>
        </h1>
        <p className="text-lg lg:text-xl text-charcoal/75 max-w-2xl leading-relaxed mb-20">
          Drie vrienden, met elk een uniek traject, geven hun verschillende kijk op de
          golf sport.
        </p>

        <div className="space-y-32">
          {hosts.map((h, i) => (
            <motion.article
              key={h.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
                i % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="relative aspect-[3/4] bg-dune p-3 shadow-2xl shadow-charcoal/15">
                  <img
                    src={h.image}
                    loading="lazy"
                    width={800}
                    height={1024}
                    alt={`Portret van ${h.name}`}
                    className="w-full h-full object-cover ring-1 ring-inset ring-charcoal/10"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-charcoal text-mist px-4 py-2 text-[10px] uppercase tracking-[0.25em]">
                    0{i + 1}
                  </div>
                </div>
              </div>

              <div className={`lg:col-span-7 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                <p className="text-[11px] uppercase tracking-[0.25em] text-sage font-medium mb-4">
                  {h.role}
                </p>
                <h2 className="font-serif text-6xl lg:text-8xl leading-[0.9] tracking-tighter text-charcoal mb-8">
                  {h.name}
                </h2>
                <p className="text-charcoal/80 text-lg leading-relaxed mb-10 max-w-xl font-serif whitespace-pre-line">{h.bio}</p>

                <dl className="grid grid-cols-2 gap-x-8 gap-y-6 max-w-md border-t border-charcoal/10 pt-6">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.25em] text-sage mb-1">
                      Handicap
                    </dt>
                    <dd className="font-serif text-3xl text-charcoal">{h.handicap}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.25em] text-sage mb-1">
                      Thuisbaan
                    </dt>
                    <dd className="font-serif italic text-xl text-charcoal">{h.favoriteCourse}</dd>
                  </div>
                </dl>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
