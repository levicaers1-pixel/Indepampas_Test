import { Outlet, createFileRoute, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { toast, Toaster } from "sonner";
import { CRITERIA, HOSTS, type HostName, type CriterionKey } from "@/data/personas";
import { getVerifiedAdminUser } from "@/lib/adminAuth";
import { episodes as staticEpisodes } from "@/data/episodes";
import { fetchSpotifyShowEpisodes } from "@/lib/spotify.functions";
import { downloadInstagramFrontpage, downloadInstagramFrontpageForCourse } from "@/lib/instagramFrontpage";

const PAMPAS_SHOW_ID = "37wE4nKPeQNjYLYoMFelLP";

export const Route = createFileRoute("/admin")({
  component: AdminRoute,
});

function AdminRoute() {
  const location = useLocation();

  if (location.pathname !== "/admin") {
    return <Outlet />;
  }

  return (
    <>
      <Toaster richColors position="top-right" theme="dark" />
      <AdminPage />
    </>
  );
}

type Course = Tables<"courses">;
type Rating = Tables<"ratings">;
type CourseInsert = TablesInsert<"courses">;
type RatingInsert = TablesInsert<"ratings">;

const COUNTRIES = ["België", "Nederland", "Frankrijk", "Luxemburg", "Duitsland", "Verenigd Koninkrijk", "Ierland", "Spanje", "Portugal", "Italië"];
const TYPES = ["Parkland", "Heide", "Inland Links", "Links"];
const RETURN_OPTIONS = ["Altijd", "Ja", "Op invité", "Niet per sé", "Nooit"];

function deriveFee(g: number | null | undefined): string {
  if (g == null) return "—";
  if (g < 60) return "€";
  if (g < 85) return "€€";
  if (g < 120) return "€€€";
  return "€€€€";
}

function computeHostScore(r: Pick<RatingInsert, CriterionKey>): number {
  const sum = CRITERIA.reduce((acc, c) => acc + (Number(r[c.key]) || 0) * c.weight, 0);
  return Math.round(sum * 10 * 10) / 10;
}

const AUTH_CHECK_TIMEOUT_MS = 5000;

function authCheckTimedOut() {
  return new Promise<"timeout">((resolve) => {
    window.setTimeout(() => resolve("timeout"), AUTH_CHECK_TIMEOUT_MS);
  });
}

async function getVerifiedUser() {
  const check = getVerifiedAdminUser().catch(() => null);

  const result = await Promise.race([check, authCheckTimedOut()]);
  if (result === "timeout") return null;
  return result;
}

function AdminPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<"courses" | "ratings" | "shows">("courses");

  useEffect(() => {
    let cancelled = false;

    getVerifiedUser().then((verifiedUser) => {
      if (cancelled) return;
      setUser(verifiedUser);
      setChecking(false);
      if (!verifiedUser) navigate({ to: "/admin/login", replace: true });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUser(null);
        setChecking(false);
        navigate({ to: "/admin/login", replace: true });
      }
    });

    window.setTimeout(() => {
      if (cancelled) return;
      setChecking(false);
    }, AUTH_CHECK_TIMEOUT_MS + 500);

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (checking) {
    return <div className="min-h-screen bg-[#0F0F0E] flex items-center justify-center text-[#8A8270] text-sm">Even geduld…</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0F0F0E] text-[#E8E4D8]">
      <div className="h-[3px] w-full bg-[#BA7517]" />
      <header className="border-b border-[#2A2A26] px-6 lg:px-10 py-5 flex items-center justify-between">
        <div className="flex items-baseline gap-4">
          <span className="font-serif italic text-xl text-[#E8E4D8]">PAMPAS</span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#BA7517]">Beheer</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#8A8270] hidden sm:inline">{user.email}</span>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-[10px] tracking-[0.15em] uppercase border border-[#2A2A26] px-3 py-1.5 hover:border-[#BA7517] hover:text-[#BA7517]"
          >
            Afmelden
          </button>
        </div>
      </header>

      <nav className="border-b border-[#2A2A26] px-6 lg:px-10 flex gap-6">
        {(["courses", "ratings", "shows"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`py-3 text-xs tracking-[0.15em] uppercase border-b-2 transition-colors ${
              tab === t ? "border-[#BA7517] text-[#E8E4D8]" : "border-transparent text-[#8A8270] hover:text-[#E8E4D8]"
            }`}
          >
            {t === "courses" ? "Parcours" : t === "ratings" ? "Beoordelingen" : "Shows"}
          </button>
        ))}
      </nav>

      <main className="px-6 lg:px-10 py-8">
        {tab === "courses" ? <CoursesTab /> : tab === "ratings" ? <RatingsTab /> : <ShowsTab />}
      </main>
    </div>
  );
}

