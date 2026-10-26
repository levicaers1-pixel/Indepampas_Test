import { supabase } from "@/integrations/supabase/client";
import { episodes as staticEpisodes, mergeEpisodes, type Episode } from "@/data/episodes";

const COLUMNS =
  "spotify_id, number, season, title, description, date, duration, topics, image_url, release_date";

/**
 * All episodes, newest first: database rows (the recent ones) merged with the
 * static archive. Used in route loaders so the server-rendered HTML already
 * contains the newest episodes instead of waiting for a client-side fetch.
 * Never throws: if the database is unreachable the static archive is returned.
 */
export async function fetchEpisodes(): Promise<Episode[]> {
  const { data, error } = await supabase
    .from("episodes")
    .select(COLUMNS)
    .order("release_date", { ascending: false, nullsFirst: false });

  const fromDb: Episode[] =
    error || !data
      ? []
      : data.map((r) => ({
          number: r.number,
          season: r.season,
          title: r.title,
          description: r.description,
          date: r.date,
          releaseDate: r.release_date,
          duration: r.duration,
          spotifyId: r.spotify_id,
          imageUrl: r.image_url,
          topics: r.topics ?? [],
        }));

  return mergeEpisodes(fromDb, staticEpisodes);
}
