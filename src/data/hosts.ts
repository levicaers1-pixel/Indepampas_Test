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
    bio: "De host die golf bekijkt als een exacte wetenschap. Ook een 20-tal jaren actief in het eeuwige mysterie dat de naam Golf draagt.\nLange tijd heeft hij kunnen dingen naar de titel van snelste tempo van de Lange Landen, toen kwam het verstand en werd de zoektocht naar efficiëntie ingezet.\nDoor zijn voorliefde voor blades is hij geëvolueerd naar een ball-striker pur sang. De keerzijde is dat een halve wedge hem dan weer een stuk minder goed ligt.\nAls hij één ding kan bekennen, is het dat hij geen 75% kent, enkel 110%\n\n\n\"If you're not using DECADE, you're doing it wrong.\" - Levi",
    favoriteCourse: "Ternesse Golf & Country Club",
    image: host2,
  },
  {
    id: "niels",
    name: "Niels Jacoby",
    role: "De Romanticus",
    handicap: "2.4",
    bio: "De host met de ludieke verhalen, gekke toevoegingen en ongezouten mening. Ondertussen al 23 jaar bezig met golf, golvend tussen diepe dalen en hoge hoogtes. Van bijna landskampioen in de interclubs van België tot niet meer weten hoe een fatsoenlijke golfbal te slaan. Dankzij golf al op zeer mooie plekken in de wereld geweest, zoals St Andrews in Schotland waar je letterlijk op de geboorte fairways van de golfsport loopt. Putten is mijn favoriet een ijzer 4 slaan kan ik dan weer niet. Hopelijk mogen onze golfshots elkaar kruisen tijdens een wedstrijd of een potje bier golf.   XOXO je kapoen Niels",
    favoriteCourse: "Ternesse Golf & Country Club",
    image: host3,
  },
];
