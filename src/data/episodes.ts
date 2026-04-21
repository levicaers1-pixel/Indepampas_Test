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
    number: "02",
    season: "S01",
    title: "Episode 2 - Pink Dogwood",
    description:
      "In deze aflevering blikken we terug op het eerste Interclub weekend en de RBC Heritage. Daarbij komen er twee nieuwe formats: De Groenen hoek & De Pikante Prikkelvraag.",
    date: "21/04/2026",
    duration: "",
    spotifyId: "1d1ToR0WFfe7vCRFmGNR5T",
    topics: ["Golf", "Interclub", "PGA", "Matt Fitzpatrick", "Mental Game"],
  },
  {
    number: "01",
    season: "S01",
    title: "Aflevering 1",
    description:
      "De allereerste aflevering van PAMPAS. Lars, Levi en Niels stellen zichzelf voor en zetten de toon voor wat komen gaat.",
    date: "",
    duration: "",
    spotifyId: "1hKEnYGCgL5ujRSqpXt4Ix",
    topics: ["Intro", "Ternesse", "The Masters", "Golf", "PGA", "Rollback", "Golf Analyse"],
  },
];

export const latestEpisode = episodes[0];
