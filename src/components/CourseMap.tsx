import { useEffect, useRef } from "react";
import type { CourseRating } from "@/data/ratings";

declare global {
  interface Window {
    google?: typeof google;
    __pampasInitMap?: () => void;
  }
}

const SCRIPT_ID = "google-maps-js";

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
  return "#7A7260";
}

export function CourseMap({ ratings }: { ratings: CourseRating[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  const located = ratings.filter(
    (r) => typeof r.latitude === "number" && typeof r.longitude === "number"
  );

  useEffect(() => {
    let cancelled = false;
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

        // clear existing markers
        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];

        const bounds = new window.google.maps.LatLngBounds();
        const info = new window.google.maps.InfoWindow();

        located.forEach((r) => {
          const pos = { lat: r.latitude as number, lng: r.longitude as number };
          const marker = new window.google.maps.Marker({
            position: pos,
            map: mapRef.current!,
            title: r.name,
            label: {
              text: String(r.pampasScore),
              color: "#F4EFE5",
              fontSize: "11px",
              fontWeight: "700",
            },
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 16,
              fillColor: tierColor(r.pampasScore),
              fillOpacity: 1,
              strokeColor: "#F4EFE5",
              strokeWeight: 2,
            },
          });
          marker.addListener("click", () => {
            info.setContent(
              `<div style="font-family:system-ui;padding:4px 6px;min-width:180px">
                <div style="font-weight:600;color:#1C3D2A;font-size:14px">${r.name}</div>
                <div style="color:#7A7260;font-size:12px;margin-top:2px">${r.region} · ${r.type}</div>
                <div style="margin-top:6px;font-size:13px;color:#1C3D2A">
                  <strong>${r.pampasScore}</strong>/100 · ${r.verdict}
                </div>
                <a href="/ratings/${r.slug}" style="color:#3D7A52;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;margin-top:6px;display:inline-block">Lees →</a>
              </div>`
            );
            info.open({ anchor: marker, map: mapRef.current! });
          });
          markersRef.current.push(marker);
          bounds.extend(pos);
        });

        if (located.length === 1) {
          mapRef.current.setCenter(bounds.getCenter());
          mapRef.current.setZoom(11);
        } else if (located.length > 1) {
          mapRef.current.fitBounds(bounds, 60);
        }
      })
      .catch((e) => console.error(e));
    return () => {
      cancelled = true;
    };
    // re-run when ratings change so map updates after CRUD
  }, [located.map((r) => `${r.slug}:${r.latitude},${r.longitude}:${r.pampasScore}`).join("|")]);

  return (
    <div className="px-6 lg:px-14 py-14 border-b border-[rgba(28,61,42,0.15)]">
      <h2 className="font-rb-mono text-[0.65rem] tracking-[0.2em] uppercase text-[#1C3D2A] mb-6">
        Op de kaart
      </h2>
      <div
        ref={ref}
        className="w-full h-[500px] border border-[rgba(28,61,42,0.15)] bg-[#EDE6D9]"
      />
      {located.length < ratings.length && (
        <p className="mt-3 font-rb-mono text-[0.6rem] tracking-[0.15em] uppercase text-[#7A7260]">
          {ratings.length - located.length} parcours nog zonder coördinaten.
        </p>
      )}
    </div>
  );
}
