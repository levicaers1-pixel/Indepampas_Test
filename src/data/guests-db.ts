import { supabase } from "@/integrations/supabase/client";
import { fetchEpisodes } from "@/data/episodes-db";
import { buildEpisodeSlugs } from "@/lib/episodeSlug";

export type GuestRow = {
  id: string;
  name: string;
  role: string | null;
  bio: string;
  image_url: string | null;
  website_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  sort_order: number;
  episodes: { title: string; number: string; spotify_id: string } | null;
  /** Slug of the episode's own page on this site, when it has one. */
  episodeSlug: string | null;
};

/** Active guests in display order, loaded on the server so the HTML already contains them. Never throws. */
export async function fetchGuests(): Promise<GuestRow[]> {
  const [{ data, error }, episodes] = await Promise.all([
    supabase
      .from("guests")
      .select(
        "id,name,role,bio,image_url,website_url,instagram_url,linkedin_url,sort_order,episodes(title,number,spotify_id)",
      )
      .eq("active", true)
      .order("sort_order", { ascending: true }),
    fetchEpisodes(),
  ]);
  if (error || !data) return [];
  const slugs = buildEpisodeSlugs(episodes);
  return (data as unknown as Omit<GuestRow, "episodeSlug">[]).map((g) => ({
    ...g,
    episodeSlug: (g.episodes && slugs.get(g.episodes.spotify_id)) || null,
  }));
}
