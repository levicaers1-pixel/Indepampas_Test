import { createFileRoute, Link } from "@tanstack/react-router";
import { fetchCourseIndex, type CourseIndexEntry } from "@/data/courses-db";
import { buildSlugMap, slugifyName } from "@/lib/courseSlug";
import { SITE_URL } from "@/lib/site";

type Row = CourseIndexEntry & { slug: string };
type Region = { name: string; courses: Row[] };
type Country = { name: string; id: string; regions: Region[]; total: number; rated: number };

const COUNTRY_ORDER = ["België", "Nederland", "Frankrijk", "Spanje", "Verenigd Koninkrijk"];

function group(index: CourseIndexEntry[]): { countries: Country[]; rows: Row[] } {
  const slugMap = buildSlugMap(index);
  const rows: Row[] = index.map((c) => ({ ...c, slug: slugMap.get(c.id)! }));
  const byCountry = new Map<string, Row[]>();
  for (const r of rows) byCountry.set(r.country, [...(byCountry.get(r.country) ?? []), r]);

  const rank = (name: string) => {
    const i = COUNTRY_ORDER.indexOf(name);
    return i === -1 ? COUNTRY_ORDER.length : i;
  };
  const countries = [...byCountry.entries()]
    .sort((a, b) => rank(a[0]) - rank(b[0]) || b[1].length - a[1].length)
    .map(([name, list]): Country => {
      const byRegion = new Map<string, Row[]>();
      for (const r of list) byRegion.set(r.region ?? "Overige", [...(byRegion.get(r.region ?? "Overige") ?? []), r]);
      const regions = [...byRegion.entries()]
        .sort((a, b) => a[0].localeCompare(b[0], "nl"))
        .map(([rname, courses]): Region => ({
          name: rname,
          // rated courses first (best score first), then the rest alphabetically
          courses: courses.sort(
            (a, b) =>
              (b.pampasScore ?? -1) - (a.pampasScore ?? -1) || a.name.localeCompare(b.name, "nl"),
          ),
        }));
      return { name, id: slugifyName(name), regions, total: list.length, rated: list.filter((c) => c.ratingCount > 0).length };
    });
  return { countries, rows };
}

export const Route = createFileRoute("/golfbanen")({
  loader: async () => {
    const index = await fetchCourseIndex();
    return group(index);
  },
  head: ({ loaderData }) => {
    const total = loaderData?.rows.length ?? 0;
    const rated = loaderData?.rows.filter((r) => r.ratingCount > 0).length ?? 0;
    const names = (loaderData?.countries ?? []).slice(0, 3).map((c) => c.name);
    const title = `Golfbanen in België en daarbuiten — alle ${total} banen | PAMPAS`;
    const desc = `Alle ${total} golfbanen in ${names.join(", ")} en meer, met de Pampas Score van ${rated} door Lars, Levi & Niels gespeelde banen. Per regio, met holes en greenfee.`;
    const url = `${SITE_URL}/golfbanen`;
    const ranked = (loaderData?.rows ?? [])
      .filter((r) => r.pampasScore != null)
      .sort((a, b) => (b.pampasScore ?? 0) - (a.pampasScore ?? 0));
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Golfbanen",
            url,
            inLanguage: "nl-BE",
            mainEntity: {
              "@type": "ItemList",
              name: "Golfbanen gerangschikt op Pampas Score",
              numberOfItems: ranked.length,
              itemListElement: ranked.map((r, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `${SITE_URL}/courses/${r.slug}`,
                name: r.name,
              })),
            },
          }),
        },
      ],
    };
  },
  component: GolfbanenPage,
});

function GolfbanenPage() {
  const { countries, rows } = Route.useLoaderData();
  const rated = rows.filter((r) => r.ratingCount > 0).length;

  return (
    <>
      <div className="px-6 lg:px-14 pt-16 pb-12 border-b border-[rgba(28,61,42,0.15)] flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <p className="font-rb-mono text-[0.7rem] tracking-[0.2em] uppercase text-[#635C4B] mb-4">Het overzicht</p>
          <h1 className="font-rb-serif font-light text-[clamp(2.8rem,5vw,4.5rem)] text-[#1C3D2A] leading-none">
            Golfbanen<em className="italic">.</em>
          </h1>
          <p className="font-rb-sans text-[0.95rem] text-[#635C4B] mt-3 max-w-2xl leading-[1.7]">
            Alle {rows.length} golfbanen in onze database, per land en regio. Voor {rated} ervan staat er een eerlijke
            beoordeling van Lars, Levi &amp; Niels (de Pampas Score); de andere zijn nog niet door ons gespeeld.{" "}
            <Link to="/ratings" className="text-[#1C3D2A] border-b border-[#8FBF4A] no-underline hover:text-[#46701D]">
              Vergelijk en filter alle parcours →
            </Link>
          </p>
        </div>
        <nav aria-label="Landen" className="font-rb-mono text-[0.7rem] tracking-[0.12em] uppercase text-[#635C4B] leading-[2] md:text-right">
          {countries.map((c) => (
            <div key={c.id}>
              <a href={`#${c.id}`} className="text-[#1C3D2A] no-underline hover:text-[#46701D]">
                {c.name}
              </a>{" "}
              <span className="text-[#46701D]">{c.total}</span>
            </div>
          ))}
        </nav>
      </div>

      {countries.map((country) => (
        <section key={country.id} id={country.id} className="px-6 lg:px-14 py-12 border-b border-[rgba(28,61,42,0.15)] scroll-mt-24">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-8">
            <h2 className="font-rb-serif font-light text-[2.2rem] text-[#1C3D2A] leading-none">{country.name}</h2>
            <p className="font-rb-mono text-[0.7rem] tracking-[0.14em] uppercase text-[#635C4B]">
              {country.total} banen · {country.rated} beoordeeld
            </p>
          </div>

          <div className="grid gap-x-12 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
            {country.regions.map((region) => (
              <div key={region.name}>
                <h3 className="font-rb-mono text-[0.7rem] tracking-[0.16em] uppercase text-[#46701D] mb-3 border-b border-[rgba(28,61,42,0.15)] pb-2">
                  {region.name} <span className="text-[#635C4B]">· {region.courses.length}</span>
                </h3>
                <ul className="space-y-2">
                  {region.courses.map((c) => (
                    <li key={c.id} className="flex items-baseline justify-between gap-3">
                      <Link
                        to="/courses/$slug"
                        params={{ slug: c.slug }}
                        className="font-rb-sans text-[0.92rem] text-[#1C3D2A] no-underline hover:text-[#46701D] hover:underline underline-offset-4 decoration-[#8FBF4A]"
                      >
                        {c.name}
                      </Link>
                      <span className="font-rb-mono text-[0.7rem] tracking-[0.06em] text-[#635C4B] shrink-0">
                        {c.pampasScore != null ? (
                          <span className="text-[#1C3D2A]">{c.pampasScore}</span>
                        ) : (
                          `${c.holes} holes`
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
