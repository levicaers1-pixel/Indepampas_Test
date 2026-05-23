import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_maps";

const Input = z.object({
  query: z.string().min(1).max(300),
  countryCode: z.string().min(2).max(3).optional(),
});

export const geocodeAddress = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    if (!GOOGLE_MAPS_API_KEY) throw new Error("GOOGLE_MAPS_API_KEY is not configured");

    const params = new URLSearchParams({ address: data.query });
    if (data.countryCode) params.set("components", `country:${data.countryCode}`);

    const res = await fetch(`${GATEWAY_URL}/maps/api/geocode/json?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": GOOGLE_MAPS_API_KEY,
      },
    });
    const json = (await res.json()) as {
      status: string;
      results?: Array<{ geometry: { location: { lat: number; lng: number } } }>;
      error_message?: string;
    };
    if (!res.ok || json.status !== "OK" || !json.results?.length) {
      return { lat: null as number | null, lng: null as number | null, status: json.status ?? "ERROR" };
    }
    const loc = json.results[0].geometry.location;
    return { lat: loc.lat, lng: loc.lng, status: "OK" as const };
  });
