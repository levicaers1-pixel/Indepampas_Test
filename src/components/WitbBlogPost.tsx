import { Link } from "@tanstack/react-router";
import type { Post } from "@/data/posts";

type EquipmentRow = {
  category: string;
  club: string;
  clubSmall?: string;
  shaftBrand: string;
  shaftDetail: string;
  variant?: "default" | "highlight" | "ball";
};

type HostSection = {
  num: string;
  name: string;
  role: string;
  hcp: string;
  rows: EquipmentRow[];
  quote?: string;
};

const LEVI_ROWS: EquipmentRow[] = [
  {
    category: "Driver",
    club: "Callaway Rogue ST LS Triple Diamond",
    shaftBrand: "Fujikura Ventus TR Black",
    shaftDetail: "7-X · Extra Stiff",
    variant: "highlight",
  },
  {
    category: "3 Wood",
    club: "TaylorMade Stealth 2+",
    shaftBrand: "Mitsubishi Chem. 304SS",
    shaftDetail: "70 S · Stiff",
  },
  {
    category: "Hybride 2",
    club: "Ping G400",
    clubSmall: "17°",
    shaftBrand: "Aftermarket Ping X85",
    shaftDetail: "Hybride shaft",
  },
  {
    category: "I2",
    club: "TaylorMade UDI 2",
    shaftBrand: "Tour AD Utility",
    shaftDetail: "AD-95 X · Extra Stiff",
  },
  {
    category: "IJZERS",
    club: "TaylorMade P730",
    shaftBrand: "Project X",
    shaftDetail: "6.5 · Extra Stiff",
    variant: "highlight",
  },
  {
    category: "Wedges",
    club: "Takomo",
    clubSmall: "52° · 56°",
    shaftBrand: "KBS Wedge",
    shaftDetail: "Wedge flex",
  },
  {
    category: "Putter",
    club: "Scotty Cameron Phantom 5.5",
    shaftBrand: "Scotty Cameron",
    shaftDetail: "Steel · Standaard",
  },
  {
    category: "Bal",
    club: "Titleist Pro V1",
    shaftBrand: "",
    shaftDetail: "De klassieke keuze voor de serieuze golfer",
    variant: "ball",
  },
];

const HOSTS: HostSection[] = [
  {
    num: "01",
    name: "Levi Caers",
    role: "De Professor · Ball-striker pur sang",
    hcp: "HCP 3.2",
    rows: LEVI_ROWS,
    quote:
      "De P730's zijn mijn trouwste partner op de baan. Blades voor wie niet bang is van eerlijkheid — elke mis-hit voelt je meteen in je handen. Maar raak je ze puur, dan is er geen gevoel zoals dat.",
  },
];

const BRANDS = [
  { name: "TaylorMade", count: "3×" },
  { name: "Callaway", count: "1×" },
  { name: "Ping", count: "1×" },
  { name: "Takomo", count: "2×" },
  { name: "Scotty Cameron", count: "1×" },
  { name: "Titleist", count: "1×" },
];

const SHAFTS = [
  { name: "Fujikura Ventus TR", where: "Driver" },
  { name: "Mitsubishi Chem.", where: "3 Wood" },
  { name: "Tour AD", where: "Utility" },
  { name: "Project X", where: "IJZERS" },
  { name: "KBS Wedge", where: "Wedges" },
];

const FLEX_TAGS = ["X-Stiff Driver", "X-Stiff Utility", "Stiff 3W", "6.5 Irons", "Blades", "Pro V1"];

const PILLS = [
  { initials: "LC", name: "Levi Caers", hcp: "HCP 3.2", active: true },
  { initials: "LM", name: "Lars Masyn", hcp: "Binnenkort", active: false },
  { initials: "NJ", name: "Niels Jacoby", hcp: "Binnenkort", active: false },
];

const MONO = "'DM Mono', ui-monospace, monospace";
const SERIF = "'Cormorant Garamond', ui-serif, Georgia, serif";

