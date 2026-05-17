// PAMPAS Parcours Ratings — data from the Parcours Ratings spreadsheet.
// Scores per host op /100 (Lars hcp +0.6, Levi 3.2, Niels 2.4).
// PAMPAS Score = gewogen gem. van 7 criteria × 10 → /100.

export type CourseRating = {
  slug: string;
  rank: number;
  name: string;
  region: string;
  type: string;
  greenfee: number;
  feeBand: string; // €, €€, €€€, €€€€
  playedOn?: string;
  criteria: {
    ontwerp: number;
    onderhoud: number;
    uitdaging: number;
    landschap: number;
    faciliteiten: number;
    prijsKwaliteit: number;
    gastvrijheid: number;
  };
  hostScores: { lars: number; levi: number; niels: number };
  pampasScore: number;
  verdict: string;
  notes: string;
  findings: string[]; // bullet points for the per-course article
};

export const ratings: CourseRating[] = [
  {
    slug: "royal-antwerp-golf-club",
    rank: 1,
    name: "Royal Antwerp Golf Club",
    region: "Antwerpen",
    type: "Heide",
    greenfee: 155,
    feeBand: "€€€€",
    playedOn: "15/04/2026",
    criteria: { ontwerp: 9, onderhoud: 8, uitdaging: 7, landschap: 9, faciliteiten: 8, prijsKwaliteit: 5, gastvrijheid: 8 },
    hostScores: { lars: 86, levi: 84, niels: 89 },
    pampasScore: 85,
    verdict: "Altijd",
    notes:
      "Tijdloze klassieker met uniek heidekarakter. Smalle fairways, snelle greens. Oudste golfclub van België.",
    findings: [
      "Heide-DNA dat je nergens anders in België in deze vorm vindt — elke hole oogt anders dan de vorige.",
      "Greens zijn snel en eerlijk, fairways smal genoeg om je strategie te dwingen — driver is geen automatisme.",
      "Faciliteiten en clubhuis ademen geschiedenis, maar de €155 greenfee maakt het een gerichte uitspatting, geen losse zaterdag.",
      "Niels gaf zelfs een 89 — de zeldzame keer dat hij geen ‘maar’ vond.",
    ],
  },
  {
    slug: "ternesse-golf-country-club",
    rank: 2,
    name: "Ternesse Golf & Country Club",
    region: "Antwerpen",
    type: "Parkland",
    greenfee: 95,
    feeBand: "€€€",
    playedOn: "28/04/2026",
    criteria: { ontwerp: 8, onderhoud: 9, uitdaging: 8, landschap: 6, faciliteiten: 6, prijsKwaliteit: 8, gastvrijheid: 8 },
    hostScores: { lars: 82, levi: 80, niels: 86 },
    pampasScore: 82,
    verdict: "Altijd",
    notes:
      "Top baan rond Antwerpen. Zeer goed onderhouden en uitdagende layout. Correcte oefenfaciliteiten maar ook niets speciaals.",
    findings: [
      "Layout dwingt nadenken: doglegs, water in beeld, geen pure bommen-en-vergeven baan.",
      "Layout dwingt nadenken: dogleggen, water in beeld, geen pure bommen-en-vergeven baan.",
      "Sfeer is correct maar functioneel; je komt voor de baan, niet voor de range.",
      "Beste prijs-kwaliteit in onze top 3 — €95 voor dit niveau is een no-brainer.",
    ],
  },
  {
    slug: "royal-limburg-golf-club",
    rank: 3,
    name: "Royal Limburg Golf Club",
    region: "Limburg",
    type: "Heide",
    greenfee: 125,
    feeBand: "€€€€",
    criteria: { ontwerp: 9, onderhoud: 7, uitdaging: 7, landschap: 9, faciliteiten: 5, prijsKwaliteit: 6, gastvrijheid: 8 },
    hostScores: { lars: 86, levi: 80, niels: 83 },
    pampasScore: 81,
    verdict: "Altijd",
    notes:
      "Altijd fijn om hier te spelen, vooral als de heide in bloei staat. Mooie layout in een mooi kader. Limburgse gastvrijheid op en rond de golf.",
    findings: [
      "Visueel de mooiste baan in de top 5 — paarse heide tegen dennen blijft een postcard.",
      "Layout-cijfer (9) ligt hoog: routing en hole-variatie zijn klasse, ook al is het onderhoud een tikje minder dan Ternesse.",
      "Layout-cijfer (9) ligt hoog: routing en hole-variatie zijn klasse, ook al is het onderhoud niet altijd van het hoogste niveau.",
      "Limburgse gastvrijheid maakt veel goed; mensen onthouden hier het onthaal evenveel als de baan.",
    ],
  },
  {
    slug: "golf-de-rignee",
    rank: 4,
    name: "Golf de Rignée",
    region: "Waals-Brabant",
    type: "Inland Links",
    greenfee: 120,
    feeBand: "€€€€",
    criteria: { ontwerp: 8, onderhoud: 8, uitdaging: 8, landschap: 6, faciliteiten: 7, prijsKwaliteit: 6, gastvrijheid: 8 },
    hostScores: { lars: 78, levi: 88, niels: 78 },
    pampasScore: 80,
    verdict: "Oui",
    notes: "Jammerlijke hole 1, verder prima baan met uitdagende condities mogelijk.",
    findings: [
      "Inland-links concept werkt: wind speelt mee en bumps & rolls dwingen creatievere shots.",
      "Hole 1 is een gemiste kans — een zwakke opener voor een baan die daarna doorzet.",
      "Levi’s 88 trekt de score recht; Lars en Niels (beide 78) vonden de €120 te scherp voor wat je krijgt.",
      "De moeite als je in Waals-Brabant bent, geen pure pelgrimage waard. Tenzij je Levi's mening blindelings volgt.",
    ],
  },
  {
    slug: "edegemse-golfclub-drie-eycken",
    rank: 5,
    name: "Edegemse Golfclub - Drie Eycken",
    region: "Antwerpen",
    type: "Parkland",
    greenfee: 55,
    feeBand: "€",
    criteria: { ontwerp: 6, onderhoud: 6, uitdaging: 6, landschap: 5, faciliteiten: 7, prijsKwaliteit: 8, gastvrijheid: 7 },
    hostScores: { lars: 68, levi: 72, niels: 65 },
    pampasScore: 67,
    verdict: "Niet opzettelijk",
    notes:
      "Prima 9 holes baan op een efficiente ligging. Leuk om mee te nemen als je snel een rondje wilt lopen.",
    findings: [
      "Snel-en-vlug optie net buiten Antwerpen — perfect voor een ronde na het werk.",
      "Geen baan die je herinneringen geeft, maar voor €55 ook geen baan die je teleurstelt.",
      "Prijs-kwaliteit (8) is het hoogste in onze ratings; verwacht alleen geen signatuurholes.",
      "‘Niet opzettelijk’ vat het samen: als je in de buurt bent, prima — niemand plant hier een golftrip rond.",
    ],
  },
];

