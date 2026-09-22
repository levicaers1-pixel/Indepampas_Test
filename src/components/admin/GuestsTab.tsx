import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";

type Guest = Tables<"guests">;
type EpisodeOption = { id: string; number: string; title: string };

export function GuestsTab() {
  const [items, setItems] = useState<Guest[]>([]);
  const [episodes, setEpisodes] = useState<EpisodeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Guest | "new" | null>(null);

  async function load() {
    setLoading(true);
    const [{ data, error }, eps] = await Promise.all([
      supabase.from("guests").select("*").order("sort_order", { ascending: true }),
      supabase.from("episodes").select("id,number,title").order("release_date", { ascending: false }),
    ]);
    if (error) toast.error(error.message);
    setItems(data ?? []);
    setEpisodes((eps.data as EpisodeOption[]) ?? []);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function remove(g: Guest) {
    if (!confirm(`Gast "${g.name}" verwijderen?`)) return;
    if (g.storage_path) {
      await supabase.storage.from("guests").remove([g.storage_path]);
    }
    const { error } = await supabase.from("guests").delete().eq("id", g.id);
    if (error) return toast.error(error.message);
    toast.success("Verwijderd");
    load();
  }

  async function toggleActive(g: Guest) {
    const { error } = await supabase.from("guests").update({ active: !g.active }).eq("id", g.id);
    if (error) return toast.error(error.message);
    load();
  }

  return (
    <>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <h2 className="text-lg font-medium">Gasten ({items.length})</h2>
        <button
          onClick={() => setEditing("new")}
          className="bg-[#BA7517] text-[#0F0F0E] px-4 py-2 text-xs tracking-[0.15em] uppercase font-medium hover:bg-[#A56714]"
        >
          + Gast
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-[#8A8270]">Laden…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-[#8A8270]">
          Nog geen gasten. Voeg er één toe om ze op de pagina “Vrienden van de show” te tonen.
        </p>
      ) : (
        <div className="border border-[#2A2A26] overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[760px]">
            <thead className="bg-[#1A1A18] text-[#8A8270]">
              <tr>
                {["Foto", "Naam", "Rol", "Links", "Volgorde", "Zichtbaar", ""].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[10px] tracking-[0.15em] uppercase font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((g) => (
                <tr key={g.id} className="border-t border-[#2A2A26]">
                  <td className="px-4 py-3">
                    <div className="w-14 h-14 bg-[#22221F] overflow-hidden">
                      {g.image_url && (
                        <img src={g.image_url} alt={g.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{g.name}</td>
                  <td className="px-4 py-3 text-[#8A8270]">{g.role || "—"}</td>
                  <td className="px-4 py-3 text-[#8A8270] text-xs">
                    {[g.website_url && "Web", g.instagram_url && "IG", g.linkedin_url && "LI"]
                      .filter(Boolean)
                      .join(" · ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-[#8A8270]">{g.sort_order}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(g)}
                      className={`text-[10px] tracking-[0.15em] uppercase px-2 py-1 border ${
                        g.active ? "border-[#8FBF4A] text-[#8FBF4A]" : "border-[#2A2A26] text-[#8A8270]"
                      }`}
                    >
                      {g.active ? "Aan" : "Uit"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => setEditing(g)} className="text-xs text-[#BA7517] hover:underline">
                      Bewerk
                    </button>
                    <button onClick={() => remove(g)} className="text-xs text-red-400 hover:underline">
                      Wis
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <GuestDrawer
          initial={editing === "new" ? null : editing}
          episodes={episodes}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </>
  );
}

function GuestDrawer({
  initial,
  episodes,
  onClose,
  onSaved,
}: {
  initial: Guest | null;
  episodes: EpisodeOption[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    role: initial?.role ?? "",
    bio: initial?.bio ?? "",
    image_url: initial?.image_url ?? "",
    storage_path: initial?.storage_path ?? "",
    website_url: initial?.website_url ?? "",
    instagram_url: initial?.instagram_url ?? "",
    linkedin_url: initial?.linkedin_url ?? "",
    episode_id: initial?.episode_id ?? "",
    sort_order: initial?.sort_order ?? 0,
    active: initial?.active ?? true,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("guests")
        .upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });
      if (upErr) throw upErr;
      const { data, error } = await supabase.storage
        .from("guests")
        .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (error || !data) throw error ?? new Error("Kon link naar foto niet aanmaken");
      setForm((f) => ({ ...f, image_url: data.signedUrl, storage_path: path }));
      toast.success("Foto geüpload");
    } catch (e: any) {
      toast.error(e.message ?? "Upload mislukt");
    } finally {
      setUploading(false);
    }
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Naam is verplicht");
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      role: form.role.trim() || null,
      bio: form.bio.trim(),
      image_url: form.image_url.trim() || null,
      storage_path: form.storage_path || null,
      website_url: form.website_url.trim() || null,
      instagram_url: form.instagram_url.trim() || null,
      linkedin_url: form.linkedin_url.trim() || null,
      episode_id: form.episode_id || null,
      sort_order: Number(form.sort_order) || 0,
      active: form.active,
    };
    const { error } = initial
      ? await supabase.from("guests").update(payload).eq("id", initial.id)
      : await supabase.from("guests").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Opgeslagen");
    onSaved();
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-end" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-[#1A1A18] border-l border-[#2A2A26] h-full overflow-y-auto"
      >
        <div className="h-[3px] bg-[#BA7517]" />
        <div className="px-6 py-5 border-b border-[#2A2A26] flex items-center justify-between sticky top-0 bg-[#1A1A18] z-10">
          <h3 className="font-medium text-[#E8E4D8]">{initial ? "Bewerk gast" : "Nieuwe gast"}</h3>
          <button onClick={onClose} className="text-[10px] tracking-[0.15em] uppercase text-[#8A8270] hover:text-[#E8E4D8]">
            Sluit
          </button>
        </div>
        <div className="px-6 py-5">
          <form onSubmit={save} className="space-y-4">
            <GField label="Naam *">
              <GInput value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            </GField>

            <GField label="Rol / omschrijving">
              <GInput
                value={form.role}
                onChange={(v) => setForm({ ...form, role: v })}
                placeholder="Pro bij Ternesse"
              />
            </GField>

            <GField label="Foto">
              <div className="space-y-2">
                {form.image_url && (
                  <div className="w-32 h-40 bg-[#22221F] overflow-hidden border border-[#2A2A26]">
                    <img src={form.image_url} alt="Voorbeeld" className="w-full h-full object-cover" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(f);
                  }}
                  className="block w-full text-xs text-[#8A8270] file:mr-3 file:py-1.5 file:px-3 file:border-0 file:text-[10px] file:tracking-[0.15em] file:uppercase file:bg-[#BA7517] file:text-[#0F0F0E] hover:file:bg-[#A56714]"
                />
                {uploading && <p className="text-xs text-[#8A8270]">Bezig met uploaden…</p>}
                <div className="text-[10px] tracking-[0.15em] uppercase text-[#8A8270]">Of plak een URL</div>
                <GInput
                  value={form.image_url}
                  onChange={(v) => setForm({ ...form, image_url: v })}
                  placeholder="https://…/foto.jpg"
                />
              </div>
            </GField>

            <GField label="Korte bio">
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={5}
                className="w-full bg-[#0F0F0E] border border-[#2A2A26] px-3 py-2 text-sm text-[#E8E4D8] focus:border-[#BA7517] outline-none"
              />
            </GField>

            <GField label="Website">
              <GInput type="url" value={form.website_url} onChange={(v) => setForm({ ...form, website_url: v })} placeholder="https://…" />
            </GField>
            <GField label="Instagram">
              <GInput type="url" value={form.instagram_url} onChange={(v) => setForm({ ...form, instagram_url: v })} placeholder="https://instagram.com/…" />
            </GField>
            <GField label="LinkedIn">
              <GInput type="url" value={form.linkedin_url} onChange={(v) => setForm({ ...form, linkedin_url: v })} placeholder="https://linkedin.com/in/…" />
            </GField>

            <GField label="Gekoppelde aflevering">
              <select
                value={form.episode_id}
                onChange={(e) => setForm({ ...form, episode_id: e.target.value })}
                className="w-full bg-[#0F0F0E] border border-[#2A2A26] px-3 py-2 text-sm text-[#E8E4D8] focus:border-[#BA7517] outline-none"
              >
                <option value="">Geen</option>
                {episodes.map((ep) => (
                  <option key={ep.id} value={ep.id}>
                    {ep.number} — {ep.title}
                  </option>
                ))}
              </select>
            </GField>

            <div className="grid grid-cols-2 gap-3">
              <GField label="Volgorde">
                <GInput
                  type="number"
                  value={String(form.sort_order)}
                  onChange={(v) => setForm({ ...form, sort_order: Number(v) || 0 })}
                />
              </GField>
              <GField label="Zichtbaar">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, active: !form.active })}
                  className={`w-full px-3 py-2 text-xs tracking-[0.15em] uppercase border ${
                    form.active ? "border-[#8FBF4A] text-[#8FBF4A]" : "border-[#2A2A26] text-[#8A8270]"
                  }`}
                >
                  {form.active ? "Zichtbaar" : "Verborgen"}
                </button>
              </GField>
            </div>

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
          </form>
        </div>
      </div>
    </div>
  );
}

function GField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] tracking-[0.15em] uppercase text-[#8A8270] mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function GInput({
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      required={required}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#0F0F0E] border border-[#2A2A26] px-3 py-2 text-sm text-[#E8E4D8] focus:border-[#BA7517] outline-none"
    />
  );
}
