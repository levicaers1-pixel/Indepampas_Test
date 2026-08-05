import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Photo = Tables<"course_photos">;

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

export function CoursePhotosDrawer({
  courseId,
  courseName,
  onClose,
}: {
  courseId: string;
  courseName: string;
  onClose: () => void;
}) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("course_photos")
      .select("*")
      .eq("course_id", courseId)
      .order("sort_order", { ascending: true });
    if (error) toast.error(error.message);
    setPhotos(data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [courseId]);

  async function uploadFiles(files: File[]) {
    if (files.length === 0) return;
    setUploading(true);
    setProgress({ done: 0, total: files.length });
    let order = photos.length ? Math.max(...photos.map((p) => p.sort_order)) + 1 : 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        if (!file.type.startsWith("image/")) throw new Error(`${file.name} is geen afbeelding`);
        if (file.size > 10 * 1024 * 1024) throw new Error(`${file.name} is groter dan 10 MB`);
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${courseId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("course-photos")
          .upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });
        if (upErr) throw upErr;
        const { data: signed, error: signErr } = await supabase.storage
          .from("course-photos")
          .createSignedUrl(path, TEN_YEARS);
        if (signErr || !signed) throw signErr ?? new Error("Kon link niet aanmaken");
        const { error: insErr } = await supabase.from("course_photos").insert({
          course_id: courseId,
          image_url: signed.signedUrl,
          storage_path: path,
          sort_order: order++,
        });
        if (insErr) throw insErr;
      } catch (e: any) {
        toast.error(e.message ?? "Upload mislukt");
      }
      setProgress({ done: i + 1, total: files.length });
    }
    setUploading(false);
    setProgress(null);
    toast.success("Foto's geüpload");
    load();
  }

  async function saveMeta(p: Photo, patch: Partial<Photo>) {
    const { error } = await supabase.from("course_photos").update(patch).eq("id", p.id);
    if (error) return toast.error(error.message);
    setPhotos((ps) => ps.map((x) => (x.id === p.id ? { ...x, ...patch } : x)));
  }

  async function move(p: Photo, dir: -1 | 1) {
    const idx = photos.findIndex((x) => x.id === p.id);
    const target = photos[idx + dir];
    if (!target) return;
    const a = p.sort_order;
    const b = target.sort_order;
    const next = photos.slice();
    next[idx] = { ...p, sort_order: b };
    next[idx + dir] = { ...target, sort_order: a };
    next.sort((x, y) => x.sort_order - y.sort_order);
    setPhotos(next);
    await Promise.all([
      supabase.from("course_photos").update({ sort_order: b }).eq("id", p.id),
      supabase.from("course_photos").update({ sort_order: a }).eq("id", target.id),
    ]);
  }

  async function remove(p: Photo) {
    if (!confirm("Deze foto verwijderen?")) return;
    if (p.storage_path) {
      await supabase.storage.from("course-photos").remove([p.storage_path]);
    }
    const { error } = await supabase.from("course_photos").delete().eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success("Verwijderd");
    load();
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-end" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-[#1A1A18] border-l border-[#2A2A26] h-full overflow-y-auto"
      >
        <div className="h-[3px] bg-[#BA7517]" />
        <div className="px-6 py-5 border-b border-[#2A2A26] flex items-center justify-between sticky top-0 bg-[#1A1A18] z-10">
          <h3 className="font-medium text-[#E8E4D8]">Foto's · {courseName}</h3>
          <button onClick={onClose} className="text-[10px] tracking-[0.15em] uppercase text-[#8A8270] hover:text-[#E8E4D8]">Sluit</button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] tracking-[0.15em] uppercase text-[#8A8270]">Foto's toevoegen (meerdere tegelijk)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={uploading}
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                e.target.value = "";
                uploadFiles(files);
              }}
              className="block w-full text-xs text-[#8A8270] file:mr-3 file:py-1.5 file:px-3 file:border-0 file:text-[10px] file:tracking-[0.15em] file:uppercase file:bg-[#BA7517] file:text-[#0F0F0E] hover:file:bg-[#A56714]"
            />
            {progress && (
              <p className="text-xs text-[#8A8270]">Uploaden… {progress.done}/{progress.total}</p>
            )}
            <p className="text-[11px] text-[#5F5A4E]">JPG/PNG/WebP, max 10 MB per foto. De eerste foto wordt de coverfoto (ook voor deellinks).</p>
          </div>

          {loading ? (
            <p className="text-sm text-[#8A8270]">Laden…</p>
          ) : photos.length === 0 ? (
            <p className="text-sm text-[#8A8270]">Nog geen foto's voor dit parcours.</p>
          ) : (
            <div className="space-y-3">
              {photos.map((p, i) => (
                <div key={p.id} className="border border-[#2A2A26] p-3 flex gap-3">
                  <img src={p.image_url} alt="" className="w-28 h-20 object-cover bg-[#0F0F0E]" />
                  <div className="flex-1 space-y-2">
                    <input
                      defaultValue={p.caption ?? ""}
                      placeholder="Bijschrift (bv. hole 12, par 3 over water)"
                      onBlur={(e) => saveMeta(p, { caption: e.target.value.trim() || null })}
                      className="w-full bg-[#0F0F0E] border border-[#2A2A26] px-2 py-1.5 text-xs text-[#E8E4D8] focus:outline-none focus:border-[#BA7517]"
                    />
                    <input
                      defaultValue={p.credit ?? ""}
                      placeholder="Credit / fotograaf (optioneel)"
                      onBlur={(e) => saveMeta(p, { credit: e.target.value.trim() || null })}
                      className="w-full bg-[#0F0F0E] border border-[#2A2A26] px-2 py-1.5 text-xs text-[#E8E4D8] focus:outline-none focus:border-[#BA7517]"
                    />
                    <div className="flex items-center gap-3 text-[10px] tracking-[0.15em] uppercase">
                      <button onClick={() => move(p, -1)} disabled={i === 0} className="text-[#8A8270] hover:text-[#E8E4D8] disabled:opacity-30">↑ Omhoog</button>
                      <button onClick={() => move(p, 1)} disabled={i === photos.length - 1} className="text-[#8A8270] hover:text-[#E8E4D8] disabled:opacity-30">↓ Omlaag</button>
                      {i === 0 && <span className="text-[#BA7517]">Cover</span>}
                      <button onClick={() => remove(p)} className="ml-auto text-red-400 hover:underline">Wis</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