export const ratingMethodology = {
  intro:
    "De PAMPAS Score is een gewogen gemiddelde van 7 criteria (elk /10), uitgedrukt op 100. Lars (+0.6), Levi (3.2) en Niels (2.4) scoren elk apart; de hostgemiddelden lopen ernaast.",
  weights: [
    { name: "Ontwerp & Layout", weight: "20%", what: "Variatie in holes, gebruik van terrein, signatuurholes, risico/beloning." },
    { name: "Onderhoud", weight: "20%", what: "Kwaliteit van fairways, greens, rough en bunkers." },
    { name: "Uitdaging", weight: "15%", what: "Eerlijke uitdaging voor alle handicaps, interessante scoremogelijkheden." },
    { name: "Landschap & Sfeer", weight: "15%", what: "Visuele schoonheid, omgeving, karakter en sfeer op het parcours." },
    { name: "Faciliteiten", weight: "10%", what: "Clubhuis, oefenruimte, kleedkamers, bar en eten." },
    { name: "Prijs-kwaliteit", weight: "10%", what: "Greenfee vs. de geboden ervaring." },
    { name: "Gastvrijheid", weight: "10%", what: "Onthaal, personeel, speeltempobeheer." },
  ],
  legend: [
    { range: "80 – 100", label: "Topklasse", desc: "Must-play. Absoluut de moeite." },
    { range: "70 – 79", label: "Sterk", desc: "Zeer aanrader. Zeker bezoeken." },
    { range: "55 – 69", label: "Degelijk", desc: "Goed parcours, context afhankelijk." },
    { range: "< 55", label: "Gemiddeld", desc: "Teleurstelling of specifiek publiek." },
  ],
};

export function getRatingBySlug(slug: string) {
  return ratings.find((r) => r.slug === slug);
}
