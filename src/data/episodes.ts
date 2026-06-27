// Replace `spotifyId` values with real Spotify episode IDs once available.

export type Episode = {
  number: string;
  season: string;
  title: string;
  description: string;
  date: string;
  releaseDate?: string | null;
  duration: string;
  spotifyId: string;
  imageUrl?: string | null;
  topics: string[];
};

export function episodeTimestamp(ep: Pick<Episode, "date" | "releaseDate">): number {
  if (ep.releaseDate) {
    const ts = Date.parse(ep.releaseDate);
    if (Number.isFinite(ts)) return ts;
  }
  const [day, month, year] = ep.date.split("/");
  if (!day || !month || !year) return 0;
  return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
}

export function sortEpisodesByReleaseDate(list: Episode[]): Episode[] {
  return [...list].sort((a, b) => episodeTimestamp(b) - episodeTimestamp(a));
}

export function mergeEpisodes(primary: Episode[], fallback: Episode[]): Episode[] {
  const seen = new Set<string>();
  const merged: Episode[] = [];
  for (const e of [...primary, ...fallback]) {
    if (seen.has(e.spotifyId)) continue;
    seen.add(e.spotifyId);
    merged.push(e);
  }
  return sortEpisodesByReleaseDate(merged);
}

export const episodes: Episode[] = [
  {
    number: "Special",
    season: "S01",
    title: "US Open Special | Wyndham Clark wint US Open op Shinnecock + Niels pakt eindelijk de Brut 🏆",
    description:
      "In deze aflevering: Niels speelde de prijs van het personeel op Ternesse — en wint deze keer eindelijk de Brut. Levi en Lars vertellen alles over Koksijde Ter Hille, en we duiken in de US Open op Shinnecock Hills: Wyndham Clark wint van start tot finish, Sam Burns strandt opnieuw als tweede, Adrien Dumont de Chassart maakt meer birdies dan wie ook en Miles Russell zorgt voor een vaderdagmoment op hole 18.",
    date: "23/06/2026",
    releaseDate: "2026-06-23",
    duration: "1u 5min",
    spotifyId: "2k2UpihlOEpj2BuxhbAuKU",
    topics: ["US Open", "Wyndham Clark", "Koksijde Ter Hille", "Ternesse", "Belgisch Golf", "PAMPAS"],
  },
  {
    number: "Halfway",
    season: "S01",
    title: "#Halfway House – terugblikken, bijtanken en vooruitkijken",
    description:
      "Na 9 holes is het tijd om even adem te halen in de Halfway House. We blikken terug op 11 afleveringen, meer dan 8.000 streams en alles wat PAMPAS tot nu toe is geweest — en we kijken vooruit naar de US Open Special en de back nine in de nazomer. Maar eerst: Levi en Lars trotseerden hagelbuien op een prachtig Rinkven (spoiler: de baan scoort 83 op onze nieuwe beoordelingspagina op indepampas.be), en Levi en Niels gingen winnend naar huis op Ternesse — zonder brutprijs welteverstaan. We stellen ook onze eerste sponsor voor: Golf Media en hun Golf Kiosk, al actief in meer dan 70 clubs in België en Nederland.",
    date: "16/06/2026",
    duration: "1u 7min",
    spotifyId: "3HEuUli0X49OyMiHGkdDQF",
    topics: ["Golf", "Halfway House", "Rinkven", "Ternesse", "Golf Media", "US Open"],
  },
  {
    number: "09",
    season: "S01",
    title: "#09 Carolina Cherry - Anthony De Schutter: Van SIU naar Soudal & de weg naar pro | JT Poston triumphs | Chacarra triunfos | Korda reigns supreme",
    description:
      "In deze aflevering schuift Anthony De Schutter (24) aan — Belgisch nationaal teamspeler, 3x NCAA D1 Tournament Winner en winnaar van de Best of Belgium Award op het Soudal Open met een indrukwekkende score van -9. We praten over zijn tijd aan de Southern Illinois University, wat hij leerde van de DP World Tour pros, en hoe zijn pad richting professioneel golf er nu uitziet. Verder in deze aflevering: JT Poston wint het Memorial Tournament na een spannende playoff, Eugenio Chacarra pakt de KLM Open met een birdie op 18 in elke ronde, en Nelly Korda is opnieuw dominant op het US Women's Open. Ook Yente schittert op de Progolf Tour met een knappe tweede plaats. In het golfjournaal: Lev Grinberg wint de St. Andrews Links Trophy met -18 en 7 shots voorsprong, en we volgen de Belgische boys op het German Boys U18.",
    date: "10/06/2026",
    duration: "1u 29min",
    spotifyId: "3EHtcCXKshsAxuyowWNEpT",
    topics: ["Golf", "Anthony De Schutter", "Soudal Open", "Memorial Tournament", "KLM Open", "US Women's Open"],
  },
  {
    number: "08",
    season: "S01",
    title: "#08 Yellow Jasmine - Golfreizen van Herkenbosch tot Belek, Henley's Jeep & Hole 18 van The National",
    description:
      "Van een weekend Herkenbosch tot de zonbeschenen resorts van Belek — in deze aflevering van PAMPAS duiken we in de beste golfbestemmingen per auto én vliegtuig. Welke luchtvaartmaatschappij vervoert je golftas het beste? (Spoiler: vlieg nooit met Ryanair.) En hoe stel je zelf de perfecte golftrip samen zonder in een all-in hotel vol luidruchtige Britten te belanden? Verder: Russell Henley wint de Charles Schwab Challenge in een playoff én rijdt naar huis in een Jeep Scrambler uit 1982, Kaneko Kota pakt de Austrian Alpine Open na een bizarre botsing op een sprinkler op hole 18, en de Belgische heren presteren uitstekend in Estland. In de Groene Hoek lichten we hole 18 van The National toe, en in de Pikante Prikkelvraag: moet het altijd plaatsen zijn op de fairway — of niet?",
    date: "03/06/2026",
    duration: "1u 10min",
    spotifyId: "1xTgDPLUoVEdn1JMcJipar",
    topics: ["Golf", "Golfreizen", "Charles Schwab Challenge", "Russell Henley", "The National", "Prikkelvraag"],
  },
  {
    number: "07",
    season: "S01",
    title: "#07 Pampas - Nico's Final Dance: het afscheid van The Belgian Bomber | Wyndham wins again",
    description:
      "Nicolas Colsaerts neemt afscheid op de Soudal Open — een emotioneel moment voor de Belgische golfwereld. We blikken terug op het afscheid van The Belgian Bomber en bespreken Wyndham Clark die opnieuw weet te winnen op de PGA Tour.",
    date: "27/05/2026",
    duration: "1u 5min",
    spotifyId: "3rUqF8qY0ei3FJaIg3PDrO",
    topics: ["Golf", "Soudal Open", "Nicolas Colsaerts", "PGA Tour", "Wyndham Clark", "Afscheid"],
  },
  {
    number: "Bonus",
    season: "S01",
    title: "#Bonus Soudal Special - Birdies, bogeys en Belgische dromen – ft. Andrew Snoddy (DP World Tour)",
    description:
      "In deze aflevering duiken we in de Soudal Open 2026 op Rinkven International Golf Club in Antwerpen. We bespreken de hoogtepunten, de teleurstellingen en alles wat er op de fairways gebeurde. Hadden de Belgen iets te vieren? Wat mochten we verwachten van Thomas Detry op eigen bodem? En als kers op de taart sluiten we af met een exclusief interview met Andrew Snoddy, Tournament Director bij de DP World Tour, die ons een unieke blik achter de schermen geeft van het grootste golfevenement van België. Birdies, bogeys en Belgische dromen — we laten geen hole onbesproken.",
    date: "23/05/2026",
    duration: "45min 9sec",
    spotifyId: "1NiFrN6lc0Dyx9sPuzcUD8",
    topics: ["Golf", "Soudal Open", "DP World Tour", "Belgium", "Andrew Snoddy", "Interview"],
  },
  {
    number: "06",
    season: "S01",
    title: "#06 Juniper - Aaron Rai shocks Aronimink | Arthur Estas over zijn Soudal Open debuut & de PGA Championship onder de loep.",
    description:
      "De PGA Championship heeft een verrassende winnaar: Aaron Rai pakt zijn eerste major met een ijskoude slotfase, een roze tee en een TaylorMade M6 uit de prehistorie. Daarnaast schuift Belgisch amateurkampioen Arthur Estas aan tafel over zijn Soudal Open debuut op de DP World Tour. Ook: PAMPAS bereikt 2.500 streams en de winnaar van de giveaway wordt bekendgemaakt.",
    date: "19/05/2026",
    duration: "1u 19min",
    spotifyId: "52Ax1cnKN45UcnTlNQLhvC",
    topics: ["Golf", "PGA Championship", "Aaron Rai", "Arthur Estas", "Soudal Open", "DP World Tour"],
  },
  {
    number: "05",
    season: "S01",
    title: "#05 Magnolia - PGA Championship Preview, Reitan wint & Golf Tech diepte-analyse",
    description:
      "In deze aflevering duiken we diep in de wereld van moderne golftechnologie na een bezoek aan de Grip Academy op de Kempense, waar instructeur Nicolas Mertens ons meeneemt door tools als Trackman, HackMotion, Sportbox AI en Pressure Plates. Verder: Rahm's deal met de DP World Tour, het Soudal Open, de Truist Championship, Myrtle Beach Classic, een PGA Championship preview en De Pikante Prikkelvraag over lidmaatschap vs pay-and-play.",
    date: "12/05/2026",
    duration: "1u 19min",
    spotifyId: "1LMN79jkHOAvxz6JYb9b8q",
    topics: ["Golf", "PGA Championship", "Golf Tech", "Trackman", "Soudal Open", "Prikkelvraag"],
  },
  {
    number: "04",
    season: "S01",
    title: "#04 Flowering Crab Apple - Soudal uit de doeken | LIV Breakdown | Millenium golf in een notendop",
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
    title: "#03 Flowering Peach - LIV op instorten? | Efficient Scoren | What about EDS?",
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
    title: "#02 Pink Dogwood - Belgische Top op de Interclubs | Europa boven in RBC Heritage | Dresscode, yea or nay",
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
    title: "#01 Tea Olive - McIlroy heer en meester | De roll-back, een goed idee?",
    description:
      "De allereerste aflevering van PAMPAS. Lars, Levi en Niels stellen zichzelf voor en zetten de toon voor wat komen gaat. Voor vragen en opmerkingen: pampas.podcast@gmail.com of via IG @pampas.golfpodcast.",
    date: "14/04/2026",
    duration: "50min 3sec",
    spotifyId: "1hKEnYGCgL5ujRSqpXt4Ix",
    topics: ["Intro", "Ternesse", "The Masters", "Golf", "PGA", "Rollback", "Golf Analyse"],
  },
];

export const latestEpisode = sortEpisodesByReleaseDate(episodes)[0];
