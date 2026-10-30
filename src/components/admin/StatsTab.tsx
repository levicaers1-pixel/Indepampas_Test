import { useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type VoteRow = { course_id: string; score: number; created_at: string; updated_at: string };
type CourseRow = {
  id: string;
  name: string;
  country: string;
  region: string | null;
  ratings: { host_score: number | string | null }[];
};
type DogRow = { course_id: string; status: string; host_confirmed: boolean; votes_total: number };
type VoterStats = {
  total_votes: number;
  voters: number;
  voters_2plus: number;
  voters_5plus: number;
  voters_multi_week: number;
  max_votes_per_voter: number;
  weekly: { week: string; votes: number; voters: number }[];
  dog_votes: number;
  dog_voters: number;
};

const PAGE = 1000;
const WEEKS_SHOWN = 16;
const DAY_MS = 86_400_000;

/** All votes, paged: the API returns at most 1000 rows per request. */
async function fetchAllVotes(): Promise<VoteRow[]> {
  const rows: VoteRow[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("community_votes")
      .select("course_id,score,created_at,updated_at")
      .order("created_at", { ascending: true })
      .order("id", { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE) break;
  }
  return rows;
}

/** Monday 00:00 UTC of the week a date falls in, as YYYY-MM-DD (same as date_trunc('week') in the database). */
function weekStart(d: Date): string {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  x.setUTCDate(x.getUTCDate() - ((x.getUTCDay() + 6) % 7));
  return x.toISOString().slice(0, 10);
}

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const fmt = (n: number | null, digits = 1) => (n == null ? "—" : n.toFixed(digits).replace(".", ","));

function Card({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="border border-[#2A2A26] bg-[#1A1A18] p-4">
      <div className="text-[10px] uppercase tracking-[0.15em] text-[#8A8270]">{label}</div>
      <div className="mt-1 text-2xl text-[#E8E4D8]">{value}</div>
      {hint && <div className="mt-1 text-xs text-[#8A8270]">{hint}</div>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h3 className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[#BA7517]">{title}</h3>
      {children}
    </section>
  );
}

function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto border border-[#2A2A26]">
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead className="bg-[#1A1A18] text-[#8A8270]">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-2.5 text-[10px] font-normal uppercase tracking-[0.15em]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-[#2A2A26]">
              {r.map((c, j) => (
                <td key={j} className={`px-4 py-2.5 ${j === 0 ? "" : "text-[#8A8270]"}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatsTab() {
  const [votes, setVotes] = useState<VoteRow[] | null>(null);
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [dog, setDog] = useState<DogRow[]>([]);
  const [voterStats, setVoterStats] = useState<VoterStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [v, c, d, s] = await Promise.all([
          fetchAllVotes(),
          supabase.from("courses").select("id,name,country,region,ratings(host_score)").order("name"),
          supabase.rpc("get_dog_status"),
          supabase.rpc("admin_vote_stats"),
        ]);
        if (!active) return;
        if (c.error) throw new Error(c.error.message);
        setVotes(v);
        setCourses((c.data ?? []) as CourseRow[]);
        setDog((d.data ?? []) as DogRow[]);
        // Voter-level numbers need the admin_vote_stats() database function; without it the block explains itself.
        setVoterStats(s.error ? null : (s.data as unknown as VoterStats));
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Laden mislukt");
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    if (!votes) return null;
    const now = Date.now();
    const byCourse = new Map<string, number[]>();
    for (const v of votes) {
      const list = byCourse.get(v.course_id) ?? [];
      list.push(v.score);
      byCourse.set(v.course_id, list);
    }
    const known = courses.filter((c) => byCourse.has(c.id));
    const hostAvg = (c: CourseRow) =>
      avg(c.ratings.map((r) => Number(r.host_score)).filter((n) => Number.isFinite(n)));

    const perCourse = courses
      .map((c) => {
        const scores = byCourse.get(c.id) ?? [];
        return { c, n: scores.length, community: avg(scores), host: hostAvg(c) };
      })
      .filter((x) => x.n > 0);

    const regions = new Map<string, { country: string; region: string; votes: number; courses: number; covered: number; total: number }>();
    for (const c of courses) {
      const key = `${c.country}|${c.region ?? ""}`;
      const row = regions.get(key) ?? { country: c.country, region: c.region ?? "—", votes: 0, courses: 0, covered: 0, total: 0 };
      const n = byCourse.get(c.id)?.length ?? 0;
      row.total += 1;
      row.votes += n;
      if (n > 0) row.courses += 1;
      if (n >= 5) row.covered += 1;
      regions.set(key, row);
    }

    const weeks: { week: string; votes: number }[] = [];
    const counts = new Map<string, number>();
    for (const v of votes) {
      const w = weekStart(new Date(v.created_at));
      counts.set(w, (counts.get(w) ?? 0) + 1);
    }
    const thisWeek = new Date(`${weekStart(new Date())}T00:00:00Z`).getTime();
    for (let i = WEEKS_SHOWN - 1; i >= 0; i--) {
      const w = new Date(thisWeek - i * 7 * DAY_MS).toISOString().slice(0, 10);
      weeks.push({ week: w, votes: counts.get(w) ?? 0 });
    }

    return {
      total: votes.length,
      last7: votes.filter((v) => now - Date.parse(v.created_at) <= 7 * DAY_MS).length,
      last30: votes.filter((v) => now - Date.parse(v.created_at) <= 30 * DAY_MS).length,
      edited: votes.filter((v) => v.updated_at !== v.created_at).length,
      withVotes: known.length,
      coverage5: perCourse.filter((x) => x.n >= 5).length,
      top: [...perCourse].sort((a, b) => b.n - a.n).slice(0, 10),
      gaps: perCourse
        .filter((x) => x.n >= 3 && x.host != null && x.community != null)
        .map((x) => ({ ...x, gap: (x.community as number) - (x.host as number) }))
        .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap))
        .slice(0, 5),
      regions: [...regions.values()].sort((a, b) => b.votes - a.votes).slice(0, 15),
      weeks,
      maxWeek: Math.max(1, ...weeks.map((w) => w.votes)),
    };
  }, [votes, courses]);

  if (error) return <p className="text-sm text-red-400">{error}</p>;
  if (!stats) return <p className="text-sm text-[#8A8270]">Laden…</p>;

  const voterWeeks = new Map((voterStats?.weekly ?? []).map((w) => [w.week, w.voters]));
  const dogWithVotes = dog.filter((d) => d.votes_total > 0).length;
  const dogCertified = dog.filter((d) => d.status === "course").length;
  const dogHost = dog.filter((d) => d.host_confirmed).length;
  const dogVotes = dog.reduce((s, d) => s + d.votes_total, 0);
  const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)}%` : "—");

  return (
    <>
      <h2 className="text-lg font-medium">Statistieken community-stemmen</h2>
      <p className="mt-1 text-xs text-[#8A8270]">
        Stemmen tellen vanaf de lancering op 9 augustus. Alles is geaggregeerd; er staan geen persoonsgegevens in.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card label="Stemmen totaal" value={stats.total} hint={`${stats.edited} later aangepast (${pct(stats.edited, stats.total)})`} />
        <Card label="Laatste 7 dagen" value={stats.last7} hint={`${stats.last30} in de laatste 30 dagen`} />
        <Card
          label="Banen met stemmen"
          value={`${stats.withVotes} / ${courses.length}`}
          hint={`${fmt(stats.withVotes ? stats.total / stats.withVotes : null)} stemmen per baan met stemmen`}
        />
        <Card
          label="Dekking (min. 5 stemmen)"
          value={`${stats.coverage5} / ${courses.length}`}
          hint={`${pct(stats.coverage5, courses.length)} van de banen heeft een bruikbare score`}
        />
      </div>

      <Section title="Verbondenheid (unieke stemmers)">
        {voterStats ? (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Card label="Unieke stemmers" value={voterStats.voters} hint="Per browser, geen echte personen" />
            <Card
              label="Stemmen op 2+ banen"
              value={voterStats.voters_2plus}
              hint={`${pct(voterStats.voters_2plus, voterStats.voters)} van de stemmers`}
            />
            <Card
              label="Stemmen op 5+ banen"
              value={voterStats.voters_5plus}
              hint={`Meest actieve stemmer: ${voterStats.max_votes_per_voter}`}
            />
            <Card
              label="Terugkerend"
              value={voterStats.voters_multi_week}
              hint={`${pct(voterStats.voters_multi_week, voterStats.voters)} stemde in 2+ verschillende weken`}
            />
          </div>
        ) : (
          <p className="border border-dashed border-[#2A2A26] p-4 text-sm text-[#8A8270]">
            Deze cijfers (unieke stemmers, terugkerende stemmers) ontbreken nog: het voter-id is bewust niet leesbaar vanuit
            de browser. Ze verschijnen zodra de databasefunctie <code className="text-[#E8E4D8]">admin_vote_stats</code> bestaat.
          </p>
        )}
      </Section>

      <Section title={`Stemmen per week (laatste ${WEEKS_SHOWN} weken)`}>
        <div className="border border-[#2A2A26] bg-[#1A1A18] p-4">
          <div className="flex h-40 items-end gap-1.5">
            {stats.weeks.map((w) => (
              <div key={w.week} className="flex h-full flex-1 flex-col items-center justify-end" title={`Week van ${w.week}: ${w.votes} stemmen${voterWeeks.has(w.week) ? `, ${voterWeeks.get(w.week)} stemmers` : ""}`}>
                <span className="mb-1 text-[10px] text-[#8A8270]">{w.votes || ""}</span>
                <div className="w-full bg-[#BA7517]" style={{ height: `${(w.votes / stats.maxWeek) * 100}%`, minHeight: w.votes ? 2 : 0 }} />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-1.5">
            {stats.weeks.map((w) => (
              <span key={w.week} className="flex-1 text-center text-[9px] text-[#8A8270]">
                {w.week.slice(8)}/{w.week.slice(5, 7)}
              </span>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Meest gestemde banen">
        <Table
          head={["Baan", "Stemmen", "Community", "Hosts"]}
          rows={stats.top.map((x) => [x.c.name, x.n, fmt(x.community), fmt(x.host)])}
        />
      </Section>

      <Section title="Grootste verschil tussen community en hosts (min. 3 stemmen)">
        {stats.gaps.length === 0 ? (
          <p className="text-sm text-[#8A8270]">Nog te weinig stemmen per baan.</p>
        ) : (
          <Table
            head={["Baan", "Stemmen", "Community", "Hosts", "Verschil"]}
            rows={stats.gaps.map((x) => [x.c.name, x.n, fmt(x.community), fmt(x.host), `${x.gap > 0 ? "+" : ""}${fmt(x.gap)}`])}
          />
        )}
      </Section>

      <Section title="Per regio">
        <Table
          head={["Land", "Regio", "Stemmen", "Banen met stem", "Min. 5 stemmen", "Banen"]}
          rows={stats.regions.map((r) => [r.country, r.region, r.votes, r.courses, r.covered, r.total])}
        />
      </Section>

      <Section title="Hondvriendelijk-pootje">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Card label="Stemmen" value={dogVotes} hint={voterStats ? `${voterStats.dog_voters} unieke IP's` : "Eén per bezoeker per baan"} />
          <Card label="Banen met stemmen" value={dogWithVotes} />
          <Card label="Gecertificeerd (pootje)" value={dogCertified} hint="Door stemmen of door PAMPAS" />
          <Card label="Beslist door PAMPAS" value={dogHost} />
        </div>
      </Section>
    </>
  );
}
