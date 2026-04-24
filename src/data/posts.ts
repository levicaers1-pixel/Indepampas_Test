export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
  topics: string[];
  content: string; // markdown-ish; rendered as paragraphs split by blank lines
};

export const posts: Post[] = [
  {
    slug: "witb-team-pampas",
    title: "WITB - Team Pampas",
    excerpt:
      "What's In The Bag? Een blik in de golftassen van Team Pampas — van trouwe wedges tot de driver die we eigenlijk willen vervangen.",
    date: "24/04/2026",
    author: "Team Pampas",
    readTime: "5 min",
    topics: ["WITB", "Materiaal", "Pampas"],
    content:
      "Een klassieker in de golfwereld: de What's In The Bag. Tijd om de tassen van Team Pampas open te trekken en eerlijk te zijn over wat er werkt, wat er blijft liggen, en wat er stiekem aan vervanging toe is.\n\nIn deze post gaan we even door de zakken van onze hosts gaan:\n\nWITB - Levi\n\nDriver: Callaway Rogue LS Triple Diamond met een Fujikura Ventus TR Black 7-X\n\n3 Wood: Stealth 2+ met Mitsubishi Chemical 304SS 70 S\n\nHybride 2 (17°): Ping G400 met Aftermarket Ping X85\n\nI2: Taylormade UDI2 met Tour AD Utility AD-95 X\n\nIjzers: Taylormade P730 met Project X 6.5\n\nWedges: Takomo 52°/56° met KBS Wedges\n\nPutter: Scotty Cameron Phantom 5.5\n\nBal: Titleist Prov1",
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