export function WitbBlogPost({ post, prev, next }: { post: Post; prev?: Post; next?: Post }) {
  return (
    <article className="bg-[#F4EFE5] text-[#18180F] -mx-6 lg:-mx-12 -mt-28 sm:-mt-36 lg:-mt-44 -mb-16">
      {/* HERO */}
      <header className="grid grid-cols-1 lg:grid-cols-[1fr_340px] border-b border-[#1C3D2A]/15 pt-28 sm:pt-32 lg:pt-24">
        <div className="px-6 sm:px-12 lg:px-16 py-12 lg:py-20 border-r-0 lg:border-r border-[#1C3D2A]/15 flex flex-col justify-end">
          <div
            className="flex items-center gap-3 mb-8 text-[#7A7260] uppercase"
            style={{ fontFamily: MONO, fontSize: "0.58rem", letterSpacing: "0.16em" }}
          >
            <Link to="/blog" className="text-[#7A7260] hover:text-[#1C3D2A]">
              Blog
            </Link>
            <span className="text-[#1C3D2A]/30">/</span>
            <span>Equipment</span>
          </div>
          <span
            className="self-start mb-5 text-[#F4EFE5] bg-[#1C3D2A] uppercase"
            style={{
              fontFamily: MONO,
              fontSize: "0.58rem",
              letterSpacing: "0.16em",
              padding: "0.3rem 0.75rem",
            }}
          >
            What's In The Bag
          </span>
          <h1
            className="font-light text-[#1C3D2A] leading-[1.05] mb-5 [&_em]:italic"
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(2.8rem, 4.5vw, 4.2rem)",
              fontWeight: 300,
            }}
          >
            WITB —<br />
            <em>Team Pampas.</em>
          </h1>
          <p className="text-[#7A7260] max-w-[520px] leading-[1.75]" style={{ fontSize: "1rem" }}>
            {post.excerpt}
          </p>
        </div>

        <div className="hidden lg:flex bg-[#1C3D2A] px-10 py-12 flex-col justify-between">
          <div>
            <MetaLabel>Datum</MetaLabel>
            <MetaVal>{post.date}</MetaVal>
            <MetaLabel>Categorie</MetaLabel>
            <MetaVal>Equipment · WITB</MetaVal>
            <MetaLabel>Leestijd</MetaLabel>
            <MetaVal>{post.readTime}</MetaVal>
          </div>
          <div className="h-px bg-[#F4EFE5]/10 my-6" />
          <div>
            <div
              className="text-[#F4EFE5]/35 uppercase mb-3"
              style={{ fontFamily: MONO, fontSize: "0.55rem", letterSpacing: "0.18em" }}
            >
              Hosts in deze post
            </div>
            <div className="flex flex-col gap-3">
              {PILLS.map((p) => (
                <div
                  key={p.name}
                  className={`flex items-center gap-3.5 px-3.5 py-2.5 border ${
                    p.active ? "border-[#8FBF4A] bg-[#8FBF4A]/[0.08]" : "border-[#F4EFE5]/12"
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[#F4EFE5]"
                    style={{
                      fontFamily: SERIF,
                      fontSize: "0.85rem",
                      background: p.active ? "#3A7A52" : "#2B5C3E",
                    }}
                  >
                    {p.initials}
                  </div>
                  <span
                    className="flex-1 text-[#F4EFE5] uppercase"
                    style={{ fontFamily: MONO, fontSize: "0.62rem", letterSpacing: "0.1em" }}
                  >
                    {p.name}
                  </span>
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: "0.6rem",
                      color: p.active ? "#8FBF4A" : "rgba(244,239,229,0.3)",
                    }}
                  >
                    {p.hcp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] items-start">
        <main className="border-r-0 lg:border-r border-[#1C3D2A]/15">
          {/* Intro */}
          <div className="px-6 sm:px-12 lg:px-16 py-10 lg:py-14 border-b border-[#1C3D2A]/15">
            <p
              className="text-[#2E2B25] max-w-[640px] leading-[1.85] [&::first-letter]:font-bold [&::first-letter]:text-[#1C3D2A] [&::first-letter]:float-left [&::first-letter]:leading-[0.8] [&::first-letter]:mr-2 [&::first-letter]:mt-1 [&::first-letter]:text-[4.5rem]"
              style={{ fontSize: "1.05rem" }}
            >
              <span style={{ fontFamily: SERIF }} className="contents">
                Een klassieker in de golfwereld: de What's In The Bag. Tijd om de tassen van Team Pampas open te trekken
                en eerlijk te zijn over wat er werkt, wat er blijft liggen, en wat er stiekem aan vervanging toe is. In
                deze eerste editie duiken we in de tas van Levi — de man die golf bekijkt als een exacte wetenschap en
                zijn set samenstelt met de precisie van een chirurg.
              </span>
            </p>
          </div>

          {HOSTS.map((host) => (
            <section key={host.num} className="border-b border-[#1C3D2A]/15">
              {/* Host header */}
              <div className="grid grid-cols-[60px_1fr] sm:grid-cols-[80px_1fr] border-b border-[#1C3D2A]/15 bg-[#EDE6D9]">
                <div
                  className="flex items-center justify-center border-r border-[#1C3D2A]/15 text-[#E2D9C8] py-6"
                  style={{ fontFamily: SERIF, fontSize: "2.5rem", fontWeight: 300 }}
                >
                  {host.num}
                </div>
                <div className="px-5 sm:px-10 py-5 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[#1C3D2A]" style={{ fontFamily: SERIF, fontSize: "1.6rem", fontWeight: 600 }}>
                      {host.name}
                    </div>
                    <div
                      className="text-[#8FBF4A] uppercase mt-0.5"
                      style={{ fontFamily: MONO, fontSize: "0.58rem", letterSpacing: "0.16em" }}
                    >
                      {host.role}
                    </div>
                  </div>
                  <div
                    className="hidden sm:inline-block bg-[#1C3D2A] text-[#8FBF4A]"
                    style={{
                      fontFamily: MONO,
                      fontSize: "0.65rem",
                      letterSpacing: "0.1em",
                      padding: "0.35rem 0.85rem",
                    }}
                  >
                    {host.hcp}
                  </div>
                </div>
              </div>

              {/* Header row */}
              <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[160px_1fr_1fr] bg-[#1C3D2A] pointer-events-none">
                {["Club", "Model", "Shaft"].map((h, i) => (
                  <div
                    key={h}
                    className={`px-4 sm:px-6 py-3 text-[#F4EFE5]/45 uppercase border-r border-[#F4EFE5]/10 last:border-r-0 ${
                      i === 2 ? "hidden sm:flex" : "flex"
                    } items-center`}
                    style={{ fontFamily: MONO, fontSize: "0.58rem", letterSpacing: "0.18em" }}
                  >
                    {h}
                  </div>
                ))}
              </div>

              {/* Equipment rows */}
              {host.rows.map((row, ri) => {
                const isBall = row.variant === "ball";
                const isHi = row.variant === "highlight";
                const rowBg = isBall
                  ? "bg-[#1C3D2A] hover:bg-[#2B5C3E]"
                  : isHi
                    ? "bg-[#8FBF4A]/[0.06] hover:bg-[#EDE6D9]"
                    : "hover:bg-[#EDE6D9]";
                const borderC = isBall ? "border-[#F4EFE5]/10" : "border-[#1C3D2A]/15";
                return (
                  <div
                    key={ri}
                    className={`grid grid-cols-[120px_1fr] sm:grid-cols-[160px_1fr_1fr] border-b ${borderC} ${rowBg} transition-colors`}
                  >
                    <div
                      className={`px-4 sm:px-6 py-4 flex items-center border-r ${borderC} uppercase`}
                      style={{
                        fontFamily: MONO,
                        fontSize: "0.6rem",
                        letterSpacing: "0.12em",
                        color: isBall ? "rgba(244,239,229,0.45)" : isHi ? "#8FBF4A" : "#7A7260",
                      }}
                    >
                      {row.category}
                    </div>
                    <div className={`px-4 sm:px-6 py-4 flex items-center border-r ${borderC}`}>
                      <div
                        className="leading-[1.3]"
                        style={{
                          fontFamily: SERIF,
                          fontSize: isBall ? "1.1rem" : "1.05rem",
                          color: isBall ? "#F4EFE5" : "#1C3D2A",
                        }}
                      >
                        {row.club}
                        {row.clubSmall && (
                          <small
                            className="block text-[#7A7260] mt-1 not-italic"
                            style={{
                              fontFamily: MONO,
                              fontSize: "0.58rem",
                              letterSpacing: "0.08em",
                            }}
                          >
                            {row.clubSmall}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="hidden sm:flex px-6 py-4 items-center">
                      <div
                        className="leading-[1.5]"
                        style={{
                          fontFamily: MONO,
                          fontSize: "0.65rem",
                          letterSpacing: "0.04em",
                          color: isBall ? "#8FBF4A" : "#7A7260",
                        }}
                      >
                        {row.shaftBrand && (
                          <strong
                            className="block font-medium mb-0.5"
                            style={{ color: isBall ? "#8FBF4A" : "#1C3D2A" }}
                          >
                            {row.shaftBrand}
                          </strong>
                        )}
                        {row.shaftDetail}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Pull quote */}
              {host.quote && (
                <div className="flex items-start gap-6 px-6 sm:px-12 lg:px-16 py-10 border-b border-[#1C3D2A]/15 bg-[#EDE6D9]">
                  <div
                    className="text-[#8FBF4A] shrink-0"
                    style={{ fontFamily: SERIF, fontSize: "5rem", lineHeight: 0.6, marginTop: "0.5rem" }}
                  >
                    "
                  </div>
                  <p className="italic text-[#1C3D2A] leading-[1.5]" style={{ fontFamily: SERIF, fontSize: "1.35rem" }}>
                    {host.quote}
                  </p>
                </div>
              )}
            </section>
          ))}

          {/* Coming soon */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-12 px-6 sm:px-12 lg:px-16 py-12 border-b border-[#1C3D2A]/15">
            <div className="flex-1">
              <div
                className="text-[#8FBF4A] uppercase mb-3"
                style={{ fontFamily: MONO, fontSize: "0.6rem", letterSpacing: "0.18em" }}
              >
                Volgende editie
              </div>
              <h3
                className="text-[#1C3D2A] leading-[1.2] [&_em]:italic"
                style={{ fontFamily: SERIF, fontSize: "1.8rem", fontWeight: 300 }}
              >
                Lars &amp; Niels —<br />
                <em>hun tassen volgen binnenkort.</em>
              </h3>
              <p className="text-[#7A7260] mt-2" style={{ fontSize: "0.9rem" }}>
                Van de Callaway AI Smoke Triple Diamond (= rechts weg) tot de romantische bag van de Romanticus.
              </p>
            </div>
            <div className="flex">
              {[
                { i: "LM", placeholder: false },
                { i: "NJ", placeholder: false },
                { i: "+", placeholder: true },
              ].map((h, idx) => (
                <div
                  key={idx}
                  className="w-13 h-13 border-2 border-[#F4EFE5] rounded-full flex items-center justify-center -ml-3 first:ml-0"
                  style={{
                    width: 52,
                    height: 52,
                    background: h.placeholder ? "#1C3D2A" : "#E2D9C8",
                    color: h.placeholder ? "#F4EFE5" : "#7A7260",
                    fontFamily: h.placeholder ? MONO : SERIF,
                    fontSize: h.placeholder ? "0.65rem" : "1rem",
                  }}
                >
                  {h.i}
                </div>
              ))}
            </div>
          </div>

          {/* Article footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 sm:px-12 lg:px-16 py-10 border-t border-[#1C3D2A]/15">
            <span
              className="text-[#7A7260] uppercase"
              style={{ fontFamily: MONO, fontSize: "0.6rem", letterSpacing: "0.1em" }}
            >
              Bron: Team Pampas · Vol. I · 2026
            </span>
            <Link
              to="/blog"
              className="text-[#1C3D2A] uppercase border border-[#1C3D2A]/30 hover:bg-[#1C3D2A] hover:text-[#F4EFE5] hover:border-[#1C3D2A] transition-colors"
              style={{
                fontFamily: MONO,
                fontSize: "0.6rem",
                letterSpacing: "0.12em",
                padding: "0.65rem 1.4rem",
              }}
            >
              ← Terug naar blog
            </Link>
          </div>
        </main>

        {/* SIDEBAR */}
        <aside className="hidden lg:block sticky top-20 px-10 py-12">
          <SidebarSection label="In de tas — Levi">
            <span
              className="block text-[#1C3D2A] leading-none mb-1"
              style={{ fontFamily: SERIF, fontSize: "2.5rem", fontWeight: 300 }}
            >
              14
            </span>
            <div className="text-sm leading-[1.65]">clubs + bal · Vol. I editie</div>
          </SidebarSection>

          <SidebarSection label="Merken breakdown">
            <BrandList items={BRANDS} />
          </SidebarSection>

          <SidebarSection label="Shafts">
            <BrandList items={SHAFTS.map((s) => ({ name: s.name, count: s.where }))} />
          </SidebarSection>

          <SidebarSection label="Flex profiel">
            <div className="flex flex-wrap gap-1.5 mt-2">
              {FLEX_TAGS.map((t) => (
                <span
                  key={t}
                  className="border border-[#1C3D2A]/15 text-[#7A7260] uppercase"
                  style={{
                    fontFamily: MONO,
                    fontSize: "0.55rem",
                    letterSpacing: "0.1em",
                    padding: "0.3rem 0.65rem",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </SidebarSection>

          <SidebarSection label="Hosts" last>
            <div className="text-sm leading-[1.65]">Lars Masyn · Levi Caers · Niels Jacoby</div>
          </SidebarSection>
        </aside>
      </div>

      {/* PREV / NEXT */}
      {(prev || next) && (
        <nav className="max-w-[1100px] mx-auto px-6 sm:px-12 py-10 grid sm:grid-cols-2 gap-6 border-t border-[#1C3D2A]/15">
          {prev ? (
            <Link to="/blog/$slug" params={{ slug: prev.slug }} className="group block">
              <span
                className="text-[#7A7260] uppercase block"
                style={{ fontFamily: MONO, fontSize: "0.6rem", letterSpacing: "0.15em" }}
              >
                Vorige
              </span>
              <span
                className="block text-[#1C3D2A] mt-1 group-hover:text-[#3A7A52] transition-colors"
                style={{ fontFamily: SERIF, fontSize: "1.4rem" }}
              >
                {prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to="/blog/$slug" params={{ slug: next.slug }} className="group block sm:text-right">
              <span
                className="text-[#7A7260] uppercase block"
                style={{ fontFamily: MONO, fontSize: "0.6rem", letterSpacing: "0.15em" }}
              >
                Volgende
              </span>
              <span
                className="block text-[#1C3D2A] mt-1 group-hover:text-[#3A7A52] transition-colors"
                style={{ fontFamily: SERIF, fontSize: "1.4rem" }}
              >
                {next.title}
              </span>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}

function MetaLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[#F4EFE5]/35 uppercase mb-1"
      style={{ fontFamily: MONO, fontSize: "0.55rem", letterSpacing: "0.18em" }}
    >
      {children}
    </div>
  );
}

function MetaVal({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[#F4EFE5] mb-6" style={{ fontFamily: SERIF, fontSize: "1.05rem" }}>
      {children}
    </div>
  );
}

function SidebarSection({ label, children, last }: { label: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={`mb-8 pb-8 ${last ? "" : "border-b border-[#1C3D2A]/15"}`}>
      <div
        className="text-[#7A7260] uppercase mb-3"
        style={{ fontFamily: MONO, fontSize: "0.58rem", letterSpacing: "0.18em" }}
      >
        {label}
      </div>
      <div className="text-[#18180F]">{children}</div>
    </div>
  );
}

function BrandList({ items }: { items: { name: string; count: string }[] }) {
  return (
    <div className="flex flex-col gap-2 mt-2">
      {items.map((b) => (
        <div
          key={b.name}
          className="flex justify-between items-center py-2 border-b border-[#1C3D2A]/15 last:border-b-0"
          style={{ fontSize: "0.82rem" }}
        >
          <span className="text-[#1C3D2A]">{b.name}</span>
          <span
            className="bg-[#EDE6D9] text-[#7A7260]"
            style={{
              fontFamily: MONO,
              fontSize: "0.6rem",
              letterSpacing: "0.1em",
              padding: "0.2rem 0.5rem",
            }}
          >
            {b.count}
          </span>
        </div>
      ))}
    </div>
  );
}