// ============ COURSES TAB ============

function CoursesTab() {
  const [items, setItems] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Course | "new" | null>(null);
  const [countryFilter, setCountryFilter] = useState<string>("Alle");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("courses").select("*").order("name");
    if (error) toast.error(error.message);
    setItems(data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function remove(c: Course) {
    if (!confirm(`Ben je zeker? Dit verwijdert ook alle beoordelingen voor "${c.name}".`)) return;
    await supabase.from("ratings").delete().eq("course_id", c.id);
    const { error } = await supabase.from("courses").delete().eq("id", c.id);
    if (error) return toast.error(error.message);
    toast.success("Verwijderd");
    load();
  }

  const filteredItems = useMemo(() => {
    if (countryFilter === "Alle") return items;
    return items.filter((c) => c.country === countryFilter);
  }, [items, countryFilter]);

  const countryOptions = useMemo(() => {
    const set = new Set(items.map((c) => c.country).filter(Boolean));
    return ["Alle", ...Array.from(set).sort()];
  }, [items]);

  return (
    <>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <h2 className="text-lg font-medium">Parcours ({filteredItems.length})</h2>
        <div className="flex items-center gap-3">
          <Select value={countryFilter} onChange={(v) => setCountryFilter(v)} options={countryOptions} />
          <button onClick={() => setEditing("new")} className="bg-[#BA7517] text-[#0F0F0E] px-4 py-2 text-xs tracking-[0.15em] uppercase font-medium hover:bg-[#A56714]">
            + Parcours
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-[#8A8270]">Laden…</p>
      ) : (
        <div className="border border-[#2A2A26] overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[760px]">
            <thead className="bg-[#1A1A18] text-[#8A8270]">
              <tr>
                {["#", "Naam", "Land", "Regio", "Type", "Greenfee", "Fee", ""].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[10px] tracking-[0.15em] uppercase font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((c, i) => (
                <tr key={c.id} className="border-t border-[#2A2A26]">
                  <td className="px-4 py-3 text-[#8A8270] text-xs">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-[#8A8270]">{c.country}</td>
                  <td className="px-4 py-3 text-[#8A8270]">{c.region ?? "—"}</td>
                  <td className="px-4 py-3 text-[#8A8270]">{c.type ?? "—"}</td>
                  <td className="px-4 py-3 text-[#8A8270]">{c.greenfee != null ? `€${Number(c.greenfee)}` : "—"}</td>
                  <td className="px-4 py-3 text-[#BA7517]">{c.fee_category ?? "—"}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => setEditing(c)} className="text-xs text-[#BA7517] hover:underline">Bewerk</button>
                    <button onClick={() => remove(c)} className="text-xs text-red-400 hover:underline">Wis</button>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-[#8A8270] text-sm">Geen parcours gevonden.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <CourseDrawer
          initial={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}
    </>
  );
}

function CourseDrawer({ initial, onClose, onSaved }: { initial: Course | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<CourseInsert>(
    initial ?? { name: "", country: "België", region: "", type: "Parkland", greenfee: null, holes: 18, website: "", episode_url: "" }
  );
  const [saving, setSaving] = useState(false);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!form.name?.trim()) return toast.error("Naam is verplicht");
    setSaving(true);
    const payload: CourseInsert = {
      ...form,
      greenfee: form.greenfee != null && form.greenfee !== ("" as any) ? Number(form.greenfee) : null,
      holes: Number(form.holes) || 18,
      region: form.region?.trim() || null,
      website: form.website?.trim() || null,
      episode_url: form.episode_url?.trim() || null,
    };
    const { error } = initial
      ? await supabase.from("courses").update(payload).eq("id", initial.id)
      : await supabase.from("courses").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Opgeslagen");
    onSaved();
  }

  return (
    <Drawer title={initial ? "Bewerk parcours" : "Nieuw parcours"} onClose={onClose}>
      <form onSubmit={save} className="space-y-4">
        <Field label="Naam *">
          <Input value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Land">
            <Select value={form.country ?? "België"} onChange={(v) => setForm({ ...form, country: v })} options={COUNTRIES} />
          </Field>
          <Field label="Regio">
            <Input value={form.region ?? ""} onChange={(v) => setForm({ ...form, region: v })} />
          </Field>
          <Field label="Type">
            <Select value={form.type ?? "Parkland"} onChange={(v) => setForm({ ...form, type: v })} options={TYPES} />
          </Field>
          <Field label="Holes">
            <Input type="number" value={String(form.holes ?? 18)} onChange={(v) => setForm({ ...form, holes: Number(v) })} />
          </Field>
          <Field label="Greenfee (EUR)">
            <Input type="number" value={form.greenfee == null ? "" : String(form.greenfee)} onChange={(v) => setForm({ ...form, greenfee: v === "" ? null : Number(v) as any })} />
          </Field>
          <Field label="Fee categorie (auto)">
            <div className="px-3 py-2 text-sm text-[#BA7517]">{deriveFee(form.greenfee as number | null)}</div>
          </Field>
        </div>
        <Field label="Website">
          <Input type="url" value={form.website ?? ""} onChange={(v) => setForm({ ...form, website: v })} placeholder="https://..." />
        </Field>
        <Field label="Episode link (Spotify)">
          <Input type="url" value={form.episode_url ?? ""} onChange={(v) => setForm({ ...form, episode_url: v })} placeholder="https://open.spotify.com/..." />
        </Field>
        <DrawerActions saving={saving} onClose={onClose} />
      </form>
    </Drawer>
  );
}

// ============ RATINGS TAB ============

type CourseWithRatings = Course & { ratings: Rating[] };

function RatingsTab() {
  const [items, setItems] = useState<CourseWithRatings[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{ course: Course; host: HostName; rating: Rating | null } | null>(null);
  const [countryFilter, setCountryFilter] = useState<string>("Alle");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("courses").select("*, ratings(*)").order("name");
    if (error) toast.error(error.message);
    setItems((data ?? []) as CourseWithRatings[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const filteredItems = useMemo(() => {
    if (countryFilter === "Alle") return items;
    return items.filter((c) => c.country === countryFilter);
  }, [items, countryFilter]);

  const countryOptions = useMemo(() => {
    const set = new Set(items.map((c) => c.country).filter(Boolean));
    return ["Alle", ...Array.from(set).sort()];
  }, [items]);

  return (
    <>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <h2 className="text-lg font-medium">Beoordelingen</h2>
        <Select value={countryFilter} onChange={(v) => setCountryFilter(v)} options={countryOptions} />
      </div>
      {loading ? (
        <p className="text-sm text-[#8A8270]">Laden…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-[#8A8270]">Voeg eerst een parcours toe.</p>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((c) => (
            <div key={c.id} className="border border-[#2A2A26] bg-[#1A1A18]">
              <div className="px-4 py-3 border-b border-[#2A2A26] flex items-center justify-between gap-3">
                <div className="flex items-baseline gap-3 min-w-0">
                  <span className="font-medium truncate">{c.name}</span>
                  <span className="text-xs text-[#8A8270] shrink-0">{c.region ?? c.country}</span>
                </div>
                {c.ratings.length > 0 && (
                  <button
                    onClick={() => {
                      downloadInstagramFrontpageForCourse(c, c.ratings).catch((e) => toast.error(e.message));
                    }}
                    className="text-[10px] tracking-[0.15em] uppercase text-[#E8E4D8] border border-[#2A2A26] px-2.5 py-1 hover:border-[#BA7517] hover:text-[#BA7517] shrink-0"
                    title="Download 1080x1080 Instagram frontpage voor de hele baan"
                  >
                    📸 IG · Baan
                  </button>
                )}
              </div>
              <div className="divide-y divide-[#2A2A26]">
                {HOSTS.map((host) => {
                  const r = c.ratings.find((x) => x.host === host) ?? null;
                  return (
                    <div key={host} className="px-4 py-2.5 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <span className="w-14 text-[#8A8270] text-xs tracking-wider uppercase">{host}</span>
                        {r ? (
                          <>
                            <span className="text-[#BA7517] font-medium tabular-nums">{Number(r.host_score).toFixed(1)} / 100</span>
                            <span className="text-xs text-[#8A8270]">
                              {r.played_on ? `Gespeeld: ${new Date(r.played_on).toLocaleDateString("nl-BE")}` : "Geen datum"}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs text-[#5A5448] italic">Geen beoordeling</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {r && (
                          <button
                            onClick={() => {
                              const ratedHosts = c.ratings.map((x) => x.host as HostName);
                              downloadInstagramFrontpage(c, r, ratedHosts).catch((e) => toast.error(e.message));
                            }}
                            className="text-xs text-[#E8E4D8] border border-[#2A2A26] px-2 py-1 hover:border-[#BA7517] hover:text-[#BA7517]"
                            title="Download 1080x1080 Instagram frontpage"
                          >
                            📸 Instagram frontpage
                          </button>
                        )}
                        <button
                          onClick={() => setEditing({ course: c, host, rating: r })}
                          className="text-xs text-[#BA7517] hover:underline"
                        >
                          {r ? "Bewerk" : "+ Beoordeling toevoegen"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <p className="text-sm text-[#8A8270] px-2 py-4">Geen parcours gevonden voor dit land.</p>
          )}
        </div>
      )}

      {editing && (
        <RatingDrawer
          course={editing.course}
          host={editing.host}
          initial={editing.rating}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}
    </>
  );
}

function RatingDrawer({ course, host, initial, onClose, onSaved }: {
  course: Course; host: HostName; initial: Rating | null; onClose: () => void; onSaved: () => void;
}) {
  const [form, setForm] = useState<RatingInsert>(
    initial ?? {
      course_id: course.id,
      host,
      played_on: null,
      score_design: 7, score_condition: 7, score_challenge: 7, score_scenery: 7,
      score_facilities: 7, score_value: 7, score_hospitality: 7,
      hole_of_day: "", would_return: "Ja", one_word: "", review: "",
    }
  );
  const [saving, setSaving] = useState(false);

  const preview = useMemo(() => computeHostScore(form), [form]);

  async function save(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { host_score: _ignored, ...rest } = form as any;
    const payload: RatingInsert = {
      course_id: course.id,
      host,
      played_on: form.played_on || null,
      score_design: Number(rest.score_design),
      score_condition: Number(rest.score_condition),
      score_challenge: Number(rest.score_challenge),
      score_scenery: Number(rest.score_scenery),
      score_facilities: Number(rest.score_facilities),
      score_value: Number(rest.score_value),
      score_hospitality: Number(rest.score_hospitality),
      hole_of_day: form.hole_of_day?.trim() || null,
      one_word: form.one_word?.trim() || null,
      review: form.review?.trim() || null,
      would_return: form.would_return?.trim() || null,
    };
    const { data, error } = initial
      ? await supabase.from("ratings").update(payload).eq("id", initial.id).select("id").maybeSingle()
      : await supabase.from("ratings").insert(payload).select("id").maybeSingle();
    setSaving(false);
    if (error) return toast.error(error.message);
    if (!data) return toast.error("Niet opgeslagen. Meld opnieuw aan met het admin-account.");
    toast.success("Opgeslagen");
    onSaved();
  }

  async function remove() {
    if (!initial) return;
    if (!confirm("Beoordeling verwijderen?")) return;
    const { error } = await supabase.from("ratings").delete().eq("id", initial.id);
    if (error) return toast.error(error.message);
    toast.success("Verwijderd");
    onSaved();
  }

  return (
    <Drawer title={`${initial ? "Bewerk" : "Nieuwe"} beoordeling`} onClose={onClose}>
      <form onSubmit={save} className="space-y-4">
        <div className="bg-[#0F0F0E] border border-[#2A2A26] p-3 text-xs space-y-1">
          <div><span className="text-[#8A8270]">Parcours: </span><span className="text-[#E8E4D8]">{course.name}</span></div>
          <div><span className="text-[#8A8270]">Host: </span><span className="text-[#E8E4D8]">{host}</span></div>
        </div>

        <Field label="Datum gespeeld">
          <Input type="date" value={form.played_on ?? ""} onChange={(v) => setForm({ ...form, played_on: v })} />
        </Field>

        <div className="space-y-2.5 border-t border-[#2A2A26] pt-4">
          <p className="text-[10px] tracking-[0.15em] uppercase text-[#8A8270]">Scores</p>
          {CRITERIA.map((c) => {
            const v = Number(form[c.key]) || 0;
            return (
              <div key={c.key}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#E8E4D8]">{c.label} <span className="text-[#5A5448]">({Math.round(c.weight * 100)}%)</span></span>
                  <span className="text-[#BA7517] tabular-nums">{v.toFixed(1)}</span>
                </div>
                <input
                  type="range" min={1} max={10} step={0.5} value={v}
                  onChange={(e) => setForm({ ...form, [c.key]: Number(e.target.value) })}
                  className="w-full accent-[#BA7517]"
                />
              </div>
            );
          })}
        </div>

        <div className="bg-[#0F0F0E] border border-[#BA7517]/30 p-3 flex items-center justify-between">
          <span className="text-xs tracking-[0.15em] uppercase text-[#8A8270]">PAMPAS Score</span>
          <div className="flex items-center gap-3">
            <div className="w-32 h-2 bg-[#2A2A26]">
              <div className="h-full bg-[#BA7517]" style={{ width: `${Math.min(preview, 100)}%` }} />
            </div>
            <span className="text-[#BA7517] font-medium tabular-nums">{preview.toFixed(1)} / 100</span>
          </div>
        </div>

        <div className="space-y-3 border-t border-[#2A2A26] pt-4">
          <Field label="Hole van de dag">
            <Input value={form.hole_of_day ?? ""} onChange={(v) => setForm({ ...form, hole_of_day: v })} />
          </Field>
          <Field label="Terugkomen?">
            <Select value={form.would_return ?? "Ja"} onChange={(v) => setForm({ ...form, would_return: v })} options={RETURN_OPTIONS} />
          </Field>
          <Field label="Eén woord (max 20)">
            <Input value={form.one_word ?? ""} onChange={(v) => setForm({ ...form, one_word: v.slice(0, 20) })} />
          </Field>
          <Field label="Review / notities">
            <textarea
              value={form.review ?? ""}
              onChange={(e) => setForm({ ...form, review: e.target.value })}
              rows={4}
              className="w-full bg-[#0F0F0E] border border-[#2A2A26] px-3 py-2 text-sm text-[#E8E4D8] focus:outline-none focus:border-[#BA7517]"
            />
          </Field>
        </div>

        <DrawerActions saving={saving} onClose={onClose} />

        {initial && (
          <div className="pt-3 border-t border-[#2A2A26]">
            <button type="button" onClick={remove} className="text-xs text-red-400 hover:underline">
              Beoordeling verwijderen
            </button>
          </div>
        )}
      </form>
    </Drawer>
  );
}

// ============ SHOWS TAB ============

type Candidate = {
  id: string;
  name: string;
  description: string;
  release_date: string;
  duration_ms: number;
  image_url: string | null;
};

function formatDuration(ms: number): string {
  const total = Math.round(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}u ${m}min`;
  if (m > 0) return `${m}min ${s}sec`;
  return `${s}sec`;
}

function formatDate(iso: string): string {
  const [y, mo, d] = iso.split("-");
  if (!y || !mo || !d) return iso;
  return `${d}/${mo}/${y}`;
}

function ShowsTab() {
  const fetchEpisodes = useServerFn(fetchSpotifyShowEpisodes);
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [existingIds, setExistingIds] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<Candidate | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadExisting() {
    const dbIds = new Set<string>(staticEpisodes.map((e) => e.spotifyId));
    const { data } = await supabase.from("episodes").select("spotify_id");
    (data ?? []).forEach((row: { spotify_id: string }) => dbIds.add(row.spotify_id));
    setExistingIds(dbIds);
    return dbIds;
  }

  async function checkSpotify() {
    setLoading(true);
    setError(null);
    try {
      const known = await loadExisting();
      const res = await fetchEpisodes({ data: { showId: PAMPAS_SHOW_ID, limit: 50 } });
      const fresh = res.episodes
        .filter((e) => !known.has(e.id))
        .sort((a, b) => Date.parse(b.release_date) - Date.parse(a.release_date));
      setCandidates(fresh);
      if (fresh.length === 0) toast.success("Geen nieuwe afleveringen gevonden.");
      else toast.success(`${fresh.length} nieuwe aflevering(en) gevonden.`);
    } catch (e: any) {
      const msg = e?.message ?? "Onbekende fout";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadExisting(); }, []);

  return (
    <>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <div>
          <h2 className="text-lg font-medium">Spotify Shows</h2>
          <p className="text-xs text-[#8A8270] mt-1">
            Controleert <a href={`https://open.spotify.com/show/${PAMPAS_SHOW_ID}`} target="_blank" rel="noreferrer" className="text-[#BA7517] hover:underline">de PAMPAS show</a> op nieuwe afleveringen.
          </p>
        </div>
        <button
          onClick={checkSpotify}
          disabled={loading}
          className="bg-[#BA7517] text-[#0F0F0E] px-4 py-2 text-xs tracking-[0.15em] uppercase font-medium hover:bg-[#A56714] disabled:opacity-50"
        >
          {loading ? "Bezig…" : "Check Spotify"}
        </button>
      </div>

      {error && (
        <div className="border border-red-500/40 bg-red-500/10 text-red-300 text-xs px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {candidates.length === 0 && !loading && (
        <p className="text-sm text-[#8A8270]">
          Klik op "Check Spotify" om te zoeken naar nieuwe afleveringen die nog niet op de site staan.
          <br />
          Al bekende afleveringen: <span className="text-[#BA7517]">{existingIds.size}</span>.
        </p>
      )}

      <div className="space-y-3">
        {candidates.map((c) => (
          <div key={c.id} className="border border-[#2A2A26] bg-[#1A1A18] p-4 flex gap-4">
            {c.image_url && (
              <img src={c.image_url} alt="" className="w-20 h-20 object-cover flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <h3 className="font-medium text-[#E8E4D8] truncate">{c.name}</h3>
                <span className="text-[10px] tracking-[0.15em] uppercase text-[#8A8270] flex-shrink-0">
                  {formatDate(c.release_date)} · {formatDuration(c.duration_ms)}
                </span>
              </div>
              <p className="text-xs text-[#8A8270] line-clamp-2 mb-3">{c.description}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setEditing(c)}
                  className="bg-[#BA7517] text-[#0F0F0E] px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase font-medium hover:bg-[#A56714]"
                >
                  + Toevoegen
                </button>
                <a
                  href={`https://open.spotify.com/episode/${c.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] tracking-[0.15em] uppercase text-[#8A8270] hover:text-[#BA7517] self-center"
                >
                  Open op Spotify ↗
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <AddEpisodeDrawer
          candidate={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setCandidates((prev) => prev.filter((c) => c.id !== editing.id));
            setExistingIds((prev) => new Set(prev).add(editing.id));
            setEditing(null);
          }}
        />
      )}
    </>
  );
}

function AddEpisodeDrawer({ candidate, onClose, onSaved }: {
  candidate: Candidate; onClose: () => void; onSaved: () => void;
}) {
  // Try to guess episode number from title like "#10 ..." or "#Bonus ..."
  const guessedNumber = (() => {
    const m = candidate.name.match(/#?\s*(Bonus|Halfway|\d{1,3})/i);
    return m ? m[1] : "";
  })();

  const [form, setForm] = useState({
    spotify_id: candidate.id,
    number: guessedNumber,
    season: "S01",
    title: candidate.name,
    description: candidate.description,
    date: formatDate(candidate.release_date),
    duration: formatDuration(candidate.duration_ms),
    topics: "Golf",
    image_url: candidate.image_url ?? "",
    release_date: candidate.release_date,
  });
  const [saving, setSaving] = useState(false);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!form.number.trim() || !form.title.trim()) {
      return toast.error("Nummer en titel zijn verplicht");
    }
    setSaving(true);
    const payload = {
      spotify_id: form.spotify_id,
      number: form.number.trim(),
      season: form.season.trim() || "S01",
      title: form.title.trim(),
      description: form.description.trim(),
      date: form.date.trim(),
      duration: form.duration.trim(),
      topics: form.topics.split(",").map((t) => t.trim()).filter(Boolean),
      image_url: form.image_url.trim() || null,
      release_date: form.release_date ? new Date(form.release_date).toISOString() : null,
    };
    const { error } = await supabase.from("episodes").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Aflevering toegevoegd");
    onSaved();
  }

  return (
    <Drawer title="Nieuwe aflevering toevoegen" onClose={onClose}>
      <form onSubmit={save} className="space-y-4">
        <div className="bg-[#0F0F0E] border border-[#2A2A26] p-3 text-xs">
          <div className="text-[#8A8270]">Spotify ID</div>
          <div className="text-[#E8E4D8] font-mono">{form.spotify_id}</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nummer *">
            <Input value={form.number} onChange={(v) => setForm({ ...form, number: v })} required placeholder="bv. 10 of Bonus" />
          </Field>
          <Field label="Seizoen">
            <Input value={form.season} onChange={(v) => setForm({ ...form, season: v })} />
          </Field>
        </div>
        <Field label="Titel *">
          <Input value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
        </Field>
        <Field label="Beschrijving">
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={6}
            className="w-full bg-[#0F0F0E] border border-[#2A2A26] px-3 py-2 text-sm text-[#E8E4D8] focus:outline-none focus:border-[#BA7517]"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Datum (DD/MM/JJJJ)">
            <Input value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
          </Field>
          <Field label="Duur">
            <Input value={form.duration} onChange={(v) => setForm({ ...form, duration: v })} />
          </Field>
        </div>
        <Field label="Topics (komma-gescheiden)">
          <Input value={form.topics} onChange={(v) => setForm({ ...form, topics: v })} placeholder="Golf, Soudal Open, …" />
        </Field>
        <DrawerActions saving={saving} onClose={onClose} />
      </form>
    </Drawer>
  );
}

// ============ SHARED UI ============

function Drawer({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-end" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-[#1A1A18] border-l border-[#2A2A26] h-full overflow-y-auto"
      >
        <div className="h-[3px] bg-[#BA7517]" />
        <div className="px-6 py-5 border-b border-[#2A2A26] flex items-center justify-between sticky top-0 bg-[#1A1A18] z-10">
          <h3 className="font-medium text-[#E8E4D8]">{title}</h3>
          <button onClick={onClose} className="text-[10px] tracking-[0.15em] uppercase text-[#8A8270] hover:text-[#E8E4D8]">Sluit</button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function DrawerActions({ saving, onClose }: { saving: boolean; onClose: () => void }) {
  return (
    <div className="flex gap-3 pt-2">
      <button
        type="submit"
        disabled={saving}
        className="bg-[#BA7517] text-[#0F0F0E] px-5 py-2.5 text-xs tracking-[0.15em] uppercase font-medium hover:bg-[#A56714] disabled:opacity-50"
      >
        {saving ? "Bezig…" : "Opslaan"}
      </button>
      <button
        type="button"
        onClick={onClose}
        className="border border-[#2A2A26] text-[#E8E4D8] px-5 py-2.5 text-xs tracking-[0.15em] uppercase hover:border-[#BA7517]"
      >
        Annuleer
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] tracking-[0.15em] uppercase text-[#8A8270]">{label}</label>
      {children}
    </div>
  );
}

function Input(props: {
  value: string; onChange: (v: string) => void; type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <input
      type={props.type ?? "text"}
      value={props.value}
      required={props.required}
      placeholder={props.placeholder}
      onChange={(e) => props.onChange(e.target.value)}
      className="w-full bg-[#0F0F0E] border border-[#2A2A26] px-3 py-2 text-sm text-[#E8E4D8] focus:outline-none focus:border-[#BA7517]"
    />
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#0F0F0E] border border-[#2A2A26] px-3 py-2 text-sm text-[#E8E4D8] focus:outline-none focus:border-[#BA7517]"
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
