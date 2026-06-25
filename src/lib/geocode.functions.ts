import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_maps";

const Input = z.object({
  query: z.string().min(1).max(300),
  countryCode: z.string().min(2).max(3).optional(),
});

type LatLng = { lat: number; lng: number };

async function callGateway(path: string): Promise<unknown> {
  const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
  const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
  if (!GOOGLE_MAPS_API_KEY) throw new Error("GOOGLE_MAPS_API_KEY is not configured");
  const res = await fetch(`${GATEWAY_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": GOOGLE_MAPS_API_KEY,
    },
  });
  return res.json();
}

async function placesTextSearch(query: string, countryCode?: string): Promise<LatLng | null> {
  // Places Text Search is far better for POIs like golf clubs than the geocoder.
  const params = new URLSearchParams({ query, type: "establishment" });
  if (countryCode) params.set("region", countryCode.toLowerCase());
  const json = (await callGateway(
    `/maps/api/place/textsearch/json?${params.toString()}`,
  )) as {
    status?: string;
    results?: Array<{ geometry?: { location?: LatLng }; types?: string[] }>;
  };
  if (json.status !== "OK" || !json.results?.length) return null;
  // Prefer a result that looks like a golf course.
  const golf = json.results.find((r) =>
    r.types?.some((t) => t.includes("golf")),
  );
  const loc = (golf ?? json.results[0]).geometry?.location;
  return loc ?? null;
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
