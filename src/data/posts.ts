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
          { num: "14", label: "badges te verzamelen" },
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
    slug: "boom-in-de-fairway",
    title: "De boom staat er gewoon",
    titleHtml: "De boom<br/>staat er<br/><em>gewoon.</em>",
    excerpt:
      "Een rondleiding langs de meest irritante, meest geliefde en meest Belgische obstakels op onze golfbanen: de boom midden in de fairway.",
    date: "30/04/2026",
    author: "PAMPAS Redactie",
    readTime: "7 min",
    topics: ["Parcourscultuur", "België", "Baan-design"],
    category: "Parcourscultuur · België · Baan-design",
    richContent: [
      { type: "subtitle", text: "Een rondleiding langs de meest irritante, meest geliefde en meest Belgische obstakels op onze golfbanen: de boom midden in de fairway." },
      { type: "p", text: "Hij staat er al twintig jaar. Misschien dertig. Niemand weet nog precies waarom, niemand heeft hem geplant met de intentie om jouw drive te verpesten — en toch doet hij dat, elke keer weer, met de serene rust van iemand die weet dat hij gelijk heeft. De boom midden in de fairway is een Belgisch fenomeen van de eerste orde: tegelijk obstakel, landmark en stille getuige van duizenden gevloekte slagen." },
      { type: "p", text: "Wij trokken de stoute schoenen aan en maakten een inventaris op. Geen wetenschappelijk onderzoek, geen officiële studie — gewoon een lijst van holes waarop de natuur besloten heeft om het woord te nemen. In totaal identificeerden we <strong>33 holes</strong> op Belgische golfbanen waar een boom, een bomenrij of een opvallend houtachtig wezen zijn permanente woonst heeft gevonden op het rechte pad tussen tee en green." },
      { type: "stats", items: [
        { num: "33", label: "holes met boom(en)" },
        { num: "20+", label: "verschillende clubs" },
        { num: "7", label: "clubs met 2+ holes" },
        { num: "∞", label: "gevloekte slagen" },
      ]},
      { type: "h2", text: "Waarom bestaat de fairway-boom eigenlijk?" },
      { type: "p", text: "De eerlijke waarheid: de meeste bomen stonden er al voor de baan aangelegd werd. Een architect tekende de hole eromheen, of deed alsof hij dat deed, en zo werd een eik of een beuk opeens een strategisch element. Anderen werden geplant als landmark, als schaduwgever, of gewoon omdat iemand op het bestuur een zwak had voor linden. En dan is er nog de categorie die gewoon spontaan opgegroeid is terwijl niemand keek." },
      { type: "p", text: "Hoe dan ook: ze zijn er. Ze gaan niet weg. En ergens — als je eerlijk bent na een koude Duvel op de terras — hou je er wel van. Ze maken de hole. Ze dwingen je om na te denken. Ze scheiden de dragers van de lijders." },
      { type: "quote", text: "Links golf heeft bunkers. Belgisch golf heeft bomen. En die bomen winnen altijd." },
      { type: "h2", text: "De toppers: clubs met meerdere boombeschermde holes" },
      { type: "p", text: "Sommige clubs gaan all-in. Keerbergen heeft er drie, Millennium maar liefst drie, Hasselt drie, Steenhoven twee, Limburg drie, Oudenaarde Anker twee, en Enghien twee. Dat is geen toeval — dat is een filosofie. Of gewoon een heel oud bos." },
      { type: "p", text: "Een bijzondere vermelding voor de holes met een asterisk (*) in onze lijst: dat zijn de plaatsen waar de boom er wel staat, maar niet helemaal centraal. Een halve blokkade dus. Genoeg om twijfel te zaaien, maar niet genoeg om je een volwaardige uitweg te ontzeggen. Sommige golfers vinden dat het ergste van de twee opties." },
      { type: "h2", text: "De volledige lijst: hole per hole" },
      { type: "p", text: "Hieronder vind je alle geïnventariseerde holes, netjes geordend per club. Holes met een (*) zijn die waarbij de boom niet centraal staat maar wel degelijk in het spel komt. Beschouw het als een waarschuwing — of als een uitnodiging om te gaan kijken." },
      { type: "badges", items: [
        { num: "Club 01", title: "Golf Kempense — Holes 13 & 18", text: "Twee holes, twee bomen, één consistente boodschap: Kempense houdt van karakter. Hole 13 is de bekendste boomspeelhole van de baan — de boom staat er fier en centraal. Hole 18 laat je afsluiten met een doordacht afscheidsgebaar richting het groen." },
        { num: "Club 02", title: "Golf Kampenhout — Hole 1", text: "Een bewuste eerste indruk. Kampenhout gooit meteen op hole 1 een boom in de weg. Welkom, beste golfer. Laat je sticks maar zingen — of je lijn maar aanpassen." },
        { num: "Club 03", title: "Golf Hasselt — Holes 1, 2 & 14", text: "Hasselt doet het grondig. Drie holes, drie obstakels. Je weet meteen hoe laat het is op hole 1, en als je denkt dat je het onder controle hebt, herinnert hole 14 je eraan dat niks vanzelfsprekend is." },
        { num: "Club 04", title: "Golf de Rigenée — Hole 1", text: "Rigenée, diep in de Brabantse heuvels, ontvangt zijn spelers met een boom op de eerste hole. Een warme begroeting, Waalse stijl." },
        { num: "Club 05", title: "Golf Koksijde — Hole 11", text: "Aan de kust, waar de wind al genoeg doet, voelt een boom in de fairway bijna als overkill. En toch: hole 11 op Koksijde bewijst dat ook duinengolf niet immuun is voor het fenomeen." },
        { num: "Club 06", title: "Golf Steenhoven — Holes 5 & 11", text: "Steenhoven heeft twee holes waar een boom de spellogica compliceert. Hole 5 en hole 11 liggen ver genoeg uit elkaar om je elke keer opnieuw te verrassen, alsof je het de eerste keer al vergeten bent." },
        { num: "Club 07", title: "Golf Mont Garni — Hole 14", text: "In de Henegouwse Borinage, op een baan die voor veel Vlamingen onontgonnen terrein is, staat op hole 14 een boom die wacht. Rustig. Geduldig. Altijd." },
        { num: "Club 08", title: "Golf Limburg — Holes 13, 17* & 18*", text: "Drie holes, waarvan twee met een asterisk. Hole 13 is de centrale boomaanwezigheid. Op hole 17 en 18 staat de boom er ietwat half — hij staat er en hij staat er ook niet helemaal. Genoeg voor twijfel. Genoeg voor debat aan de bar achteraf." },
        { num: "Club 09", title: "Golf Drie Eycken — Hole 3", text: "De naam van de club verraadt al iets over de relatie met bomen. Op hole 3 krijgt die relatie een concrete vorm: een boom midden in de lijn." },
        { num: "Club 10", title: "Golf Keerbergen — Holes 3*, 7* & 12", text: "Keerbergen speelt het slim: holes 3 en 7 hebben een boom die het midden niet helemaal opeist (*), maar hole 12 compenseert dat met een boom die er vol voor gaat. Een baan die je op drie momenten aan het twijfelen brengt." },
        { num: "Club 11", title: "Golf Oudenaarde Anker — Holes 14 & 17", text: "Oudenaarde heeft twee courses en de Anker-baan rekent op twee fairway-bomen om zijn identiteit te verdedigen. Hole 14 en 17 — allebei in de tweede helft van de ronde, precies wanneer de concentratie wat wegebt." },
        { num: "Club 12", title: "Golf Oudenaarde Kasteel — Hole 13", text: "Ook op de Kasteel-course van Oudenaarde staat er eentje klaar. Hole 13 — klassiek golfgetal voor klassiek golfkarakter." },
        { num: "Club 13", title: "Golf Cleydael — Hole 2", text: "Cleydael, de Antwerpse kasteelbaan, heeft op hole 2 een boom die je al vroeg in de ronde laat nadenken over wie hier eigenlijk de baas is." },
        { num: "Club 14", title: "Golf Millennium — Holes 3*, 8* & 10*", text: "Millennium is de kampioen van de halve blokkade. Drie holes met een asterisk — drie bomen die niet helemaal centraal staan maar je toch alle kanten op sturen. Het is bijna artistiek: aanwezig genoeg om je beslissing te beïnvloeden, bescheiden genoeg om je nadien te laten twijfelen of je er last van had." },
        { num: "Club 15", title: "Golf Mergelhof — Hole 12", text: "In het Limburgse heuvelland heeft Mergelhof op hole 12 een boom die past bij het landschap: groot, robuust en niet van plan om zich te verontschuldigen." },
        { num: "Club 16", title: "Golf Spiegelven — Hole 4", text: "Spiegelven ligt in de Kempen, in een landschap van heide en naaldbomen. Dat hole 4 er ook eentje in de fairway heeft staan, voelt bijna logisch." },
        { num: "Club 17", title: "Golf Enghien — Holes 5 & 18", text: "Enghien laat je beginnen én eindigen met een boom. Hole 5 voor het vroege twijfelmoment, hole 18 voor de dramatische finale. Wie zegt dat Belgisch golf geen verhaalstructuur heeft?" },
        { num: "Club 18", title: "Golf Rinkven South — Hole 4", text: "Rinkven, een van de meest gerenommeerde clubs van het land, heeft ook zijn boom. Hole 4 op de South course. Niet toevallig op een van de mooiste holes van de baan." },
        { num: "Club 19", title: "Golf Waterloo Lion — Hole 4", text: "Aan de voet van de Leeuw van Waterloo staat op hole 4 een boom die minstens even onwrikbaar is als het monument op de heuvel. Napoleon had al problemen met de omgeving — jij ook." },
        { num: "Club 20", title: "Golf Rougemont — Hole 4", text: "Rougemont, in de Brabantse Waalse heuvels, heeft op hole 4 een boom die de setting compleet maakt. Groen, stil, en precies daar waar je hem niet wil." },
        { num: "Club 21", title: "Golf Durbuy — Hole 13", text: "Durbuy, de kleinste stad ter wereld, heeft een baan die allesbehalve klein speelt. Hole 13 heeft een boom die past bij de Ardense stijl: wild, onverwacht en absoluut niet te negeren." },
      ]},
      { type: "h2", text: "Wat doe je ermee?" },
      { type: "p", text: "Er zijn drie soorten golfers als ze een boom in de fairway zien. De eerste type slaat er gewoon omheen, kiest veilig, en accepteert dat de baan de architect heeft. Het tweede type probeert erdoorheen te spelen, ontdekt dat bomen daadwerkelijk hout zijn, en scoort een extra slag. Het derde type — de ware romanticus — ziet de boom als kans, speelt een prachtige fade of draw rondom het obstakel, en staat die avond nog te vertellen over die ene swing op hole 13 van de Kempense." },
      { type: "p", text: "De waarheid is dat fairway-bomen Belgisch golf maken tot wat het is: minder perfect dan een moderne strokesavers-baan, maar veel meer een gesprek. Elke boom heeft een naam die niemand hem gegeven heeft maar iedereen kent. Elke boom heeft een verhaal. En elke boom wacht rustig op je volgende bezoek." },
      { type: "quote", text: "Hij staat er al twintig jaar. Hij gaat er nog twintig jaar staan. En eerlijk? We zouden het niet anders willen." },
      { type: "h2", text: "Help ons de lijst aanvullen" },
      { type: "p", text: "Dit is geen gesloten inventaris. Integendeel: we zijn ervan overtuigd dat er nog tientallen bomen zijn die wachten op erkenning. Ken jij een hole waar een boom de fairway in tweeën deelt, een line-up belemmert of gewoon staat te lachen terwijl jij zoekt? Stuur het ons door. We houden de lijst bij. We gaan ze allemaal spelen." },
      { type: "source", text: "Samengesteld door PAMPAS · Belgische golfbanen · 2026" },
    ],
    content:
      "Hij staat er al twintig jaar. Misschien dertig. De boom midden in de fairway is een Belgisch fenomeen — tegelijk obstakel, landmark en stille getuige van duizenden gevloekte slagen.",
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
