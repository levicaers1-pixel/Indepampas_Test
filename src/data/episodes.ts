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
    number: "04",
    season: "S01",
    title: "Episode 4 - Flowering Crab Apple",
    description:
      "Vandaag krijgen we bezoek van iemand die alles weet rondom het reilen en zeilen bij de enige Belgische European tour manche. Hij komt ons enkele leuke insights geven die bij zo'n tornooi komen kijken.",
    date: "05/05/2026",
    duration: "1u 10min",
    spotifyId: "6sOfgheg4DrROHDYdFNzhs",
    topics: ["Golf", "European Tour", "Belgium", "Interview", "Insights"],
  },
  {
    number: "03",
    season: "S01",
    title: "Episode 3 - Flowering Peach",
    description:
      "In deze aflevering blikken we terug op het Belgisch en Internationaal golfnieuws. We gaan van de PGA tour naar de European Tour met een tussenstop langs LIV. Onze twee blijvende formats komen ook terug aan bod: De Pikante Prikkelvraag & De Groenen Hoek.",
    date: "28/04/2026",
    duration: "1u 14min",
    spotifyId: "6Nq4yoihhd1HzYordyNV7w",
    topics: ["Golf", "PGA Tour", "European Tour", "LIV", "Prikkelvraag", "Groenen Hoek"],
  },
  {
    number: "02",
    season: "S01",
    title: "Episode 2 - Pink Dogwood",
    description:
      "In deze aflevering blikken we terug op het eerste Interclub weekend en de RBC Heritage. Daarnaast introduceren we twee nieuwe formats: De Groenen Hoek & De Pikante Prikkelvraag.",
    date: "21/04/2026",
    duration: "1u 1min",
    spotifyId: "1d1ToR0WFfe7vCRFmGNR5T",
    topics: ["Golf", "Interclub", "RBC Heritage", "Prikkelvraag", "Groenen Hoek"],
  },
  {
    number: "01",
    season: "S01",
    title: "Episode 1 - Tea Olive",
    description:
      "De allereerste aflevering van PAMPAS. Lars, Levi en Niels stellen zichzelf voor en zetten de toon voor wat komen gaat. Voor vragen en opmerkingen: pampas.podcast@gmail.com of via IG @pampas.golfpodcast.",
    date: "14/04/2026",
    duration: "50min 3sec",
    spotifyId: "1hKEnYGCgL5ujRSqpXt4Ix",
    topics: ["Intro", "Ternesse", "The Masters", "Golf", "PGA", "Rollback", "Golf Analyse"],
  },
];

export const latestEpisode = episodes[0];
