import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, Section, Table } from "@/components/admin/StatsTab";
import { buildSlugMap } from "@/lib/courseSlug";

type Row = { views: number };
type SiteStats = {
  from: string;
  views: number;
  visitors: number;
  daily: { day: string; views: number; visitors: number }[];
  pages: (Row & { path: string })[];
  courses: (Row & { path: string })[];
  sources: (Row & { source: string })[];
  countries: (Row & { country: string })[];
  devices: (Row & { device: string })[];
};

const PERIODS = [7, 30, 90] as const;
const DAY_MS = 86_400_000;
const nf = new Intl.NumberFormat("nl-BE");
const regionNames = new Intl.DisplayNames(["nl"], { type: "region" });
const DEVICE_LABEL: Record<string, string> = {
  mobile: "Gsm",
  tablet: "Tablet",
  desktop: "Computer",
  other: "Andere",
};

function countryName(code: string) {
  if (code === "XX") return "Onbekend";
  if (code === "T1") return "Tor-netwerk";
  try {
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
}

const pageLabel = (path: string) => (path === "/" ? "Home" : path);

export function VisitsTab() {
  const [days, setDays] = useState<(typeof PERIODS)[number]>(30);
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [courseNames, setCourseNames] = useState<Map<string, string>>(new Map());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setStats(null);
    setError(null);
    (async () => {
      const [s, c] = await Promise.all([
        supabase.rpc("admin_site_stats", { _days: days }),
        supabase.from("courses").select("id,name"),
      ]);
      if (!active) return;
      if (s.error) return setError(s.error.message);
      setStats(s.data as unknown as SiteStats);
      // Slugs are derived from the course name, so rebuild them the same way the public pages do.
      const courses = c.data ?? [];
      const slugs = buildSlugMap(courses);
      setCourseNames(new Map(courses.map((x) => [slugs.get(x.id)!, x.name])));
    })();
    return () => {
      active = false;
    };
  }, [days]);

  // Every day in the period, including days without visits, so the bars keep their place.
  const daily = useMemo(() => {
    if (!stats) return [];
    const byDay = new Map(stats.daily.map((d) => [d.day, d]));
    const start = Date.parse(`${stats.from}T00:00:00Z`);
    return Array.from({ length: days }, (_, i) => {
      const day = new Date(start + i * DAY_MS).toISOString().slice(0, 10);
      return { day, views: byDay.get(day)?.views ?? 0, visitors: byDay.get(day)?.visitors ?? 0 };
    });
  }, [stats, days]);

  if (error) return <p className="text-sm text-red-400">{error}</p>;
  if (!stats) return <p className="text-sm text-[#8A8270]">Laden…</p>;

  const maxViews = Math.max(1, ...daily.map((d) => d.views));
  const pct = (n: number) => (stats.views ? `${Math.round((n / stats.views) * 100)}%` : "—");
  const courseLabel = (path: string) => courseNames.get(path.replace("/courses/", "")) ?? path;
  const labelEvery = days > 30 ? 7 : days > 7 ? 5 : 1;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-medium">Bezoek aan de site</h2>
        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setDays(p)}
              aria-pressed={days === p}
              className={`border px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] ${
                days === p
                  ? "border-[#BA7517] text-[#E8E4D8]"
                  : "border-[#2A2A26] text-[#8A8270] hover:text-[#E8E4D8]"
              }`}
            >
              {p} dagen
            </button>
          ))}
        </div>
      </div>
      <p className="mt-1 text-xs text-[#8A8270]">
        Anoniem geteld, zonder cookies, vanaf de dag waarop de teller live ging. Bots en bezoekers
        met Do Not Track staan er niet in. Dagen lopen van 01:00 tot 01:00 (UTC-dagen). Bezoekers
        zijn per dag uniek: wie op drie dagen terugkomt, telt drie keer.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card
          label="Paginaweergaven"
          value={nf.format(stats.views)}
          hint={`Laatste ${days} dagen`}
        />
        <Card label="Bezoekers (per dag opgeteld)" value={nf.format(stats.visitors)} />
        <Card
          label="Weergaven per bezoeker"
          value={stats.visitors ? (stats.views / stats.visitors).toFixed(1).replace(".", ",") : "—"}
        />
        <Card
          label="Beste dag"
          value={nf.format(Math.max(0, ...daily.map((d) => d.views)))}
          hint={
            daily.find((d) => d.views === Math.max(...daily.map((x) => x.views)) && d.views > 0)
              ?.day
          }
        />
      </div>

      <Section title="Weergaven per dag">
        <div className="border border-[#2A2A26] bg-[#1A1A18] p-4">
          <div className="flex h-40 items-end gap-px">
            {daily.map((d) => (
              <div
                key={d.day}
                className="flex h-full flex-1 flex-col justify-end"
                title={`${d.day}: ${d.views} weergaven, ${d.visitors} bezoekers`}
              >
                <div
                  className="w-full bg-[#BA7517]"
                  style={{ height: `${(d.views / maxViews) * 100}%`, minHeight: d.views ? 2 : 0 }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-px">
            {daily.map((d, i) => (
              <span
                key={d.day}
                className="flex-1 overflow-visible whitespace-nowrap text-center text-[9px] text-[#8A8270]"
              >
                {(daily.length - 1 - i) % labelEvery === 0
                  ? `${d.day.slice(8)}/${d.day.slice(5, 7)}`
                  : ""}
              </span>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Meest bekeken pagina's">
        <Table
          head={["Pagina", "Weergaven", "Aandeel"]}
          rows={stats.pages.map((p) => [pageLabel(p.path), nf.format(p.views), pct(p.views)])}
        />
      </Section>

      <Section title="Meest bekeken banen">
        {stats.courses.length === 0 ? (
          <p className="text-sm text-[#8A8270]">Nog geen baanpagina's bekeken.</p>
        ) : (
          <Table
            head={["Baan", "Weergaven"]}
            rows={stats.courses.map((p) => [courseLabel(p.path), nf.format(p.views)])}
          />
        )}
      </Section>

      <Section title="Waar komen bezoekers vandaan">
        <Table
          head={["Bron", "Weergaven", "Aandeel"]}
          rows={stats.sources.map((s) => [
            s.source === "direct"
              ? "Rechtstreeks (geen verwijzer)"
              : s.source === "intern"
                ? "Binnen de site (doorklikken)"
                : s.source,
            nf.format(s.views),
            pct(s.views),
          ])}
        />
        <p className="mt-2 text-xs text-[#8A8270]">
          Een link met <code className="text-[#E8E4D8]">?utm_source=nieuwsbrief</code> verschijnt
          hier als “nieuwsbrief”. Handig voor links in de nieuwsbrief, op Instagram of in de
          podcastbeschrijving.
        </p>
      </Section>

      <div className="grid gap-x-8 lg:grid-cols-2">
        <Section title="Landen">
          <Table
            head={["Land", "Weergaven", "Aandeel"]}
            rows={stats.countries.map((c) => [
              countryName(c.country),
              nf.format(c.views),
              pct(c.views),
            ])}
          />
        </Section>
        <Section title="Toestellen">
          <Table
            head={["Toestel", "Weergaven", "Aandeel"]}
            rows={stats.devices.map((d) => [
              DEVICE_LABEL[d.device] ?? d.device,
              nf.format(d.views),
              pct(d.views),
            ])}
          />
        </Section>
      </div>
    </>
  );
}
