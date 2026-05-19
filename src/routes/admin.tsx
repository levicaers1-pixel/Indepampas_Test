import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { toast, Toaster } from "sonner";

export const Route = createFileRoute("/admin")({
  component: () => (
    <>
      <Toaster richColors position="top-right" />
      <AdminPage />
    </>
  ),
});

type Rating = Tables<"course_ratings">;
type RatingInsert = TablesInsert<"course_ratings">;

const EMAIL_DOMAIN = "indepampas.be";

// Weights from ratingMethodology — sum to 1.0
const CRITERIA_WEIGHTS = {
  c_ontwerp: 0.20,
  c_onderhoud: 0.20,
  c_uitdaging: 0.15,
  c_landschap: 0.15,
  c_faciliteiten: 0.10,
  c_prijs_kwaliteit: 0.10,
  c_gastvrijheid: 0.10,
} as const;

function computeCriteriaScore(c: Pick<RatingInsert,
  "c_ontwerp" | "c_onderhoud" | "c_uitdaging" | "c_landschap"
  | "c_faciliteiten" | "c_prijs_kwaliteit" | "c_gastvrijheid">): number {
  const sum = (Object.keys(CRITERIA_WEIGHTS) as (keyof typeof CRITERIA_WEIGHTS)[])
    .reduce((acc, k) => acc + (Number(c[k]) || 0) * CRITERIA_WEIGHTS[k], 0);
  return Math.round(sum * 10);
}

function computePampasScore(
  c: Parameters<typeof computeCriteriaScore>[0],
  hosts: Pick<RatingInsert, "host_lars" | "host_levi" | "host_niels">
): number {
  const criteria = computeCriteriaScore(c);
  const avg = (criteria + (Number(hosts.host_lars) || 0) + (Number(hosts.host_levi) || 0) + (Number(hosts.host_niels) || 0)) / 4;
  return Math.round(avg);
}

function deriveFeeBand(greenfee: number): string {
  if (greenfee >= 120) return "€€€€";
  if (greenfee >= 90) return "€€€";
  if (greenfee >= 60) return "€€";
  return "€";
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const EMPTY: RatingInsert = {
  slug: "",
  rank: 0,
  name: "",
  region: "",
  type: "",
  greenfee: 0,
  fee_band: "€",
  played_on: null,
  c_ontwerp: 0,
  c_onderhoud: 0,
  c_uitdaging: 0,
  c_landschap: 0,
  c_faciliteiten: 0,
  c_prijs_kwaliteit: 0,
  c_gastvrijheid: 0,
  host_lars: 0,
  host_levi: 0,
  host_niels: 0,
  pampas_score: 0,
  verdict: "",
  notes: "",
  findings: [],
};

// After insert/update, re-rank all rows by pampas_score desc (ties → name asc).
async function recomputeRanks() {
  const { data, error } = await supabase
    .from("course_ratings")
    .select("id, pampas_score, name, rank");
  if (error || !data) return;
  const sorted = [...data].sort(
    (a, b) => b.pampas_score - a.pampas_score || a.name.localeCompare(b.name)
  );
  await Promise.all(
    sorted.map((row, i) => {
      const newRank = i + 1;
      if (row.rank === newRank) return Promise.resolve();
      return supabase.from("course_ratings").update({ rank: newRank }).eq("id", row.id);
    })
  );
}


function AdminPage() {
  const [session, setSession] = useState<unknown>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s?.user) checkAdmin(s.user.id);
      else { setIsAdmin(false); setChecking(false); }
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) checkAdmin(s.user.id);
      else setChecking(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function checkAdmin(userId: string) {
    setChecking(true);
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    setIsAdmin(!!data);
    setChecking(false);
  }

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center font-rb-sans text-[#7A7260]">Even geduld…</div>;
  }

  if (!session) return <LoginForm />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center bg-[#F4EFE5]">
        <p className="font-rb-serif text-2xl text-[#1C3D2A]">Geen toegang.</p>
        <button
          onClick={() => supabase.auth.signOut()}
          className="font-rb-mono text-[0.65rem] tracking-[0.15em] uppercase text-[#3D7A52] underline"
        >
          Uitloggen
        </button>
      </div>
    );
  }

  return <AdminDashboard />;
}

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const email = username.includes("@")
      ? username
      : `${username.toLowerCase()}@${EMAIL_DOMAIN}`;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast.error("Login mislukt: " + error.message);
  }

  return (
    <div className="min-h-screen bg-[#F4EFE5] flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white border border-[rgba(28,61,42,0.15)] p-8 space-y-6"
      >
        <div>
          <p className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#7A7260] mb-2">
            Beheer
          </p>
          <h1 className="font-rb-serif text-3xl text-[#1C3D2A]">Admin login</h1>
        </div>
        <div className="space-y-2">
          <label className="font-rb-mono text-[0.6rem] tracking-[0.15em] uppercase text-[#1C3D2A]">
            Gebruikersnaam
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
            className="w-full border border-[rgba(28,61,42,0.25)] px-3 py-2 font-rb-sans text-sm bg-[#FAF8F2] focus:outline-none focus:border-[#1C3D2A]"
          />
        </div>
        <div className="space-y-2">
          <label className="font-rb-mono text-[0.6rem] tracking-[0.15em] uppercase text-[#1C3D2A]">
            Wachtwoord
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="w-full border border-[rgba(28,61,42,0.25)] px-3 py-2 font-rb-sans text-sm bg-[#FAF8F2] focus:outline-none focus:border-[#1C3D2A]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1C3D2A] text-[#F4EFE5] py-3 font-rb-mono text-[0.65rem] tracking-[0.2em] uppercase hover:bg-[#3D7A52] transition-colors disabled:opacity-50"
        >
          {loading ? "Bezig…" : "Inloggen"}
        </button>
      </form>
    </div>
  );
}

