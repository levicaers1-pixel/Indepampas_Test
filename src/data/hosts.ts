import host1 from "@/assets/host-1.jpg";
import host2 from "@/assets/host-2.jpg";
import host3 from "@/assets/host-3.jpg";

export type Host = {
  id: string;
  name: string;
  role: string;
  handicap: string;
  bio: string;
  favoriteCourse: string;
  image: string;
};

export const hosts: Host[] = [
  {
    id: "lars",
    name: "Lars Masyn",
    role: "De Diplomaat",
    handicap: "+0.6",
    bio: "Bio volgt.",
    favoriteCourse: "Ternesse Golf & Country Club",
    image: host1,
  },
  {
    id: "levi",
    name: "Levi Caers",
    role: "De Professor",
    handicap: "3.2",
    bio: "Bio volgt.",
    favoriteCourse: "Ternesse Golf & Country Club",
    image: host2,
  },
  {
    id: "niels",
    name: "Niels Jacoby",
    role: "De Romanticus",
    handicap: "2.4",
    bio: " De host met de ludieke verhalen, gekke toevoegingen en ongezouten mening.\n\nOndertussen al 23 jaar bezig met golf, golvend tussen diepe dalen en hoge hoogtes.\n\nVan bijna landskampioen in de interclubs van België tot niet meer weten hoe een fatsoenlijke golfbal te slaan.\n\nDankzij golf al op zeer mooie plekken in de wereld geweest, zoals St Andrews in Schotland waar je letterlijk op de geboorte fairways van de golfsport loopt.\n\nPutten is mijn favoriet een ijzer 4 slaan kan ik dan weer niet.\n\nHopelijk mogen onze golfshots elkaar kruisen tijdens een wedstrijd of een potje bier golf.\n\n \n\nXOXO je kapoen Niels",
    favoriteCourse: "Ternesse Golf & Country Club",
    image: host3,
  },
];
