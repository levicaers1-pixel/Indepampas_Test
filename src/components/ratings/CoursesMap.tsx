/// <reference types="google.maps" />
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { geocodeAddress } from "@/lib/geocode.functions";
import type { CourseWithRatings } from "@/data/courses-db";

declare global {
  interface Window {
    google?: typeof google;
    __pampasInitMap?: () => void;
    gm_authFailure?: () => void;
    __pampasMapConsolePatched?: boolean;
    __pampasMapAuthError?: boolean;
  }
}

const SCRIPT_ID = "google-maps-js";
const CACHE_KEY = "pampas:geocode:v2";
const MAP_AUTH_ERROR =
  "Google Maps is nog niet toegestaan voor dit domein. Voeg https://indepampas.be/* en https://www.indepampas.be/* toe aan de HTTP-referrers van de actieve Google Maps API-key en publiceer opnieuw.";

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

function loadMaps(apiKey: string): Promise<void> {
  if (window.google?.maps) return Promise.resolve();
  return new Promise((resolve, reject) => {
    let settled = false;
    let check: number | null = null;
    let timeout: number | null = null;

    const cleanup = () => {
      if (check != null) window.clearInterval(check);
      if (timeout != null) window.clearTimeout(timeout);
    };
    const done = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve();
    };
    const fail = (message: string) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error(message));
    };

    window.__pampasInitMap = done;
    window.gm_authFailure = () => fail(MAP_AUTH_ERROR);
    if (!window.__pampasMapConsolePatched) {
      window.__pampasMapConsolePatched = true;
      const originalError = console.error.bind(console);
      console.error = (...args: unknown[]) => {
        if (args.some((arg) => String(arg).includes("RefererNotAllowedMapError"))) {
          window.__pampasMapAuthError = true;
          window.dispatchEvent(new Event("pampas-map-auth-error"));
        }
        originalError(...args);
      };
    }
    timeout = window.setTimeout(
      () => fail("Google Maps kon niet laden. Controleer de API-key, billing en domeinrestricties."),
      12_000,
    );

    if (document.getElementById(SCRIPT_ID)) {
      check = window.setInterval(() => {
        if (window.google?.maps) {
          done();
        }
      }, 50);
      return;
    }
    const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID;
    if (!apiKey) return fail("Google Maps browser key ontbreekt in deze deployment.");
    const s = document.createElement("script");
    s.id = SCRIPT_ID;
    s.async = true;
    s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&callback=__pampasInitMap${
      channel ? `&channel=${channel}` : ""
    }`;
    s.onerror = () => fail("Google Maps script kon niet geladen worden.");
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

  const [coords, setCoords] = useState<Record<string, Coord>>({});
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  // Load client cache after mount to avoid hydration mismatch.
  useEffect(() => {
    setMounted(true);
    setCoords(loadCache());
  }, []);

  // Geocode any rated courses missing from cache.
  useEffect(() => {
    if (!mounted) return;
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
  }, [ratedCourses, mounted]);

  const located = ratedCourses
    .map((c) => {
      const co = coords[c.id];
      return co ? { course: c, ...co } : null;
    })
    .filter(Boolean) as Array<{ course: CourseWithRatings; lat: number; lng: number }>;

  useEffect(() => {
    let cancelled = false;
    let authCheck: number | null = null;
    let authCheckStop: number | null = null;
    if (located.length === 0) return;
    const onAuthError = () => setError(MAP_AUTH_ERROR);
    window.addEventListener("pampas-map-auth-error", onAuthError);
    if (window.__pampasMapAuthError) onAuthError();
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
        authCheck = window.setInterval(() => {
          if (cancelled) return;
          if (document.body.innerText.includes("didn't load Google Maps")) {
            setError(MAP_AUTH_ERROR);
          }
        }, 1000);
        authCheckStop = window.setTimeout(() => {
          if (authCheck != null) window.clearInterval(authCheck);
        }, 18_000);
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
      window.removeEventListener("pampas-map-auth-error", onAuthError);
      if (authCheck != null) window.clearInterval(authCheck);
      if (authCheckStop != null) window.clearTimeout(authCheckStop);
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
      {mounted && error && (
        <p className="mt-3 font-rb-mono text-[0.6rem] tracking-[0.15em] uppercase text-[#A33]">
          {error}
        </p>
      )}
      {mounted && !error && progress && (
        <p className="mt-3 font-rb-mono text-[0.6rem] tracking-[0.15em] uppercase text-[#635C4B]">
          Locaties laden… {progress.done}/{progress.total}
        </p>
      )}
      {mounted && !error && !progress && located.length === 0 && ratedCourses.length > 0 && (
        <p className="mt-3 font-rb-mono text-[0.6rem] tracking-[0.15em] uppercase text-[#635C4B]">
          Geen coördinaten gevonden.
        </p>
      )}
    </div>
  );
}
