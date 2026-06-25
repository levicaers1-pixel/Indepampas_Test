/// <reference types="google.maps" />
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { geocodeAddress } from "@/lib/geocode.functions";
import type { CourseWithRatings } from "@/data/courses-db";

declare global {
  interface Window {
    google?: typeof google;
    __pampasInitMap?: () => void;
  }
}

const SCRIPT_ID = "google-maps-js";
const CACHE_KEY = "pampas:geocode:v1";

type Coord = { lat: number; lng: number };

function loadCache(): Record<string, Coord> {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}
function saveCache(c: Record<string, Coord>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(c));
  } catch {
    /* ignore */
  }
}

function loadMaps(): Promise<void> {
  if (window.google?.maps) return Promise.resolve();
  return new Promise((resolve, reject) => {
    if (document.getElementById(SCRIPT_ID)) {
      const check = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(check);
          resolve();
        }
      }, 50);
      return;
    }
    window.__pampasInitMap = () => resolve();
    const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
    const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID;
    if (!key) return reject(new Error("Missing Google Maps browser key"));
    const s = document.createElement("script");
    s.id = SCRIPT_ID;
    s.async = true;
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__pampasInitMap${
      channel ? `&channel=${channel}` : ""
    }`;
    s.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(s);
  });
}

function tierColor(score: number) {
  if (score >= 80) return "#1A3D2B";
  if (score >= 70) return "#3D7A52";
  if (score >= 55) return "#8CB84A";
  return "#635C4B";
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const countryCode = (c: string) => {
  const n = c.toLowerCase();
  if (n.startsWith("nederland") || n === "netherlands") return "NL";
  if (n.startsWith("belg")) return "BE";
  if (n.startsWith("frank") || n === "france") return "FR";
  if (n.startsWith("duits") || n === "germany") return "DE";
  if (n.startsWith("luxem")) return "LU";
  if (n.startsWith("groot") || n.startsWith("verenigd kon") || n === "uk" || n === "united kingdom") return "GB";
  return undefined;
};

export function CoursesMap({ courses }: { courses: CourseWithRatings[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const geocode = useServerFn(geocodeAddress);

  // Only show courses that have at least one rating (the ones with reviews/scores).
  const ratedCourses = useMemo(
    () => courses.filter((c) => c.ratings.length > 0),
    [courses],
  );

  const [coords, setCoords] = useState<Record<string, Coord>>(() =>
    typeof window === "undefined" ? {} : loadCache(),
  );
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  // Geocode any rated courses missing from cache.
  useEffect(() => {
    let cancelled = false;
    const missing = ratedCourses.filter((c) => !coords[c.id]);
    if (missing.length === 0) return;

    setProgress({ done: 0, total: missing.length });
    (async () => {
      const next: Record<string, Coord> = { ...coords };
      let done = 0;
      for (const c of missing) {
        if (cancelled) return;
        try {
          const q = [c.name, c.region, c.country].filter(Boolean).join(", ");
          const res = await geocode({ data: { query: q, countryCode: countryCode(c.country) } });
          if (res?.lat != null && res?.lng != null) {
            next[c.id] = { lat: res.lat, lng: res.lng };
          }
        } catch (e) {
          console.warn("geocode failed", c.name, e);
        }
        done += 1;
        if (!cancelled) setProgress({ done, total: missing.length });
      }
      if (cancelled) return;
      saveCache(next);
      setCoords(next);
      setProgress(null);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ratedCourses]);

  const located = ratedCourses
    .map((c) => {
      const co = coords[c.id];
      return co ? { course: c, ...co } : null;
    })
    .filter(Boolean) as Array<{ course: CourseWithRatings; lat: number; lng: number }>;

  useEffect(() => {
    let cancelled = false;
    if (located.length === 0) return;
    loadMaps()
      .then(() => {
        if (cancelled || !ref.current || !window.google) return;
        if (!mapRef.current) {
          mapRef.current = new window.google.maps.Map(ref.current, {
            center: { lat: 50.85, lng: 4.5 },
            zoom: 8,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          });
        }
        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];

        const bounds = new window.google.maps.LatLngBounds();
        const info = new window.google.maps.InfoWindow();

        located.forEach(({ course: c, lat, lng }) => {
          const slug = slugify(c.name);
          const score = c.pampasScore ?? 0;
          const marker = new window.google.maps.Marker({
            position: { lat, lng },
            map: mapRef.current!,
            title: c.name,
            label: {
              text: score ? String(Math.round(score)) : "—",
              color: "#F4EFE5",
              fontSize: "11px",
              fontWeight: "700",
            },
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 16,
              fillColor: tierColor(score),
              fillOpacity: 1,
              strokeColor: "#F4EFE5",
              strokeWeight: 2,
            },
          });

          marker.addListener("click", () => {
            const hostRows = c.ratings
              .map(
                (r) =>
                  `<span style="background:#EDE6D9;color:#1C3D2A;font-size:11px;padding:2px 6px;border-radius:3px;margin-right:4px;display:inline-block;margin-top:4px"><strong>${r.host}</strong> ${Math.round(Number(r.host_score))}</span>`,
              )
              .join("");
            const ep = c.episode_url
              ? `<a href="${c.episode_url}" target="_blank" rel="noopener" style="color:#3D7A52;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;display:inline-block;margin-right:10px">Beluister aflevering →</a>`
              : "";
            info.setContent(
              `<div style="font-family:system-ui;padding:4px 6px;min-width:240px">
                <div style="font-weight:600;color:#1C3D2A;font-size:14px">${c.name}</div>
                <div style="color:#635C4B;font-size:12px;margin-top:2px">${c.region ?? ""}${c.type ? " · " + c.type : ""}</div>
                <div style="margin-top:6px;font-size:13px;color:#1C3D2A">
                  <strong>${score ? Math.round(score) : "—"}</strong>/100 PAMPAS Score
                </div>
                <div style="margin-top:4px">${hostRows}</div>
                <div style="margin-top:10px">
                  ${ep}
                  <a href="/ratings/${slug}" style="color:#3D7A52;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;display:inline-block">Lees review →</a>
                </div>
              </div>`,
            );
            info.open({ anchor: marker, map: mapRef.current! });
          });

          markersRef.current.push(marker);
          bounds.extend({ lat, lng });
        });

        if (located.length === 1) {
          mapRef.current.setCenter(bounds.getCenter());
          mapRef.current.setZoom(11);
        } else {
          mapRef.current.fitBounds(bounds, 60);
        }
      })
      .catch((e) => setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [located.map((l) => `${l.course.id}:${l.lat},${l.lng}`).join("|")]);

  return (
    <div className="px-6 lg:px-14 py-14 border-b border-[rgba(28,61,42,0.15)]">
      <h2 className="font-rb-mono text-[0.65rem] tracking-[0.2em] uppercase text-[#1C3D2A] mb-6">
        Parcours op de kaart
      </h2>
      <div
        ref={ref}
        className="w-full h-[500px] border border-[rgba(28,61,42,0.15)] bg-[#EDE6D9]"
      />
      {error && (
        <p className="mt-3 font-rb-mono text-[0.6rem] tracking-[0.15em] uppercase text-[#A33]">
          {error}
        </p>
      )}
      {!error && progress && (
        <p className="mt-3 font-rb-mono text-[0.6rem] tracking-[0.15em] uppercase text-[#635C4B]">
          Locaties laden… {progress.done}/{progress.total}
        </p>
      )}
      {!error && !progress && located.length === 0 && ratedCourses.length > 0 && (
        <p className="mt-3 font-rb-mono text-[0.6rem] tracking-[0.15em] uppercase text-[#635C4B]">
          Geen coördinaten gevonden.
        </p>
      )}
    </div>
  );
}
