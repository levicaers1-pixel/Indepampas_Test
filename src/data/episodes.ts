// Replace `spotifyId` values with real Spotify episode IDs once available.
// Default IDs below are public Spotify demo episodes so embeds always render.

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

const DEMO = "4rOoJ6Egrf8K2IrywzwOMk"; // public demo episode id

export const episodes: Episode[] = [
  {
    number: "07",
    season: "S02",
    title: "Regen op Royal Zoute",
    description:
      "Een ronde in de stromende Belgische regen, drie verloren ballen, en de eeuwige vraag: paraplu of regenpak?",
    date: "16 apr 2025",
    duration: "58 min",
    spotifyId: DEMO,
    topics: ["Royal Zoute", "Weer", "Etiquette"],
  },
  {
    number: "06",
    season: "S02",
    title: "De Ryder Cup Kater",
    description:
      "We dissecten de laatste Ryder Cup met de noodzakelijke hoeveelheid bier en zelfreflectie.",
    date: "9 apr 2025",
    duration: "1u 04 min",
    spotifyId: DEMO,
    topics: ["Ryder Cup", "Team Europe"],
  },
  {
    number: "05",
    season: "S02",
    title: "De IJzer-7 Mythe",
    description:
      "Waarom iedereen denkt dat hij 160 meter slaat met een 7 ijzer — en waarom het bijna nooit klopt.",
    date: "2 apr 2025",
    duration: "47 min",
    spotifyId: DEMO,
    topics: ["Equipment", "Statistiek"],
  },
  {
    number: "04",
    season: "S02",
    title: "Clubhuis Cocktails",
    description:
      "Een gesprek over de golden age van het 19e hole, met een gin tonic in de hand.",
    date: "26 mrt 2025",
    duration: "52 min",
    spotifyId: DEMO,
    topics: ["Cultuur", "Cocktails"],
  },
  {
    number: "03",
    season: "S02",
    title: "Linksgolf in Vlaanderen",
    description:
      "Van De Haan tot Knokke — een ode aan de Belgische kustbanen en hun pampas-grassen rough.",
    date: "19 mrt 2025",
    duration: "61 min",
    spotifyId: DEMO,
    topics: ["Links", "België"],
  },
  {
    number: "02",
    season: "S02",
    title: "De Mentale Hole",
    description:
      "Hoe overleef je hole 12 als alles al fout zit? Een gesprek over koppen, niet over swingen.",
    date: "12 mrt 2025",
    duration: "44 min",
    spotifyId: DEMO,
    topics: ["Mental game"],
  },
];

export const latestEpisode = episodes[0];
