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
