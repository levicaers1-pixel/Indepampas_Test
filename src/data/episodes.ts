// Replace `spotifyId` values with real Spotify episode IDs once available.

export type Episode = {
  number: string;
  season: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  spotifyId: string;
  topics: string[];
};

export const episodes: Episode[] = [
  {
    number: "01",
    season: "S01",
    title: "Aflevering 1",
    description:
      "De allereerste aflevering van PAMPAS. Lars, Levi en Niels stellen zichzelf voor en zetten de toon voor wat komen gaat.",
    date: "",
    duration: "",
    spotifyId: "1hKEnYGCgL5ujRSqpXt4Ix",
    topics: ["Intro", "Ternesse"],
  },
];

export const latestEpisode = episodes[0];
