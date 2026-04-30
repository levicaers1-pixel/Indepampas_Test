export type RichBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "subtitle"; text: string }
  | { type: "quote"; text: string }
  | { type: "stats"; items: { num: string; label: string }[] }
  | { type: "badges"; items: { num: string; title: string; text: string }[] }
  | { type: "source"; text: string };

export type Post = {
  slug: string;
  title: string;
  /** Optional alternate title with <em> styling for the hero (HTML allowed for <em> only) */
  titleHtml?: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
  topics: string[];
  /** Plain text content split by blank lines (legacy posts). */
  content: string;
  /** Optional rich blocks; when present, used instead of `content`. */
  richContent?: RichBlock[];
  /** Optional source/category line shown in the sidebar. */
  category?: string;
  sourceName?: string;
  sourceUrl?: string;
  /** Optional custom layout key for one-off post designs. */
  customLayout?: "witb";
};

export const posts: Post[] = [
  {
    slug: "route-36-just-golf",
    title: "Route 36 — Jouw persoonlijk startpistool",
    titleHtml: "Route 36 —<br/>Jouw persoonlijk<br/><em>startpistool</em>.",
    excerpt:
      "Hoe Golf Vlaanderen het leren golfen hertekende van een stresstest naar een spelenderwijs avontuur — met badges, een app en geen examenstress.",
    date: "30/04/2026",
    author: "PAMPAS Redactie",
    readTime: "5 min",
    topics: ["Handicap", "Starters", "GVB", "België"],
    category: "Beginners Golf · Federatie · BEgolf",
    sourceName: "Golf Vlaanderen",
    sourceUrl: "https://www.golfvlaanderen.be/justgolfroute",
    content:
      "Wil je beginnen met golf in België maar heb je geen idee waar te starten? Dan is Route 36 — intussen officieel omgedoopt tot de Just Golf route — precies wat je nodig hebt.",
    richContent: [
      {
        type: "subtitle",
        text: "Hoe Golf Vlaanderen het leren golfen hertekende van een stresstest naar een spelenderwijs avontuur.",
      },
      {
        type: "p",
        text: "Wil je beginnen met golf in België maar heb je geen idee waar te starten? Dan is <strong>Route 36</strong> — intussen officieel omgedoopt tot de <strong>Just Golf route</strong> — precies wat je nodig hebt. Dit persoonlijk begeleidingstraject van Golf Vlaanderen vervangt het vroegere GVB-systeem met zijn zware examens en verplichte testen. Het doel is simpel: elke nieuwe golfer spelenderwijs naar een eerste officiële handicap begeleiden.",
      },
      {
        type: "stats",
        items: [
          { num: "3.000+", label: "drop-outs per jaar" },
          { num: "50%", label: "stopt binnen 2 jaar" },
          { num: "54", label: "eerste officiële hcp" },
          { num: "6", label: "badges te verzamelen" },
        ],
      },
      { type: "h2", text: "Waarom bestaat Route 36?" },
      {
        type: "p",
        text: "Golf Vlaanderen stelde een ongemakkelijke waarheid vast: de helft van alle drop-out — meer dan 3.000 golfers per jaar — stopt bij spelers die nog geen twee jaar actief zijn én de drempel van handicap 36 nog niet gehaald hebben. Het waren mensen die de sport graag zagen, maar ergens onderweg afhaken. Route 36 is het antwoord op die stilte.",
      },
      {
        type: "quote",
        text: "Het traject verloopt in je eigen tempo. Geen druk op slechte rondes — die tellen gewoon niet mee voor je handicap.",
      },
      {
        type: "p",
        text: "Met de Just Golf route worden starters beter begeleid, terwijl de club toch haar eigen accenten kan leggen. Zo kan het einddoel bij sommige clubs liggen op hcp 54, 45 of 36 — afhankelijk van de infrastructuur en het sportief beleid van de club.",
      },
      { type: "h2", text: "Hoe werkt het traject?" },
      {
        type: "p",
        text: "Het systeem werkt met <strong>badges</strong>. Elke badge staat voor een fase in het traject en verschijnt in de <strong>BEgolf-app</strong> zodra je ze behaalt. De volgorde is flexibel en verschilt van club tot club — maar het uniforme moment is het spelenderwijs behalen van je eerste handicap 54.",
      },
      {
        type: "badges",
        items: [
          {
            num: "Badge 01",
            title: "Welkom — Activatie lidmaatschap",
            text: "Zodra je je aanmeldt bij de club, registreert die jou via een startpas of federatiekaart. Je bent meteen correct verzekerd, geniet van federatiekaartvoordelen en krijgt toegang tot de BEgolf-app — het digitale hart van het traject.",
          },
          {
            num: "Badge 02",
            title: "Skills — Leer golfen",
            text: "Afslag, lange slagen, chippen, pitchen, bunkerwerk: hier bouw je de technische basis op. Een bevoegde persoon van de club — begeleider, lesgever of captain — kent de badge toe. Scoor je 7 op 10 of meer, dan behaal je een volledige badge.",
          },
          {
            num: "Badge 03",
            title: "Theorie — Begrijp de golfsport",
            text: "Golf draait niet alleen om fysieke vaardigheden, maar ook om de regels en de code of conduct van de sport. Via de BEgolf-app oefen je al je regelkennis en kleur je je badge halfvol. Haal je 24 op 30 bij de clubproef? Dan is de volledige badge van jou.",
          },
          {
            num: "Badge 04",
            title: "Course Ready — Eerste stappen op het gras",
            text: "Je betreedt de Compact Course of speelt vanaf de verkorte tees. Slechte scores worden niet meegenomen in je historiek — je bouwt zonder druk vertrouwen op. Precies zoals golf zou moeten voelen.",
          },
          {
            num: "Badge 05",
            title: "On the Course — Jouw eerste Hcp 54",
            text: "Je behaalt je eerste officiële WHS-handicap door over 9 holes een score van 27 of lager te neerzetten. Vanaf dit moment openen de greenfee-mogelijkheden via de BEgolf-app — en is de wereld van de golf letterlijk van jou.",
          },
          {
            num: "Badge 06",
            title: "Just Golf — Missie geslaagd",
            text: "Afhankelijk van de club eindig je op hcp 54, 45 of 36. Met deze ultieme badge heb je het doel bereikt. Via clubwedstrijden kun je je handicap verder blijven verbeteren. Het echte spel begint nu pas.",
          },
        ],
      },
      { type: "h2", text: "De BEgolf-app: jouw digitale caddie" },
      {
        type: "p",
        text: "De app is de centrale plek voor je volledige Route 36-traject. Je installeert hem via je federatienummer en persoonlijk wachtwoord. Je volgt er je voortgang op, oefent je regelkennis, boekt greenfees op andere clubs en schrijft je in voor clubwedstrijden. Elke badge die je behaalt, verschijnt er live — een kleine, maar merkbare motivatie om door te zetten.",
      },
      { type: "quote", text: "\u201CGeen zorgen, Just Golf.\u201D — Golf Vlaanderen" },
      { type: "h2", text: "Klaar om te starten?" },
      {
        type: "p",
        text: "Route 36 maakt van golf wat het altijd had moeten zijn: toegankelijk, plezierig en op jouw tempo. Geen zware examens, geen onnodige druk op slechte rondes. Gewoon stap voor stap, badge per badge, richting je eerste officiële handicap. Contacteer een golfclub bij jou in de buurt en vraag naar het Just Golf traject.",
      },
      {
        type: "source",
        text: "Bron: Golf Vlaanderen & golfvlaanderen.be — Route 36 / Just Golf route documentatie",
      },
    ],
  },
  {
    slug: "witb-team-pampas",
    title: "WITB — Team Pampas",
    excerpt:
      "Een blik in de golftassen van Team Pampas — van trouwe wedges tot de driver die we eigenlijk willen vervangen.",
    date: "30/04/2026",
    author: "Team Pampas",
    readTime: "4 min",
    topics: ["WITB", "Materiaal", "Pampas"],
    customLayout: "witb",
    content:
      "Een klassieker in de golfwereld: de What's In The Bag. Tijd om de tassen van Team Pampas open te trekken en eerlijk te zijn over wat er werkt, wat er blijft liggen, en wat er stiekem aan vervanging toe is.",
  },
  {
    slug: "welkom-op-de-pampas-blog",
    title: "Welkom op de Pampas Blog",
    excerpt:
      "Een nieuwe plek om dieper in te gaan op de onderwerpen die we in de podcast aanraken — van Belgische banen tot tourtalk.",
    date: "24/04/2026",
    author: "Lars Masyn",
    readTime: "2 min",
    topics: ["Aankondiging", "Pampas"],
    content:
      "Welkom op de Pampas blog. Hier nemen we de tijd om dieper in te gaan op de onderwerpen die in de podcast voorbij komen.\n\nVerwacht je aan reviews van Belgische banen, korte analyses van tournooien, en af en toe een opinie die misschien wat te scherp uit de hoek komt.\n\nHeb je een idee voor een blogpost? Stuur ons gerust een bericht via de contactpagina.",
  },
];

export const getPostBySlug = (slug: string) => posts.find((p) => p.slug === slug);
