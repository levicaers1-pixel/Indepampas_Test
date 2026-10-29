import { createServerFn } from "@tanstack/react-start";

export type SpotifyEpisode = {
  id: string;
  name: string;
  description: string;
  release_date: string;
  duration_ms: number;
  images: { url: string; width: number; height: number }[];
};

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.value;
  }
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET niet geconfigureerd");
  }
  const basic = btoa(`${clientId}:${clientSecret}`);
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    console.error(`Spotify token error (${res.status}): ${(await res.text()).slice(0, 200)}`);
    throw new Error("Spotify token error");
  }
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    value: json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000,
  };
  return json.access_token;
}

export const fetchSpotifyShowEpisodes = createServerFn({ method: "GET" })
  .inputValidator((input: { showId: string; limit?: number }) => {
    // A Spotify id is 22 base-62 characters; anything else would end up in the API path.
    const showId = String(input.showId);
    if (!/^[A-Za-z0-9]{22}$/.test(showId)) throw new Error("Invalid Spotify show id");
    return { showId, limit: Math.min(Math.max(Number(input.limit) || 30, 1), 50) };
  })
  .handler(async ({ data }) => {
    const token = await getAccessToken();
    const url = `https://api.spotify.com/v1/shows/${data.showId}/episodes?limit=${data.limit}&market=BE`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      console.error(`Spotify API error (${res.status}): ${(await res.text()).slice(0, 200)}`);
      throw new Error("Spotify API error");
    }
    const json = (await res.json()) as { items: SpotifyEpisode[] };
    return {
      episodes: (json.items || []).filter(Boolean).map((e) => ({
        id: e.id,
        name: e.name,
        description: e.description,
        release_date: e.release_date,
        duration_ms: e.duration_ms,
        image_url: e.images?.[0]?.url ?? null,
      })),
    };
  });
