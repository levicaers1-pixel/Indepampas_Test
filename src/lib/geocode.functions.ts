import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_maps";

const Input = z.object({
  query: z.string().min(1).max(300),
  countryCode: z.string().min(2).max(3).optional(),
});

type LatLng = { lat: number; lng: number };

async function callGateway(path: string, init: RequestInit = {}): Promise<unknown> {
  const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
  const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
  if (!GOOGLE_MAPS_API_KEY) throw new Error("GOOGLE_MAPS_API_KEY is not configured");
  const res = await fetch(`${GATEWAY_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": GOOGLE_MAPS_API_KEY,
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { error: { code: res.status, message: text || "Non-JSON Google Maps gateway response" } };
  }
}

async function placesTextSearch(query: string, countryCode?: string): Promise<LatLng | null> {
  // Places API (New) is far better for POIs like golf clubs than the geocoder.
  const json = (await callGateway("/places/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-FieldMask": "places.location,places.types",
    },
    body: JSON.stringify({
      textQuery: query,
      ...(countryCode ? { regionCode: countryCode } : {}),
    }),
  })) as {
    places?: Array<{ location?: { latitude?: number; longitude?: number }; types?: string[] }>;
    error?: unknown;
  };
  if (json.error || !json.places?.length) return null;
  // Prefer a result that looks like a golf course.
  const golf = json.places.find((r) =>
    r.types?.some((t) => t.includes("golf")),
  );
  const loc = (golf ?? json.places[0]).location;
  if (loc?.latitude == null || loc?.longitude == null) return null;
  return { lat: loc.latitude, lng: loc.longitude };
}

async function geocode(query: string, countryCode?: string): Promise<LatLng | null> {
  const params = new URLSearchParams({ address: query });
  if (countryCode) params.set("components", `country:${countryCode}`);
  const json = (await callGateway(
    `/maps/api/geocode/json?${params.toString()}`,
  )) as {
    status?: string;
    results?: Array<{ geometry: { location: LatLng } }>;
  };
  if (json.status !== "OK" || !json.results?.length) return null;
  return json.results[0].geometry.location;
}

export const geocodeAddress = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    // 1) Try Places Text Search (POI-aware, handles "Golfclub …" names well).
    let loc = await placesTextSearch(data.query, data.countryCode);
    // 2) Fallback to the geocoder.
    if (!loc) loc = await geocode(data.query, data.countryCode);
    if (!loc) return { lat: null as number | null, lng: null as number | null, status: "ZERO_RESULTS" };
    return { lat: loc.lat, lng: loc.lng, status: "OK" as const };
  });
