export type HostName = "Lars" | "Levi" | "Niels";

export type CriterionKey =
  | "score_design"
  | "score_condition"
  | "score_challenge"
  | "score_scenery"
  | "score_facilities"
  | "score_value"
  | "score_hospitality";

export const CRITERIA: { key: CriterionKey; label: string; weight: number }[] = [
  { key: "score_design", label: "Ontwerp & Layout", weight: 0.2 },
  { key: "score_condition", label: "Onderhoud", weight: 0.2 },
  { key: "score_challenge", label: "Uitdaging", weight: 0.15 },
  { key: "score_scenery", label: "Landschap & Sfeer", weight: 0.15 },
  { key: "score_facilities", label: "Faciliteiten", weight: 0.1 },
  { key: "score_value", label: "Prijs-kwaliteit", weight: 0.1 },
  { key: "score_hospitality", label: "Gastvrijheid", weight: 0.1 },
];

export type Persona = {
  name: HostName;
  handicap: string;
  tagline: string;
  description: string;
  color: string;
  bgLight: string;
  affinities: Record<CriterionKey, number>;
  loves: string[];
  icon: string;
};

export const HOST_PERSONAS: Record<HostName, Persona> = {
  Lars: {
    name: "Lars",
    handicap: "+0.6",
    tagline: "De Perfectionist",
    description:
      "Lars scoort streng op ontwerp en uitdaging. Als de layout niet klopt, vergeeft hij niets. Zijn ideale baan is technisch, eerlijk en tijdloos. ",
    color: "#4A9EDB",
    bgLight: "#0F2436",
    affinities: {
      score_design: 1.4,
      score_condition: 1.2,
      score_challenge: 1.3,
      score_scenery: 0.8,
      score_facilities: 0.7,
      score_value: 0.8,
      score_hospitality: 0.8,
    },
    loves: ["Heide", "Links"],
    icon: "🎯",
  },
  Levi: {
    name: "Levi",
    handicap: "3.2",
    tagline: "De Ervaringszoeker",
    description:
      "Levi wil een complete golfdag. Sfeer, omgeving en gastvrijheid tellen mee — een mooie baan in een prachtig kader met een goed glas nadien is zijn ideaal.",
    color: "#2DBF7E",
    bgLight: "#0F2A20",
    affinities: {
      score_design: 1.0,
      score_condition: 0.9,
      score_challenge: 0.8,
      score_scenery: 1.5,
      score_facilities: 1.3,
      score_value: 1.1,
      score_hospitality: 1.4,
    },
    loves: ["Parkland", "Heide"],
    icon: "🌄",
  },
  Niels: {
    name: "Niels",
    handicap: "2.4",
    tagline: "De Pragmaticus",
    description:
      "Niels kijkt naar de totaalscore voor zijn geld. Prijs-kwaliteit is heilig. Een eerlijke, goed onderhouden baan die niet overdreef met haar greenfee — dat is zijn maatstaf.",
    color: "#DB6B4A",
    bgLight: "#2E1810",
    affinities: {
      score_design: 1.0,
      score_condition: 1.3,
      score_challenge: 1.2,
      score_scenery: 0.9,
      score_facilities: 0.8,
      score_value: 1.6,
      score_hospitality: 0.8,
    },
    loves: ["Inland Links", "Parkland"],
    icon: "💶",
  },
};

export const HOSTS: HostName[] = ["Lars", "Levi", "Niels"];
