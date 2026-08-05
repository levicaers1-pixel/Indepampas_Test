import { supabase } from "@/integrations/supabase/client";
import type { HostName } from "@/data/personas";

export type RatingRow = {
  id: string;
  host: HostName;
  played_on: string | null;
  score_design: number;
  score_condition: number;
  score_challenge: number;
  score_scenery: number;
  score_facilities: number;
  score_value: number;
  score_hospitality: number;
  host_score: number;
  hole_of_day: string | null;
  would_return: string | null;
  one_word: string | null;
  review: string | null;
};

export type CoursePhoto = {
  id: string;
  image_url: string;
  caption: string | null;
  credit: string | null;
  sort_order: number;
};

export type CourseWithRatings = {
  id: string;
  name: string;
  country: string;
  region: string | null;
  type: string | null;
  greenfee: number | null;
  fee_category: string | null;
  holes: number;
  website: string | null;
  episode_url: string | null;
  ratings: RatingRow[];
  photos: CoursePhoto[];
  pampasScore: number | null;
};

export async function fetchCourses(): Promise<CourseWithRatings[]> {
  const { data, error } = await supabase
    .from("courses")
    .select(
      "id,name,country,region,type,greenfee,fee_category,holes,website,episode_url,ratings(*),course_photos(id,image_url,caption,credit,sort_order)",
    )
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);

  return (data ?? []).map((c: any) => {
    const ratings = (c.ratings ?? []) as RatingRow[];
    const avg =
      ratings.length > 0
        ? Math.round(
            (ratings.reduce((s, r) => s + Number(r.host_score), 0) / ratings.length) * 10,
          ) / 10
        : null;
    return {
      id: c.id,
      name: c.name,
      country: c.country,
      region: c.region,
      type: c.type,
      greenfee: c.greenfee != null ? Number(c.greenfee) : null,
      fee_category: c.fee_category,
      holes: c.holes,
      website: c.website,
      episode_url: c.episode_url,
      ratings: ratings.map((r) => ({
        ...r,
        score_design: Number(r.score_design),
        score_condition: Number(r.score_condition),
        score_challenge: Number(r.score_challenge),
        score_scenery: Number(r.score_scenery),
        score_facilities: Number(r.score_facilities),
        score_value: Number(r.score_value),
        score_hospitality: Number(r.score_hospitality),
        host_score: Number(r.host_score),
      })),
      pampasScore: avg,
    };
  });
}
