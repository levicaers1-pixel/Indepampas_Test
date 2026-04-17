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
    name: "Lars",
    role: "De Analist",
    handicap: "8.4",
    bio: "Begon met golf op zijn twaalfde op de banen rond Antwerpen. Heeft een onverklaarbare obsessie voor putters en koffie. Zegt dat hij ooit een hole-in-one heeft geslagen — niemand heeft het gezien.",
    favoriteCourse: "Royal Antwerp Golf Club",
    image: host1,
  },
  {
    id: "bram",
    name: "Bram",
    role: "De Slicer",
    handicap: "14.2",
    bio: "De man die elke woensdag een nieuwe driver koopt en elke donderdag spijt heeft. Specialist in slechte beslissingen op par-5's en uitstekende verhalen achteraf.",
    favoriteCourse: "Royal Zoute Golf Club",
    image: host2,
  },
  {
    id: "thijs",
    name: "Thijs",
    role: "De Romanticus",
    handicap: "11.0",
    bio: "Vindt dat golf eerder een wandeling met gereedschap is dan een sport. Houdt van mistige ochtenden, oude leren tassen, en het geluid van een schone iron-shot.",
    favoriteCourse: "Royal Ostend Golf Club",
    image: host3,
  },
];