function AdminDashboard() {
  const [items, setItems] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Rating | "new" | null>(null);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("course_ratings")
      .select("*")
      .order("rank", { ascending: true });
    if (error) toast.error(error.message);
    setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm("Verwijderen?")) return;
    const { error } = await supabase.from("course_ratings").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Verwijderd");
    load();
  }

  return (
    <div className="min-h-screen bg-[#F4EFE5]">
      <header className="border-b border-[rgba(28,61,42,0.15)] px-6 lg:px-14 py-6 flex items-center justify-between bg-white">
        <div>
          <p className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#7A7260]">
            Beheer
          </p>
          <h1 className="font-rb-serif text-2xl text-[#1C3D2A]">Course Ratings</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setEditing("new")}
            className="bg-[#1C3D2A] text-[#F4EFE5] px-4 py-2 font-rb-mono text-[0.6rem] tracking-[0.15em] uppercase hover:bg-[#3D7A52]"
          >
            + Nieuw
          </button>
          <button
            onClick={() => supabase.auth.signOut()}
            className="border border-[rgba(28,61,42,0.25)] px-4 py-2 font-rb-mono text-[0.6rem] tracking-[0.15em] uppercase text-[#1C3D2A] hover:bg-[#1C3D2A] hover:text-[#F4EFE5]"
          >
            Uitloggen
          </button>
        </div>
      </header>

      <div className="px-6 lg:px-14 py-10">
        {loading ? (
          <p className="font-rb-sans text-[#7A7260]">Laden…</p>
        ) : (
          <div className="overflow-x-auto border border-[rgba(28,61,42,0.15)] bg-white">
            <table className="w-full border-collapse text-left min-w-[760px]">
              <thead className="bg-[#1C3D2A] text-[#F4EFE5]">
                <tr>
                  {["#", "Parcours", "Regio", "Score", "Verdict", ""].map((h) => (
                    <th key={h} className="px-4 py-3 font-rb-mono text-[0.55rem] tracking-[0.15em] uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((r) => (
                  <tr key={r.id} className="border-t border-[rgba(28,61,42,0.12)]">
                    <td className="px-4 py-3 font-rb-mono text-[0.7rem] text-[#7A7260]">{r.rank}</td>
                    <td className="px-4 py-3 font-rb-serif text-[1rem] text-[#1C3D2A]">{r.name}</td>
                    <td className="px-4 py-3 font-rb-sans text-[0.85rem]">{r.region}</td>
                    <td className="px-4 py-3 font-rb-serif text-[1.2rem] text-[#1C3D2A]">{r.pampas_score}</td>
                    <td className="px-4 py-3 font-rb-mono text-[0.6rem] tracking-[0.1em] uppercase">{r.verdict}</td>
                    <td className="px-4 py-3 text-right space-x-3">
                      <button
                        onClick={() => setEditing(r)}
                        className="font-rb-mono text-[0.6rem] tracking-[0.15em] uppercase text-[#3D7A52] hover:text-[#1C3D2A]"
                      >
                        Bewerk
                      </button>
                      <button
                        onClick={() => remove(r.id)}
                        className="font-rb-mono text-[0.6rem] tracking-[0.15em] uppercase text-red-700 hover:text-red-900"
                      >
                        Wis
                      </button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center font-rb-sans text-[#7A7260]">Nog geen ratings.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <EditDrawer
          initial={editing === "new" ? EMPTY : editing}
          isNew={editing === "new"}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

function EditDrawer({
  initial, isNew, onClose, onSaved,
}: {
  initial: RatingInsert | Rating;
  isNew: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<RatingInsert>({ ...(initial as RatingInsert) });
  const [findingsText, setFindingsText] = useState(
    Array.isArray(initial.findings) ? (initial.findings as string[]).join("\n") : ""
  );
  const [saving, setSaving] = useState(false);

  function set<K extends keyof RatingInsert>(k: K, v: RatingInsert[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  const pampasScore = computePampasScore(form);
  const feeBand = deriveFeeBand(Number(form.greenfee) || 0);
  const slug = form.slug?.trim() || slugify(form.name ?? "");

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!form.name?.trim()) return toast.error("Naam is verplicht");
    setSaving(true);
    const payload: RatingInsert = {
      ...form,
      slug,
      fee_band: feeBand,
      pampas_score: pampasScore,
      findings: findingsText.split("\n").map((s) => s.trim()).filter(Boolean),
      played_on: form.played_on || null,
      // rank gets recomputed below; insert with a sentinel value
      rank: isNew ? 9999 : (initial as Rating).rank,
    };
    let error;
    if (isNew) {
      ({ error } = await supabase.from("course_ratings").insert(payload));
    } else {
      ({ error } = await supabase
        .from("course_ratings")
        .update(payload)
        .eq("id", (initial as Rating).id));
    }
    if (error) {
      setSaving(false);
      return toast.error(error.message);
    }
    await recomputeRanks();
    setSaving(false);
    toast.success("Opgeslagen");
    onSaved();
  }


  const num = (k: keyof RatingInsert) => (
    <input
      type="number"
      value={(form[k] as number) ?? 0}
      onChange={(e) => set(k, Number(e.target.value) as RatingInsert[typeof k])}
      className="w-full border border-[rgba(28,61,42,0.25)] px-2 py-1 font-rb-mono text-sm bg-white"
    />
  );

  const txt = (k: keyof RatingInsert) => (
    <input
      value={(form[k] as string) ?? ""}
      onChange={(e) => set(k, e.target.value as RatingInsert[typeof k])}
      className="w-full border border-[rgba(28,61,42,0.25)] px-2 py-1 font-rb-sans text-sm bg-white"
    />
  );

  const label = (s: string) => (
    <label className="font-rb-mono text-[0.55rem] tracking-[0.15em] uppercase text-[#7A7260]">{s}</label>
  );

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-end" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={save}
        className="w-full max-w-2xl bg-[#F4EFE5] h-full overflow-y-auto p-8 space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-rb-serif text-2xl text-[#1C3D2A]">
            {isNew ? "Nieuwe rating" : "Bewerk rating"}
          </h2>
          <button type="button" onClick={onClose} className="font-rb-mono text-[0.6rem] uppercase text-[#7A7260]">Sluit</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">{label("Naam")}{txt("name")}</div>
          <div>{label("Regio")}{txt("region")}</div>
          <div>{label("Type (bv. Heide, Parkland)")}{txt("type")}</div>
          <div>{label("Greenfee €")}{num("greenfee")}</div>
          <div>{label("Played on (dd/mm/jjjj)")}{txt("played_on")}</div>
          <div className="col-span-2">{label("Verdict (bv. Altijd, Oui, Nooit)")}{txt("verdict")}</div>
        </div>

        <div className="grid grid-cols-3 gap-3 bg-white/60 border border-[rgba(28,61,42,0.15)] p-3">
          <div>
            {label("Slug (auto)")}
            <div className="font-rb-mono text-xs text-[#1C3D2A] py-1 truncate">{slug || "—"}</div>
          </div>
          <div>
            {label("Fee band (auto)")}
            <div className="font-rb-mono text-xs text-[#1C3D2A] py-1">{feeBand}</div>
          </div>
          <div>
            {label("Rank (auto na opslaan)")}
            <div className="font-rb-mono text-xs text-[#7A7260] py-1">
              {isNew ? "—" : `#${(initial as Rating).rank}`}
            </div>
          </div>
        </div>

        <div>
          <p className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#1C3D2A] mb-2">
            Criteria /10 — bepalen automatisch de PAMPAS Score
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Ontwerp (20%)", "c_ontwerp"],
              ["Onderhoud (20%)", "c_onderhoud"],
              ["Uitdaging (15%)", "c_uitdaging"],
              ["Landschap (15%)", "c_landschap"],
              ["Faciliteiten (10%)", "c_faciliteiten"],
              ["Prijs/Kwaliteit (10%)", "c_prijs_kwaliteit"],
              ["Gastvrijheid (10%)", "c_gastvrijheid"],
            ].map(([l, k]) => (
              <div key={k}>{label(l)}{num(k as keyof RatingInsert)}</div>
            ))}
          </div>
        </div>

        <div>
          <p className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase text-[#1C3D2A] mb-2">Host scores /100</p>
          <div className="grid grid-cols-3 gap-3">
            <div>{label("Lars")}{num("host_lars")}</div>
            <div>{label("Levi")}{num("host_levi")}</div>
            <div>{label("Niels")}{num("host_niels")}</div>
          </div>
        </div>

        <div className="bg-[#1C3D2A] text-[#F4EFE5] p-4 flex items-baseline justify-between">
          <span className="font-rb-mono text-[0.6rem] tracking-[0.2em] uppercase">
            PAMPAS Score (auto)
          </span>
          <span className="font-rb-serif text-3xl">
            {pampasScore}
            <span className="font-rb-mono text-[0.55rem] tracking-[0.15em] uppercase ml-1 opacity-70">/100</span>
          </span>
        </div>


        <div>
          {label("Notes")}
          <textarea
            value={form.notes ?? ""}
            onChange={(e) => set("notes", e.target.value)}
            rows={3}
            className="w-full border border-[rgba(28,61,42,0.25)] px-2 py-1 font-rb-sans text-sm bg-white"
          />
        </div>

        <div>
          {label("Findings (één per regel)")}
          <textarea
            value={findingsText}
            onChange={(e) => setFindingsText(e.target.value)}
            rows={6}
            className="w-full border border-[rgba(28,61,42,0.25)] px-2 py-1 font-rb-sans text-sm bg-white"
          />
        </div>

        <div className="flex gap-3 pt-4 border-t border-[rgba(28,61,42,0.15)]">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#1C3D2A] text-[#F4EFE5] px-6 py-3 font-rb-mono text-[0.65rem] tracking-[0.2em] uppercase hover:bg-[#3D7A52] disabled:opacity-50"
          >
            {saving ? "Bezig…" : "Opslaan"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="border border-[rgba(28,61,42,0.25)] px-6 py-3 font-rb-mono text-[0.65rem] tracking-[0.2em] uppercase text-[#1C3D2A]"
          >
            Annuleer
          </button>
        </div>
      </form>
    </div>
  );
}
