import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { CoursePhoto } from "@/data/courses-db";

export function PhotoCarousel({ photos, alt }: { photos: CoursePhoto[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const count = photos.length;
  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + count) % count),
    [count],
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, go]);

  if (count === 0) return null;
  const current = photos[index];

  return (
    <div>
      <div className="relative bg-[#EDE6D9] overflow-hidden group">
        <img
          src={current.image_url}
          alt={current.caption ? `${alt} — ${current.caption}` : `Foto van ${alt}`}
          loading="lazy"
          onClick={() => setLightbox(true)}
          className="w-full h-[220px] md:h-[380px] object-cover cursor-zoom-in"
        />
        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Vorige foto"
              onClick={(e) => { e.stopPropagation(); go(-1); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white text-[#1C3D2A] p-2 rounded-full"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Volgende foto"
              onClick={(e) => { e.stopPropagation(); go(1); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white text-[#1C3D2A] p-2 rounded-full"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-2 right-2 font-rb-mono text-[0.6rem] tracking-[0.12em] bg-black/55 text-white px-2 py-1">
              {index + 1}/{count}
            </div>
          </>
        )}
      </div>

      {(current.caption || current.credit) && (
        <p className="font-rb-sans text-[0.72rem] text-[#635C4B] mt-2">
          {current.caption}
          {current.credit && (
            <span className="font-rb-mono text-[0.6rem] uppercase tracking-[0.12em] text-[#A09684] ml-2">
              © {current.credit}
            </span>
          )}
        </p>
      )}

      {count > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {photos.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Foto ${i + 1}`}
              className="shrink-0"
              style={{ outline: i === index ? "2px solid #1C3D2A" : "none", outlineOffset: 1 }}
            >
              <img
                src={p.image_url}
                alt=""
                loading="lazy"
                className="w-16 h-12 md:w-20 md:h-14 object-cover"
                style={{ opacity: i === index ? 1 : 0.6 }}
              />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            aria-label="Sluiten"
            className="absolute top-4 right-4 text-white/80 hover:text-white"
            onClick={() => setLightbox(false)}
          >
            <X size={26} />
          </button>
          <img
            src={current.image_url}
            alt={current.caption ? `${alt} — ${current.caption}` : `Foto van ${alt}`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] max-w-full object-contain"
          />
          {count > 1 && (
            <>
              <button
                type="button"
                aria-label="Vorige foto"
                onClick={(e) => { e.stopPropagation(); go(-1); }}
                className="absolute left-4 text-white/80 hover:text-white"
              >
                <ChevronLeft size={34} />
              </button>
              <button
                type="button"
                aria-label="Volgende foto"
                onClick={(e) => { e.stopPropagation(); go(1); }}
                className="absolute right-4 text-white/80 hover:text-white"
              >
                <ChevronRight size={34} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
