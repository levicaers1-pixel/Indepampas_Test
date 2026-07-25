import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_maps";

const LatLng = z.object({ lat: z.number(), lng: z.number() });
const Input = z.object({
  origins: z.array(LatLng).min(1).max(25),
  destinations: z.array(LatLng).min(1).max(25),
});

type Cell = { originIndex: number; destinationIndex: number; distanceMeters: number; durationSec: number; ok: boolean };

export const computeDriveMatrix = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    if (!GOOGLE_MAPS_API_KEY) throw new Error("GOOGLE_MAPS_API_KEY is not configured");

    const body = {
      origins: data.origins.map((o) => ({
        waypoint: { location: { latLng: { latitude: o.lat, longitude: o.lng } } },
      })),
      destinations: data.destinations.map((o) => ({
        waypoint: { location: { latLng: { latitude: o.lat, longitude: o.lng } } },
      })),
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_UNAWARE",
    };

    const res = await fetch(`${GATEWAY_URL}/routes/distanceMatrix/v2:computeRouteMatrix`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": GOOGLE_MAPS_API_KEY,
        "Content-Type": "application/json",
        "X-Goog-FieldMask": "originIndex,destinationIndex,duration,distanceMeters,condition",
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    if (!res.ok) {
      throw new Error(`Routes API ${res.status}: ${text.slice(0, 300)}`);
    }
    // Response is a JSON array of elements.
    let rows: Array<{
      originIndex?: number;
      destinationIndex?: number;
      distanceMeters?: number;
      duration?: string; // "1234s"
      condition?: string;
    }>;
    try {
      rows = JSON.parse(text);
    } catch {
      throw new Error(`Routes API parse error: ${text.slice(0, 200)}`);
    }

    const cells: Cell[] = rows.map((r) => ({
      originIndex: r.originIndex ?? 0,
      destinationIndex: r.destinationIndex ?? 0,
      distanceMeters: r.distanceMeters ?? 0,
      durationSec: r.duration ? parseInt(r.duration.replace(/s$/, ""), 10) : 0,
      ok: (r.condition ?? "ROUTE_EXISTS") === "ROUTE_EXISTS",
    }));

    return { cells };
  });
