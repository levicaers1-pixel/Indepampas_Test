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
    handicap: "—",
    bio: "Bio volgt.",
    favoriteCourse: "—",
    image: host1,
  },
  {
    id: "levi",
    name: "Levi Caers",
    role: "De Professor",
    handicap: "—",
    bio: "Bio volgt.",
    favoriteCourse: "—",
    image: host2,
  },
  {
    id: "niels",
    name: "Niels Jacoby",
    role: "De Romanticus",
    handicap: "—",
    bio: "Bio volgt.",
    favoriteCourse: "—",
    image: host3,
  },
];
