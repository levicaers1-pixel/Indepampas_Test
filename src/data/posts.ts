export type RichBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "subtitle"; text: string }
  | { type: "quote"; text: string }
  | { type: "stats"; items: { num: string; label: string }[] }
  | { type: "badges"; items: { num: string; title: string; text: string }[] }
  | { type: "table"; headers: string[]; rows: string[][] }
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
  sourceLabel?: string;
  sourceLinkLabel?: string;
  sourceSubtitle?: string;
  /** Optional custom layout key for one-off post designs. */
  customLayout?: "witb" | "golfmedia";
  /** Optional SEO meta description override (50–160 chars). Falls back to excerpt. */
  seoDescription?: string;
};

export const posts: Post[] = [
  {
    slug: "beste-golfbanen-rond-antwerpen",
    title: "Beste golfbanen rond Antwerpen: de Pampas-ranking",
    excerpt:
      "Wij speelden de golfbanen rond Antwerpen en rangschikten ze. Van Rinkven tot Royal Antwerp: dit is de Pampas-ranking, aangevuld met wat we nog niet speelden.",
    seoDescription:
      "Wij speelden de golfbanen rond Antwerpen en rangschikten ze. Van Rinkven tot Royal Antwerp: dit is de Pampas-ranking, aangevuld met wat we nog niet speelden.",
    date: "08/08/2026",
    author: "PAMPAS Redactie",
    readTime: "6 min",
    topics: ["golfbanen", "Antwerpen", "België", "ranking"],
    category: "Ranking",
    sourceName: "PAMPAS Redactie",
    sourceLabel: "Bron",
    content:
      "De regio rond Antwerpen is een van de rijkste golfgebieden van België. Wij speelden de meeste banen zelf en rangschikten ze in de Pampas-ranking.",
    richContent: [
      {
        type: "subtitle",
        text: "De regio rond Antwerpen is een van de rijkste golfgebieden van België: heidebanen, kasteeldomeinen en een DP World Tour-waardige lay-out liggen hier allemaal binnen een half uur van elkaar.",
      },
      {
        type: "p",
        text: "Wij (Lars, Levi en Niels van Pampas) speelden de meeste van deze banen zelf en gaven elk onze score. In dit overzicht rangschikken we ze — en zijn we ook eerlijk over de banen die we nog niet gespeeld hebben.",
      },
      { type: "h2", text: "Hoe wij scoren" },
      {
        type: "p",
        text: "Elke Pampas-host beoordeelt een baan op zeven onderdelen — design, onderhoud, uitdaging, scenery, faciliteiten, prijs-kwaliteit en gastvrijheid — en dat resulteert in een Pampas-score op 100. Wanneer meerdere hosts dezelfde baan speelden, gebruiken we het gemiddelde voor de ranking.",
      },
      { type: "h2", text: "De Pampas-ranking: golfbanen rond Antwerpen die we speelden" },
      {
        type: "badges",
        items: [
          {
            num: "01",
            title: "Rinkven Golf & Country Club — 83,3/100",
            text: "Heidebaan, 36 holes (2 × 18), Schilde. Thuisbasis van de Soudal Open op de DP World Tour. Lars 85,0 · Levi 81,5.",
          },
          {
            num: "02",
            title: "Royal Antwerp Golf Club — 83,2/100",
            text: "Heidebaan, 18 holes, Kapellen. De oudste en meest iconische club van de lijst. Lars 85,0 · Niels 84,5 · Levi 80,0.",
          },
          {
            num: "03",
            title: "Ternesse Golf & Country Club — 82,1/100",
            text: "Parkland, 18 holes, Wommelgem. Technische parkbaan die de voorbije jaren fors gegroeid is. Lars 85,0 · Niels 83,3 · Levi 78,0.",
          },
          {
            num: "04",
            title: "Golf Club Beveren — 69,0/100",
            text: "Parkland, 9 holes. Laagdrempelige baan net buiten de Antwerpse rand. Levi 69,0.",
          },
          {
            num: "05",
            title: "Edegemse Golfclub - Drie Eycken — 62,5/100",
            text: "Parkland, 18 holes, Edegem. De meest toegankelijke baan in de lijst. Levi 63,5 · Niels 61,5.",
          },

        ],
      },
      { type: "h2", text: "1. Rinkven Golf & Country Club — 83,3/100" },
      { type: "p", text: "Heidebaan, 36 holes (2 × 18: North en South), Schilde." },
      {
        type: "p",
        text: "Rinkven is de baan met de hoogste score in deze lijst, en niet toevallig: het is de thuisbasis van de Soudal Open op de DP World Tour. Lars gaf <strong>85,0</strong>, Levi <strong>81,5</strong> — samen goed voor een Pampas-score van 83,3.",
      },
      {
        type: "quote",
        text: '"Uitdagende DP World Tour baan in nagenoeg perfecte staat. Zeer uitgebreide en kwalitatieve oefenfaciliteiten." — Lars (85,0), "Topbaan"',
      },
      {
        type: "p",
        text: 'Levi was even enthousiast (81,5, "Prachtig"): "Rinkven heeft alles te bieden, en dit voor elk type golfer. De North course is een prachtige en uitdagende baan die 8 holes lang top focus vereist. De South course begint met een iets wat eentonige front nine maar maakt dit goed met een fantastische back nine. De gemengde Soudal Open baan hier is de kers op de taart." Beide hosts zouden zeker terugkeren.',
      },
      { type: "h2", text: "2. Royal Antwerp Golf Club — 83,2/100" },
      { type: "p", text: "Heidebaan, 18 holes, Kapellen." },
      {
        type: "p",
        text: "De enige baan in deze lijst die alle drie de hosts scoorden: Lars <strong>85,0</strong>, Niels <strong>84,5</strong> en Levi <strong>80,0</strong>.",
      },
      {
        type: "quote",
        text: '"Royal Antwerp is voor mij numero uno van België! Elke golfronde daar is prachtig en een ongekend genot." — Niels (84,5)',
      },
      {
        type: "p",
        text: 'Lars (85,0) omschreef de baan als "Iconisch": "Royal Antwerp is een tijdloze klassieker met uniek heidekarakter. Smalle fairways, dus creativiteit en nauwkeurigheid van de tee is vereist. Over het algemeen is de baan zeer goed onderhouden met vaak snelle en eerlijke greens." Levi houdt het bij "Klasse" (80,0). Alle drie de hosts komen hier altijd graag terug.',
      },
      { type: "h2", text: "3. Ternesse Golf & Country Club — 82,1/100" },
      { type: "p", text: "Parkland, 18 holes, Wommelgem." },
      {
        type: "p",
        text: 'Een technische parkbaan die de voorbije jaren duidelijk gegroeid is. Lars (85,0, "Onberispelijk"): "Ternesse is een technische parkbaan rond Antwerpen, die de voorbije jaren door slimme designkeuzes en een sterke focus op onderhoud is uitgegroeid tot één van de absolute topbanen in België. De prijs-kwaliteit verhouding is bovendien uitzonderlijk goed."',
      },
      {
        type: "p",
        text: 'Niels (83,3, "Kwaliteit"): "Ternesse is door de jaren heen een GEWELDIGE baan geworden. Ik loop daar nu al 18 jaar rond en heb de baan jaar na jaar zien groeien." Levi is met 78,0 ("Onderhouden") de strengste van de drie. <strong>Wij zijn hier alle drie lid</strong>, dus we spelen Ternesse vaak — en keren er altijd graag terug.',
      },
      { type: "h2", text: "4. Golf Club Beveren — 69,0/100" },
      { type: "p", text: "Parkland, 9 holes." },
      {
        type: "p",
        text: 'Een kleinere, laagdrempelige baan net buiten de Antwerpse rand. Levi (69,0, "Leuk"): "Fijne inland links baan. Onderhoud kan bij momenten wel beter. Verder een leuke uitdaging als je in de buurt bent." Een prima keuze voor een snelle 9 holes, maar niet meteen een bestemming op zich.',
      },
      { type: "h2", text: "5. Edegemse Golfclub - Drie Eycken — 62,5/100" },
      { type: "p", text: "Parkland, 18 holes, Edegem." },
      {
        type: "p",
        text: 'De meest toegankelijke baan in de lijst, letterlijk in de achtertuin van Antwerpen — maar ook de laagst scorende. Levi (63,5, "Toegankelijk") en Niels (61,5, "OK") waren allebei gematigd positief zonder uitgesproken enthousiasme; beiden geven aan dat ze hier niet bewust voor terug zouden komen.',
      },

      { type: "h2", text: "Nog niet (volledig) gespeeld door Pampas" },
      {
        type: "p",
        text: "Eerlijkheid hoort bij onze aanpak: deze twee banen liggen ook rond Antwerpen, maar staan nog niet op onze eigen ratinglijst. Op basis van publieke data en reviews alvast dit:",
      },
      {
        type: "p",
        text: "Cleydael Golf & Country Club (Parkland, 18 holes, par 72, Aartselaar) — Aangelegd in 1988 op het domein van een middeleeuws kasteel. Publieke reviews (Leading Courses, GolfPass, Wanderlog) prijzen vooral de setting — de oprit over de kasteelgracht — en de vriendelijke ontvangst, met wisselende meningen over het onderhoud van de baan.",
      },
      {
        type: "p",
        text: "Bossenstein Golf & Polo Club (Parkland, 27 holes — 18 holes Championship par 71 + 9 holes Executive par 31, Broechem) — Een Amerikaans geïnspireerde baan rond het 17e-eeuwse kasteel Bossenstein, aangelegd in 1988. Reviewers zijn het erover eens dat de lay-out sterk is, met veel waterhindernissen, maar recente reviews wijzen op wisselvallig onderhoud.",
      },
      {
        type: "p",
        text: "We plannen om deze twee de komende maanden te spelen — hou onze scores in de gaten.",
      },
      { type: "h2", text: "Samengevat" },
      {
        type: "table",
        headers: ["Baan", "Type", "Holes", "Pampas-score", "Gespeeld door Pampas"],
        rows: [
          ["Rinkven Golf & Country Club", "Heide", "31", "83,3", "Ja"],
          ["Royal Antwerp Golf Club", "Heide", "18", "83,2", "Ja"],
          ["Ternesse Golf & Country Club", "Parkland", "18", "82,1", "Ja"],
          ["Golf Club Beveren", "Parkland", "9", "69,0", "Ja"],
          ["Edegemse Golfclub - Drie Eycken", "Parkland", "18", "62,5", "Ja"],
          ["Cleydael Golf & Country Club", "Parkland", "18", "—", "Nog niet"],
          ["Bossenstein Golf & Polo Club", "Parkland", "27", "—", "Nog niet"],
        ],
      },
      {
        type: "p",
        text: "Heb je zelf al op een van deze banen gespeeld en ben je het (on)eens met onze ranking? Laat het ons weten — misschien hoor je jouw mening terug in een volgende aflevering van Pampas.",
      },
    ],
  },
  {
    slug: "golf-media-partner-spotlight",
    title: "Een great network to play: hoe Golf Media de clubervaring naar een hoger niveau tilt",
    excerpt:
      "PAMPAS werkt samen met Golf Media, en dat is geen toeval. Hun digitale netwerk in de Belgische golfclubs maakt het leven van golfers net dat tikkeltje makkelijker, precies waar wij ook voor staan.",
    seoDescription:
      "Hoe Golf Media met de Golf Kiosk de clubervaring in meer dan dertig Belgische golfclubs naar een hoger niveau tilt, en waarom dat voor PAMPAS klikt.",
    date: "13/06/2026",
    author: "PAMPAS Redactie",
    readTime: "5 min",
    topics: ["Partner", "Golf Media", "Belgische clubs"],
    category: "Partner in de spotlight",
    sourceName: "PAMPAS Redactie",
    sourceLabel: "Bron",
    content:
      "PAMPAS werkt samen met Golf Media. Hun digitale netwerk in de Belgische golfclubs, met de Golf Kiosk als kroonjuweel, maakt het leven van golfers en clubs een stuk eenvoudiger.",
    richContent: [
      {
        type: "subtitle",
        text: "PAMPAS werkt samen met Golf Media, en dat is geen toeval. Hun digitale netwerk in de Belgische golfclubs maakt het leven van golfers net dat tikkeltje makkelijker, en dat is precies waar wij ook voor staan.",
      },
      {
        type: "p",
        text: "Wie de afgelopen jaren door een Belgische golfclub heeft gewandeld, is er ongetwijfeld al langsgekomen: een strak digitaal scherm bij het onthaal of buiten op het terras, met de weersverwachting, de wedstrijdkalender en het laatste nieuws van de club. Dat scherm is van Golf Media, en het is meer dan alleen reclame. Wij vertellen je graag waarom dit Belgische bedrijf een meerwaarde is voor elke club en elke golfer.",
      },
      {
        type: "quote",
        text: '"A great network to play." Dat is de belofte van Golf Media, en op het terrein houden ze die belofte ook echt waar.',
      },
      { type: "h2", text: "De Golf Kiosk: praktisch, mooi en gratis voor de club" },
      {
        type: "p",
        text: "Het kroonjuweel van Golf Media is de Golf Kiosk, een digitale informatiezuil die golfers meteen bij aankomst alle nuttige info geeft. Geen rondvragen meer aan het onthaal of zoeken naar een papiertje met de wedstrijdkalender: alles staat overzichtelijk op een touchscreen.",
      },
      {
        type: "badges",
        items: [
          {
            num: "01",
            title: "Status van de baan",
            text: "In één oogopslag zien of de baan open is, of er beperkingen zijn, en wat de actuele weersomstandigheden zijn.",
          },
          {
            num: "02",
            title: "Wedstrijdkalender",
            text: "Altijd up-to-date overzicht van competities en evenementen, zodat niemand nog iets mist.",
          },
          {
            num: "03",
            title: "Stroke calculator & BEgolf",
            text: "Een digitale stroke calculator en directe link naar BEgolf, handig voor wie z'n handicap of inschrijvingen wil checken.",
          },
          {
            num: "04",
            title: "Social media feeds",
            text: "De laatste posts en sfeerbeelden van de club, mooi geïntegreerd in het scherm.",
          },
        ],
      },
      {
        type: "p",
        text: "Het mooiste van dit verhaal: de Golf Kiosk wordt volledig gratis aangeboden aan de club. Clubs krijgen een professioneel, modern communicatiemiddel zonder dat het hen iets kost, en met software die ze zelf met één klik kunnen updaten via een bibliotheek vol stijlvolle templates.",
      },
      { type: "h2", text: "Een netwerk dat groeit, in de mooiste clubs van het land" },
      {
        type: "p",
        text: "Golf Media is intussen aanwezig in meer dan dertig exclusieve golfclubs in België, van Golf de l'Empereur tot Royal Golf Club du Sart Tilman en Rigenée. Daarmee bouwen ze stap voor stap aan een netwerk dat golfers overal in het land hetzelfde niveau van comfort en informatie biedt.",
      },
      {
        type: "stats",
        items: [
          { num: "45+", label: "exclusieve golfclubs in België aangesloten" },
          { num: "50+", label: "schermen, inclusief het eerste outdoor scherm" },
          { num: "100K+", label: "impressies per week op het netwerk" },
        ],
      },
      { type: "h2", text: "Vertrouwd door grote merken, gebouwd voor de golfer" },
      {
        type: "p",
        text: "Dat dit concept werkt, bewijzen de merken die met Golf Media samenwerken. Internationale namen zien de waarde van een select, betrokken golfpubliek in een omgeving waar rust en kwaliteit centraal staan. Onder andere te zien op het netwerk: American Express, Breitling, Brussels Airlines, BMW, Hugo Boss, Club Med, ING, Garmin en Maserati.",
      },
      {
        type: "p",
        text: "Voor de golfclubs zelf betekent dit ook iets: een netwerk dat gedragen wordt door A-merken, straalt kwaliteit uit en past naadloos bij de premium uitstraling die zij zelf willen bieden aan hun leden en gasten.",
      },
      { type: "h2", text: "Waarom dit voor ons als PAMPAS klikt" },
      {
        type: "p",
        text: "Bij PAMPAS draait alles om de golfervaring beter, leuker en toegankelijker maken, op en naast de baan. Golf Media doet dat letterlijk op de baan: ze zorgen dat golfers op het juiste moment de juiste info krijgen, en dat clubs zonder extra werk een professionele uitstraling kunnen behouden. Het is dezelfde mentaliteit als waarmee wij elke aflevering en blogpost maken: nuttig, mooi vormgegeven, en met aandacht voor de golfer.",
      },
      {
        type: "quote",
        text: "Dankjewel aan Golf Media om PAMPAS te steunen. We zijn fier op deze samenwerking.",
      },
      {
        type: "source",
        text: "Meer info: golfmedia.be",
      },
    ],
  },
  {
    slug: "soudal-open-2026-rinkven",
    title: "Soudal Open 2026 — de week die alles had",
    titleHtml: "Soudal Open 2026 —<br/>de week die <em>alles had</em>",
    excerpt:
      "Een veteraan die zijn ziel terugvond op hole 17. Een legende die in tranen afscheid nam. En Rinkven dat vier dagen lang het kloppende hart van Europese golf was.",
    seoDescription:
      "Richard Sterne wint de Soudal Open 2026 op Rinkven na een albatros-poging op hole 17. Colsaerts neemt afscheid, De Schutter steelt de show.",
    date: "25/05/2026",
    author: "PAMPAS Redactie",
    readTime: "10 min",
    topics: ["Toernooiverslag", "Soudal Open", "Rinkven", "Sterne", "Colsaerts", "DP World Tour"],
    category: "Toernooiverslag · DP World Tour · België",
    sourceName: "PAMPAS Redactie",
    sourceLabel: "Bron",
    sourceSubtitle: "Rinkven International GC · Schilde · 21–24 mei 2026",
    content:
      "Er zijn tornooien die je vergeet zodra de prijsuitreiking voorbij is. En er zijn weken die je bijblijven. De vijfde editie van de Soudal Open op Rinkven International Golf Club in Schilde behoort zonder twijfel tot de tweede categorie. Vier dagen lang schreef het parkland ten noorden van Antwerpen golfgeschiedenis, met een cast die je niet eens had durven verzinnen: een 44-jarige Zuid-Afrikaan die terugkwam van bijna alles, een landgenoot die in de slotronde uit elkaar viel als nat karton, en een Belgische legende die tranen liet op de 18e fairway terwijl duizenden fans hem een staand applaus gaven dat het hele land voelde.",
    richContent: [
      {
        type: "subtitle",
        text: "Een veteraan die zijn ziel terugvond op hole 17. Een legende die in tranen afscheid nam. En Rinkven dat vier dagen lang het kloppende hart van Europese golf was.",
      },
      {
        type: "p",
        text: "Er zijn tornooien die je vergeet zodra de prijsuitreiking voorbij is. En er zijn weken die je bijblijven. De vijfde editie van de Soudal Open op Rinkven International Golf Club in Schilde behoort zonder twijfel tot de tweede categorie. Vier dagen lang schreef het parkland ten noorden van Antwerpen golfgeschiedenis, met een cast die je niet eens had durven verzinnen: een 44-jarige Zuid-Afrikaan die terugkwam van bijna alles, een landgenoot die in de slotronde uit elkaar viel als nat karton, en een Belgische legende die tranen liet op de 18e fairway terwijl duizenden fans hem een staand applaus gaven dat het hele land voelde.",
      },
      {
        type: "stats",
        items: [
          { num: "156", label: "Deelnemers" },
          { num: "5e", label: "Editie Soudal Open" },
          { num: "4.851", label: "Dagen gewacht door Sterne" },
          { num: "505", label: "Starts Colsaerts (DP World Tour)" },
        ],
      },
      { type: "h2", text: "Ronde 1: Lombard schiet uit de startblokken" },
      {
        type: "p",
        text: "Donderdagochtend, de lucht boven Schilde helder, the greens snel. Eén naam domineert het scorebord meteen: Zander Lombard kaart een verbluffende 63 (-8) en legt meteen een buffer op de rest van het veld. Richard Sterne en Jacob Skov Olesen volgen op 64, twee slagen achter de leider. De Zuid-Afrikaanse connectie is meteen aanwezig, twee mannen uit dezelfde natie, de één op weg naar zijn allereerste titel, de ander op zoek naar zijn eerste in dertien jaar.",
      },
      {
        type: "p",
        text: "Voor de Belgen begint het toernooi degelijk. Thomas Detry opent met een nette 68 (-3) en deelt de 22e plek. Amateur Anthony De Schutter verrast direct met een 67 (-4): zes birdies, één dubbele bogey, en op het einde twee birdies op de laatste holes. De 16-jarige Arthur Haghedooren speelt een voorzichtige openingsronde in 72, gelijk met Colsaerts die zijn eindweek ingaat met datzelfde getal.",
      },
      { type: "h2", text: "Ronde 2: Nico's Final Dance" },
      {
        type: "p",
        text: 'Vrijdag is de dag waarover in de weken erna het meest gesproken zal worden. Niet vanwege de leiderboard,  hoewel ook daar drama te vinden was, maar vanwege Nicolas Colsaerts. De 43-jarige Brusselaar speelt op Rinkven zijn allerlaatste ronde als professioneel golfer. "Nico\'s Final Dance" wordt het gedoopt. En wat voor een dans.',
      },
      {
        type: "quote",
        text: "Als je vrijdag tijdens het afscheid wat tranen ziet rollen, dan is dat precies what ik bedoel. Ik hoop dat mensen begrijpen wat er nodig is om de top te bereiken, en wat er onderweg opgeofferd moet worden. \n- Nicolas Colsaerts",
      },
      {
        type: "p",
        text: "Colsaerts begint wetende dat de cut wellicht buiten bereik ligt na zijn openingsronde in 72. Maar de Belgium Bomber laat het publiek even dromen. Een bogey op hole 3 wordt gevolgd door een fenomenale eagle op hole vijf. Daarna birdies op 6, 7 en 8. Even denk je: gaat hij het doen? Uiteindelijk sluit hij zijn tweede ronde af in 69 en mist hij de cut met twee slagen. Maar wat er dan op de 18e hole gebeurt, dat is golfgeschiedenis voor België. Omringd door zijn zoontjes, zijn vrouw, zijn ouders, loopt hij de fairway af terwijl vijfduizend fans hem een staande ovatie geven. Tranen op zijn wangen. Tranen in de tribunes.",
      },
      {
        type: "quote",
        text: "Als je een fairway afloopt met je hele familie, je ouders erbij... kijk, daar ga ik weer. Ik heb de laatste jaren geleerd dat het oké is om emoties te tonen. Dit is waarom er tranen zijn.\n- Nicolas Colsaerts",
      },
      {
        type: "p",
        text: "Intussen houdt Lombard zijn leiderspositie vast. Hij kaart een tweede ronde van 66 en deelt na 36 holes de leiding met de Fransman Tom Vaillant, die ook op 64-65 staat. Sterne blijft in de schaduw op 64-68. De cut valt op -3: vier Belgen overleven: Detry (68-68), De Schutter (67-70), Ulenaers en de 16-jarige Haghedooren (72-67). Haghedooren doet het met zijn vrijdagronde van 67 maar liefst vijf slagen beter dan zijn openingsdag.",
      },
      { type: "h2", text: "Ronde 3: Lombard trekt weg, Detry struikelt" },
      {
        type: "p",
        text: "Zaterdag consolideert Lombard zijn dominantie met een derde ronde van 66 (-5). Na 54 holes staat hij alleen aan de leiding op 195 slagen (-18), met drie slagen voorsprong op zijn landgenoot MJ Daffue (198). Sterne kaart ook een 68 op dag drie en staat op 200 slagen, vijf achter Lombard. De situatie lijkt duidelijk: Lombard die op zondag zijn eerste titel mee naar huis neemt.",
      },
      {
        type: "p",
        text: "Voor de Belgen is het een zware zaterdag. Detry heeft het moeilijk en kaart een 73 (+2), hij zakt naar de 67e plek in het klassement. Maar De Schutter houdt stand op de 24e plek, Ulenaers staat 32e en Haghedooren, met een derde ronde van 68, klimt naar de 47e positie. Drie Belgische amateurs in de weekendronden. Dat is een verhaal op zich.",
      },
      { type: "h2", text: "Ronde 4: Het mirakel op hole 17" },
      {
        type: "p",
        text: "Zondag 24 mei. Rinkven baadt in het lenterzonnetje. Lombard staat op -18 and heeft drie slagen voorsprong. De rest van de wereld denkt: formaliteit. Maar golf is golf, en Rinkven is Rinkven.",
      },
      {
        type: "p",
        text: "Richard Sterne schiet uit de startblokken als een man bezeten. Birdie op hole 1. Birdie op hole 2. Birdie op hole 5. Hij staat plots op -16. De kloof met Lombard krimpt van vijf naar drie slagen. Dan een bogey op hole 8, de enige smet op zijn zondagkaart, maar Sterne laat zich niet van de wijs brengen. Tegelijkertijd begint het mis te gaan voor Lombard: hij vindt het water op hole 13, bogey. Hole 14: bal tegen de lip van de bunker, double bogey. De leiding smelt weg als sneeuw voor de zon. En dan komt hole 17.",
      },
      {
        type: "p",
        text: "Een par-5. Sterne staat op 276 yards van het pin. Hij pakt een metalwood. Wat hij doet, wordt nadien beschreven als de shot van het toernooi, misschien van het seizoen. De bal scheert over de fairway, landt een paar voet voor de cup and stopt op centimeters van een albatros. Tap-in eagle. Sterne staat op -18, gelijk met de ineenstortende Lombard. Birdie op 16 was er al gekomen, par op 18 sluit de klus. Clubhouse target: 18 onder par, 266 slagen. Lombard kaart uiteindelijk een 74 (+3) op zondag and eindigt gedeeld achtste op -15. Sterne wint met twee slagen.",
      },
      {
        type: "quote",
        text: "Ik speelde één van de beste slagen van mijn leven. Ik dacht dat ik nog één slag achterlag op de laatste hole — tot ik op het 18e green de leaderboard bekeek en verrast was. \n- Richard Sterne",
      },
      { type: "h2", text: "De eindstand" },
      {
        type: "table",
        headers: ["Pos.", "Speler", "R1", "R2", "R3", "R4", "Tot", "Score"],
        rows: [
          ["1", "🇿🇦 Richard Sterne", "64", "68", "68", "66", "266", "−18"],
          ["T2", "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Marcus Armitage", "68", "68", "66", "66", "268", "−16"],
          ["T2", "🇪🇸 Jorge Campillo", "66", "66", "68", "68", "268", "−16"],
          ["T2", "🇯🇵 Kota Kaneko", "68", "65", "68", "67", "268", "−16"],
          ["T2", "🇸🇪 Marcus Kinhult", "66", "67", "71", "64", "268", "−16"],
          ["T2", "🇩🇰 Jacob Skov Olesen", "64", "68", "67", "69", "268", "−16"],
          ["T2", "🇫🇷 Victor Perez", "68", "69", "65", "66", "268", "−16"],
          ["T8", "🇿🇦 Zander Lombard", "63", "66", "66", "74", "269", "−15"],
          ["T8", "🇿🇦 MJ Daffue", "67", "66", "65", "71", "269", "−15"],
          ["T13", "🇳🇱 Darius Van Driel", "69", "68", "68", "65", "270", "−14"],
          ["T13", "🇫🇷 Tom Vaillant", "65", "64", "70", "71", "270", "−14"],
          ["T41", "🇧🇪 Anthony De Schutter (BEL)", "67", "70", "68", "70", "275", "−9"],
          ["T53", "🇧🇪 Thomas Detry (BEL)", "68", "68", "73", "68", "277", "−7"],
          ["T68", "🇧🇪 Arthur Haghedooren (BEL)", "72", "67", "68", "73", "280", "−4"],
        ],
      },
      { type: "h2", text: "Hoe deden de Belgen het?" },
      {
        type: "p",
        text: 'De verrassing van de week was zonder twijfel Anthony De Schutter. De 24-jarige amateur, net afgestudeerd in de Verenigde Staten en uitgenodigd via een wildcard, speelde vier opeenvolgende rondes onder par (67-70-68-70) en eindigde als beste Belg op de 41e plek met -9. Twee slagen voor landgenoot Thomas Detry. "Er is niets mooiers dan op het hoogste niveau in Europa dit te presteren voor je familie en vrienden," zei hij achteraf. "Ik heb hier weinig woorden voor."',
      },
      {
        type: "p",
        text: "Detry zelf had een week met pieken en dalen. Twee sterke rondes van 68 omlijstten een zware zaterdag in 73, die derde ronde brak hem het toernooi. De slotronde van 68 toonde opnieuw zijn klasse, maar de schade was al aangericht. Eindpositie: T47 op -7.",
      },
      {
        type: "badges",
        items: [
          {
            num: "Belg 01",
            title: "🇧🇪 Anthony De Schutter — amateur steelt de show",
            text: "Vier rondes onder par, eindscore -9, beste Belg. De Schutter was deze week het verhaal van de Belgische golf. Wildcard-uitnodiging, net afgestudeerd in de VS, en vervolgens vier degelijke rondes afgeleverd op het hoogste Europese niveau. Ronden van 67-70-68-70: consistent, gedisciplineerd, en met de glimlach. Voor een speler die pas op zijn 24e écht doorbreekt op dit niveau, is dit de perfecte springplank.",
          },
          {
            num: "Belg 02",
            title: "🇧🇪 Thomas Detry — knap herstel na zwarte zaterdag",
            text: "68-68-73-68: drie uitstekende rondes and één zwarte dag. De zaterdag in 73 (+2) kostte Detry een mogelijke top-20-finish. Zijn slotronde van 68 met vier birdies and een eagle toonde dat het niveau er is, maar één slechte dag op dit niveau is er altijd één te veel. De 33-jarige eindigt op -7 and T47. Niet zijn week, maar zeker niet zijn slechtste.",
          },
          {
            num: "Belg 03",
            title: "🇧🇪 Arthur Haghedooren — 16 jaar, cut gehaald",
            text: 'Haghedooren (72-67-68) haalde de cut op een volwaardig DP World Tour-evenement. Op zijn zestiende. Nog in het vijfde middelbaar aan de Topsportschool in Hasselt. Zijn vrijdagronde van 67, vijf slagen beter dan zijn openingsdag, was de perfecte illustratie van hoe deze jongen omgaat met druk. "Ik ben vandaag gestart met het idee om gewoon plezier te hebben," zei hij na ronde 2. Dat lukte. En hoe.',
          },
          {
            num: "Belg 04",
            title: "🇧🇪 Nicolas Colsaerts — 505 starts, één afscheid",
            text: "Twee rondes van 72, cut gemist met twee slagen. Maar de cijfers doen Colsaerts' week tekort. De eagle op hole 5 van ronde 2, de birdies op 6, 7 and 8, even leefde de droom. En dan die laatste hole: zijn gezin langs de fairway, vijfduizend fans rechtopstaand, tranen op Rinkven. 505 starts, 25 jaar offers, drie toernooizeges, Ryder Cup-speler én vicekaptein. Het einde van een tijdperk in Belgisch golf.",
          },
        ],
      },
      { type: "h2", text: "Richard Sterne: wie is hij eigenlijk?" },
      {
        type: "p",
        text: "Richard Sterne is niet het soort naam dat casual golffans direct doet opveren. Maar wie zijn verhaal kent, snapt waarom zijn overwinning op Rinkven iets heel speciaals is. Na zijn zege in de Joburg Open van 2013 begon een calvariestocht die weinigen overleven: drie polsoperaties, een discvervanging in zijn rug, een heupoperatie. Elke keer vroeg het veld zich af: komt hij terug? 4.851 dagen lang bleef een overwinning uit.",
      },
      {
        type: "p",
        text: 'Op Rinkven, in zijn 25e jaar als prof, met zijn kinderen langs de baan, zijn oudste is bijna 13, "ongeveer zo lang geleden als mijn laatste zege", vond Sterne het terug. Zijn rondes van 64-68-68-66 vertellen hun eigen verhaal: consistent van dag één, en een slotronde van genade. De 585 Race to Dubai-punten en de €402.686 zijn mooi meegenomen. Maar het ware gewicht van deze overwinning zit elders.',
      },
      {
        type: "quote",
        text: "Drie polsoperaties, een discvervanging, een heupoperatie, ik heb het allemaal meegemaakt. Eén van mijn grote doelen was om te winnen terwijl mijn kinderen het konden zien. Mijn oudste wordt binnenkort 13. Zo lang is het geleden.\n- Richard Sterne",
      },
      {
        type: "p",
        text: "Het is ook de zesde overwinning door een Zuid-Afrikaan in de 2026 Race to Dubai. Sterne's compatrioten Jayden Schaper, Casey Jarvis en Yurav Premlall gingen hem voor. Zuid-Afrika domineert het Europese seizoen als nooit tevoren.",
      },
      { type: "h2", text: "Onze Belgische conclusie" },
      {
        type: "p",
        text: "De Soudal Open 2026 had alles wat golf groot maakt: drama in de slotronde, een comeback-verhaal dat scenario-schrijvers zouden weigeren als te onrealistisch, en een afscheid dat een generatie afsloot. Rinkven International bewees eens te meer dat het tot de beste parklandbanen van Europa behoort, en dat Schilde elk jaar opnieuw een plek is waar het DP World Tour-circus met plezier terugkeert.",
      },
      {
        type: "p",
        text: "Voor ons, als Belgische golffans, is er iets bitterzoets aan deze week. Colsaerts nam afscheid met 72-69 en tranen op de 18e. Maar De Schutter speelde vier rondes onder par als amateur. Haghedooren haalde de cut op zijn zestiende. Detry vecht elk jaar opnieuw. Ergens in een Vlaamse golfclub slaat een kind van twaalf zijn eerste wedstrijd, geïnspireerd door wat hij vrijdag op televisie zag. Dat is de echte nalatenschap van Nicolas Colsaerts. Niet de trofeeën. De vonk.",
      },
      {
        type: "p",
        text: "Tot volgend jaar, Soudal Open. Tot volgend jaar, Rinkven.",
      },
      {
        type: "source",
        text: "Bronnen: DP World Tour · Sky Sports · Sporza · Golf Monthly · GolfNewsNet · 2026",
      },
    ],
  },
  {
    slug: "pga-championship-2026-aronimink",
    title: "Aronimink wacht — kan Europa de Wanamaker veroveren?",
    titleHtml: "Aronimink wacht —<br/>kan Europa de<br/><em>Wanamaker veroveren?</em>",
    excerpt:
      "Rory jaagt op geschiedenis, Nicolai Hojgaard bruist van vertrouwen en het Europese contingent is sterker dan ooit. Een Belgische blik op het tweede major van 2026.",
    seoDescription:
      "Rory jaagt op geschiedenis en het Europese contingent is sterker dan ooit. Een Belgische blik op het PGA Championship 2026 in Aronimink.",
    date: "13/05/2026",
    author: "PAMPAS Redactie",
    readTime: "9 min",
    topics: ["Major Preview", "PGA Championship", "Aronimink", "McIlroy", "Europa"],
    category: "Major Preview · PGA Championship",
    sourceName: "PAMPAS Redactie",
    sourceLabel: "Bron",
    content:
      "Het is weer zover. Aronimink Golf Club opent donderdag de poorten voor de 108ste editie van het PGA Championship.",
    richContent: [
      {
        type: "subtitle",
        text: "Rory jaagt op geschiedenis, Nicolai Hojgaard bruist van vertrouwen en het Europese contingent is sterker dan ooit. Een Belgische blik op het tweede major van 2026.",
      },
      {
        type: "p",
        text: "Het is weer zover. Terwijl de rest van de wereld op het nieuws wacht, weten wij golfliefhebbers al weken dat deze week anders wordt. Aronimink Golf Club, net buiten Philadelphia, opent donderdag de poorten voor de 108ste editie van het PGA Championship — en van hieruit, vanuit de Lage Landen, kijken we met bijzondere interesse toe. Want de Europese golf staat er beter voor dan in jaren. En ook al heeft België geen speler in het veld, we have a dog in this fight. Zijn naam is Rory McIlroy.",
      },
      {
        type: "stats",
        items: [
          { num: "108", label: "Editie PGA Championship" },
          { num: "156", label: "Spelers in het veld" },
          { num: "6", label: "Majors Rory McIlroy" },
          { num: "1962", label: "Laatste PGA op Aronimink" },
        ],
      },
      { type: "h2", text: "Het speelterrein: Aronimink Golf Club" },
      {
        type: "p",
        text: "Aronimink Golf Club in Newtown Square, Pennsylvania, ontving voor het laatst een PGA Championship in 1962 — toen won de Zuid-Afrikaan Gary Player met één slag verschil. Sindsdien onderging het klassieke Donald Ross-ontwerp uit 1928 meerdere restauraties, waarbij architect Ron Prichard de baan in de jaren negentig en tweeduizenden zo dicht mogelijk terugbracht naar Ross' originele visie. Ross proclameerde destijds: \"I intended to make this my masterpiece\" — en wie de foto's ziet van de geraffineerde bunkering en de verraderlijke groencompeties, gelooft hem op zijn woord. Voor spelers die de baan niet goed kennen is dit een serieuze uitdaging. Rory McIlroy speelde Aronimink één keer competitief: in 2018 bij het BMW Championship, goed voor een vijfde plaats. Vertrouwdheid is er dus niet, maar zijn recente vormspiegel meer dan compenseert.",
      },
      {
        type: "quote",
        text: "Een Donald Ross-meesterwerk dat 64 jaar heeft gewacht op zijn volgende grootmeester. En die grootmeester vliegt mogelijk vanuit Noord-Ierland binnen.",
      },
      { type: "h2", text: "Rory McIlroy — man van het moment" },
      {
        type: "p",
        text: "Laten we niet om de hete brij heen draaien: Rory McIlroy is de man die deze week alle aandacht trekt, en terecht. Na zijn tweede opeenvolgende Masters-titel in april — waarmee hij in het voetspoor trad van Jack Nicklaus, Nick Faldo en Tiger Woods — arriveert de Noord-Ier in Philadelphia met een zeldzame combinatie van momentum, zelfvertrouwen en honger. Een derde Wanamaker Trophy zou hem op gelijke hoogte brengen met een handvol legendes in PGA Championship-geschiedenis.",
      },
      {
        type: "p",
        text: "Zijn voorbereiding was niet vlekkeloos: bij het Truist Championship vorige week in Charlotte eindigde hij op een teleurstellende gedeelde 19de plaats. Maar wie de cijfers bekijkt, ziet iets anders dan een man in slechte vorm. Zijn balslag was de hele week scherp, met strokes gained/ball-striking-cijfers vergelijkbaar met die van toernooiwinnaar Kristoffer Reitan. Eén ongelukkige hook op de 14de hole zondag kostte hem zijn tee-statistieken voor de week. Bovendien liep hij deze week met een pijnlijke blaar onder de nagel van zijn kleine rechterteen — hij verwijderde de nagel maandagavond eigenhandig in bad, waarna hij dinsdag na drie holes zijn oefenronde afbrak. Geen zorgen maken? Misschien wel. Maar men vergeet niet dat deze man met een vergelijkbare kalme vastberadenheid zijn Grand Slam completeerde.",
      },
      {
        type: "quote",
        text: "Rory is nu in een beter hoofd dan vorig jaar, zei hij zelf dinsdag. En als er één speler is wiens lichaamstaal iets betekent, is hij het.",
      },
      { type: "h2", text: "De Europese uitdagers — een generatie in bloei" },
      {
        type: "p",
        text: "Maar Rory staat niet alleen. De Europese golf brengt dit jaar een kwalitatief veld mee dat het hart van elke Old World-supporter sneller doet slaan. We lopen de voornaamste namen door.",
      },
      {
        type: "badges",
        items: [
          {
            num: "Speler 01",
            title: "🇩🇰 Nicolai Hojgaard — de verrassing van het seizoen",
            text: "Als er één naam is die u moet onthouden deze week, is het die van de Deense tweeling Nicolai Hojgaard. Hij eindigde vorige week op een gedeelde tweede plaats bij het Truist Championship — zijn vijfde top-6-finish dit seizoen. Statistisch gezien is hij de negende beste speler in dit veld, wint hij gemiddeld 1,25 strokes per ronde en zijn ijzerspel is ronduit dominant: hij won strokes on approach in vijftien opeenvolgende toernooien. Met drie overwinningen op de DP World Tour en negen cuts gemaakt in zijn laatste elf major-starts, is dit geen speculatie meer. Zijn prijskaartje van +5000 is verbluffend laag voor iemand van zijn kaliber.",
          },
          {
            num: "Speler 02",
            title: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Tommy Fleetwood — de eeuwige kandidaat",
            text: "Fleetwood is de reigning FedEx Cup-kampioen en telde dit seizoen al vijf top-10-finishes, al blijft een eerste major-overwinning zijn grote witte walvis. De Engelsman ontdekte bij het Truist Championship eindelijk zijn puttingstap terug — de enige echte zwakke schakel in zijn spel dit seizoen. Als die putter meegaat bij Aronimink, is Fleetwood meer dan capabel om vier ronden consistent te leveren. Zijn ijzerspel en wedge game zijn ideaal voor de veeleisende Donald Ross-greens.",
          },
          {
            num: "Speler 03",
            title: "🇬🇧 Tyrrell Hatton — de stille gevaarlijke man",
            text: "Hatton lijkt het grootste gedeelte van het jaar onder de radar te vliegen — tot hij bij een major opduikt in de top van het klassement. Een gedeelde derde plaats bij de Masters dit jaar, een bijna-overwinning bij de US Open vorig seizoen, en een gedeelde vierde plek bij Oakmont. Statistisch staat hij vijfde in dit veld in strokes gained/ball-striking over de voorbije 36 rondes, en eveneens vijfde in SG/par 4s en SG/total in moeilijke scoringsomstandigheden. Als het weer hem uitkomt — en er is regen in de voorspelling — zal Hatton zijn. Odds van +5500 zijn een geschenk.",
          },
          {
            num: "Speler 04",
            title: "🇸🇪 Ludvig Åberg — het Zweedse talent onder druk",
            text: "Åberg miste de cut in zijn twee vorige PGA Championships — een statistisch anomalie voor een speler die dit jaar in bijna elk ander toernooi contendeerde. Zijn ijzerspel is wereldklasse, zijn short game is beduidend verbeterd ten opzichte van vorig seizoen, en zijn rijafstand geeft hem enorme voordelen op een baan als Aronimink. De grote vraag is zijn mentale weerbaarheid op zondag bij een major. Na zijn implosie bij The Players eerder dit jaar, staat hij voor zijn beproeving. Odds van +1800 tot +2000 weerspiegelen dat twijfel — maar ook de enorme opwaartse potentie.",
          },
          {
            num: "Speler 05",
            title: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Matt Fitzpatrick — stille reus",
            text: "Fitzpatrick won drie keer sinds maart, waaronder de RBC Heritage, en verkeert in uitstekende doen. Zijn T8-finish bij het PGA Championship vorig jaar op Quail Hollow, een baan waar hij niet zijn beste spel vertoonde, was een teken van zijn niveau. De Engelsman is het prototype voor een Aronimink-winnaar: nauwkeurig van de tee, dodelijk met de ijzers, en onvermoeibaar consistent. Odds van +2200 zien er prima uit voor iemand die drie keer won dit seizoen en meerdere top-10's noteerde in majors de voorbije twee jaar.",
          },
          {
            num: "Speler 06",
            title: "🇪🇸 Jon Rahm — de comeback begint nu",
            text: "Rahm heeft een teleurstellend 2026 achter de rug, en zijn aflopend LIV Golf-avontuur zorgt voor veel ruis buiten de baan. Maar de tweevoudig majorwinnaar is nog altijd een van de gevaarlijkste spelers ter wereld op zijn best. Zijn T8 vorig jaar op Quail Hollow verhult hoe dicht hij Scheffler achter zich had op zondag — tot zijn eigen agressiviteit hem de das omdeed. Rahm bij odds van +1500 kan een uitstekende speculatieve gok zijn voor wie gelooft dat hij zijn niveau terugvindt op een klassiek parcours.",
          },
        ],
      },
      { type: "h2", text: "De Amerikaanse favoriet — Scheffler is mens, maar nauwelijks" },
      {
        type: "p",
        text: "We zouden onze favorieten tekortdoen als we de Amerikaanse dominantie niet erkennen. Scottie Scheffler is de verdedigend kampioen, de wereldnummer één, en de meest consistente golfer op de planeet. Zes PGA Championship-starts leverden hem vijf top-10's op, waaronder zijn verpletterende overwinning vorig jaar in Charlotte met vijf slagen voorsprong. Drie opeenvolgende tweede plaatsen in de aanloop naar deze week — waaronder verloren van McIlroy bij de Masters — tonen aan dat zelfs Scheffler kan verliezen. Maar zijn odds van +480 zijn de goedkoopste op het bord, en daarmee gerechtvaardigd. Cameron Young is in uitstekende vorm na zijn overwinning bij The Players en een dominante prestatie bij Doral, en verdient zeker aandacht bij +1200.",
      },
      {
        type: "quote",
        text: "Europa's kans is reëel. McIlroy is in vorm, Fitzpatrick wint toernooien, Hojgaard schittert consistenter dan ooit, en Hatton is — wederom — gevaarlijk onderschat. De Wanamaker Trophy heeft een Europees paspoort nodig.",
      },
      { type: "h2", text: "De kansen samengevat" },
      {
        type: "table",
        headers: ["Speler", "Land", "Odds", "Verdict"],
        rows: [
          ["Scottie Scheffler", "🇺🇸", "+480", "Terecht favoriet, maar duur."],
          ["Rory McIlroy", "🇬🇧", "+850", "Onze topkeuze: momentum & klasse."],
          ["Cameron Young", "🇺🇸", "+1200", "In topvorm, gevaarlijk."],
          ["Jon Rahm", "🇪🇸", "+1500", "Speculatief maar verleidelijk."],
          ["Ludvig Åberg", "🇸🇪", "+1800", "Talent klopt aan de deur."],
          ["Matt Fitzpatrick", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "+2200", "Onderschat na drie zeges — koop."],
          ["Tommy Fleetwood", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "+2700", "Putter nog niet warm — gevaarlijk."],
          ["Tyrrell Hatton", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "+5500", "Beste waarde op het bord."],
          ["Nicolai Hojgaard", "🇩🇰", "+5000", "Verbluffend goedkoop voor zijn vorm."],
        ],
      },
      { type: "h2", text: "Onze Belgische conclusie" },
      {
        type: "p",
        text: "Vanuit de Lage Landen kijken we toe op een week die alles heeft om épisch te worden. Rory McIlroy kan als eerste speler ooit de Masters en de PGA Championship in hetzelfde jaar winnen én opeenvolgend de Masters verdedigen — een historische dubbel die zijn al indrukwekkende erfenis nog verder vergroot. De Europese golf is breed en diep, gevuld met spelers die de juiste combinatie van talent, ervaring en huidig niveau hebben om zondag de Wanamaker Trophy omhoog te houden.",
      },
      {
        type: "source",
        text: "Bron: PAMPAS Redactie · Major Preview — mei 2026",
      },
    ],
  },
  {
    slug: "grip-academy-kempense-golf",
    title: "Wij gingen langs bij grip.academy — dit hebben we geleerd",
    titleHtml: "Wij gingen langs bij<br/>grip.academy —<br/><em>dit hebben we geleerd.</em>",
    excerpt:
      "Op de Kempense Golf testten we Trackman, HackMotion, Golfbox AI en 3D drukplaten. Een eerlijke, enthousiaste terugblik op een sessie die ons kijk op golf voorgoed veranderde.",
    seoDescription:
      "We testten Trackman, HackMotion en 3D drukplaten bij grip.academy op de Kempense Golf. Een eerlijke terugblik op een sessie die alles veranderde.",
    date: "06/05/2026",
    author: "PAMPAS Redactie",
    readTime: "8 min",
    topics: ["Technologie", "grip.academy", "Kempense Golf", "Trackman", "HackMotion"],
    category: "Technologie · Coaching · Analyse",
    sourceName: "grip.academy",
    sourceUrl: "https://grip.academy/",
    sourceLabel: "Locatie",
    sourceLinkLabel: "Bezoek grip.academy →",
    sourceSubtitle: "Kempense Golf · België",
    content: "We kwamen aan op de Kempense Golf zonder al te hoge verwachtingen.",
    richContent: [
      {
        type: "subtitle",
        text: "Op de Kempense Golf testten we Trackman, HackMotion, Golfbox AI en 3D drukplaten. Een eerlijke, enthousiaste terugblik op een sessie die ons kijk op golf voorgoed veranderde.",
      },
      {
        type: "p",
        text: "We kwamen aan op de Kempense Golf zonder al te hoge verwachtingen. Een sessie bij grip.academy — een naam die je in de Belgische golfwereld steeds vaker hoort — zou ons laten kennismaken met vier technologieën die professionele coaches wereldwijd gebruiken. Wat we niet verwacht hadden, was dat we twee uur later de baan zouden verlaten met een fundamenteel ander begrip van onze eigen swing. Gevoel is waardevol, maar data liegt niet. En bij grip.academy hebben ze de tools én de expertise om die data voor je tot leven te brengen.",
      },
      {
        type: "stats",
        items: [
          { num: "26+", label: "Trackman parameters" },
          { num: "±1°", label: "HackMotion precisie" },
          { num: "1000/s", label: "Drukplaat metingen" },
          { num: "4", label: "tools · 1 systeem" },
        ],
      },
      { type: "h2", text: "Trackman — de radar die alles ziet" },
      {
        type: "p",
        text: "De sessie bij grip.academy begon met Trackman, en dat is geen toeval. Trackman is wereldwijd de gouden standaard in balvluchtanalyse, en de coaches bij grip.academy gebruiken het als vertrekpunt voor élke analyse. Gebruik makend van dubbele Doppler-radartechnologie volgt het systeem tegelijkertijd de clubkop én de bal — van het moment van impact tot aan het neerkomen op de fairway. Geen enkel ander systeem geeft je zo'n compleet beeld van wat er werkelijk gebeurt bij elke slag.",
      },
      {
        type: "quote",
        text: "De coach bij grip.academy legde het perfect uit: Trackman vertelt je niet wat je denkt dat er gebeurt. Het vertelt je wat er écht gebeurt. En dat verschil was voor ons ronduit schokkend — en ongelooflijk verhelderend.",
      },
      {
        type: "p",
        text: "Wat maakt Trackman zo bijzonder? De combinatie van meer dan 26 parameters die het tegelijk registreert. Van spin rate en launch angle tot attack angle, smash factor en carry distance — elk gegeven helpt coach én speler begrijpen waarom een bal links krult, te hoog vliegt of te weinig carry produceert. Bij grip.academy worden de resultaten live gedeeld via een tablet, zodat je als golfer exact meekijkt met wat de coach ziet. Die gedeelde taal verandert de dynamiek van een les volledig.",
      },
      {
        type: "p",
        text: "We sloegen een tiental ballen en zagen voor het eerst met eigen ogen waarom onze slice al jaren hardnekkig bleef. Tien minuten Trackman gaf meer inzicht dan maanden van raden en gissen. De coaches op de Kempense Golf gebruiken het bovendien voor club- en golfbalfitting: kies je materiaal op basis van harde cijfers, niet op gevoel of verkooppraatjes.",
      },
      { type: "h2", text: "HackMotion — biofeedback voor je polsen" },
      {
        type: "p",
        text: "Vervolgens werden de HackMotion-sensoren om onze polsen bevestigd — en begon het pas echt interessant te worden. Als Trackman je vertelt wat de bal doet, dan vertelt HackMotion je wat je handen doen. En in golf is polspositie — zowel in de backswing, op de top als door impact — misschien wel de meest ondergewaardeerde factor in consistentie. De coaches bij grip.academy zweren bij deze tool om technische correcties sneller en duurzamer in te slijpen dan via klassieke visuele instructie ooit mogelijk zou zijn.",
      },
      {
        type: "badges",
        items: [
          {
            num: "Meting 01",
            title: "Flexie & extensie",
            text: "De sensor meet nauwkeurig hoeveel je pols buigt of strekt doorheen de volledige swingbeweging. Een te geklopte pols op de top van de backswing is een van de meest voorkomende oorzaken van inconsistentie — HackMotion maakt dat patroon onmiddellijk zichtbaar én voelbaar.",
          },
          {
            num: "Meting 02",
            title: "Ulnaire & radiale deviatie",
            text: "De zijwaartse beweging van de pols — naar pink of duim toe — heeft een enorme impact op de clubface bij impact. HackMotion kwantificeert dit tot op één graad nauwkeurig en vergelijkt jouw waarden real-time met referentiedata van PGA- en LET-tourspelers.",
          },
          {
            num: "Meting 03",
            title: "Real-time audiofeedback",
            text: "Zodra jouw polspositie buiten het ingestelde streefbereik valt, geeft de app een geluidssignaal. Die directe koppeling tussen beweging en feedback versnelt motorisch leren drastisch. Je leert het juiste gevoel — niet alleen het juiste beeld.",
          },
          {
            num: "Meting 04",
            title: "Putting & short game",
            text: "HackMotion stopt niet bij de volledige swing. Voor putting is polsstabiliteit door impact cruciaal — en meetbaar. De tool is inzetbaar voor wedge play, chippen en de putt, waardoor het een volwaardig analysesysteem is voor alle onderdelen van het spel.",
          },
        ],
      },
      {
        type: "p",
        text: 'Wat onze sessie bij grip.academy duidelijk maakte: een coach kan honderd keer zeggen "houd je pols vlakker op de top" — maar met HackMotion vóél je het exact op het juiste moment. Die combinatie van een ervaren oog en directe biofeedback is wat grip.academy onderscheidt van een gewone golfles. Alle sessiedata wordt opgeslagen, zodat je bij elke volgende les meteen ziet of je progressie hebt geboekt.',
      },
      { type: "h2", text: "Golfbox AI — jouw digitale caddie op de baan" },
      {
        type: "p",
        text: "Technologie stopt bij grip.academy niet aan de rand van de drivingrange. Na de fysieke analyse namen de coaches de tijd om onze Golfbox-data te bekijken — en dat opende een tweede front van inzichten. Golfbox AI brengt data-gedreven analyse naar het daadwerkelijke spel op de baan. Geïntegreerd in de vertrouwde Golfbox-omgeving analyseert het systeem je rondescores, hole-per-hole prestaties, greens-in-regulation, fairway-accuraatheid en putaantallen.",
      },
      {
        type: "quote",
        text: "Onze coach bij grip.academy wees ons op een patroon dat we zelf nooit hadden opgemerkt: we verloren structureel slagen op par-3's — niet door een slechte swing, maar door systematisch de verkeerde club te kiezen.",
      },
      {
        type: "p",
        text: "Golfbox AI interpreteert de statistieken en geeft gepersonaliseerde aanbevelingen. Welk deel van jouw spel kost je de meeste slagen? Waar laat je strokes liggen die je kunt terugpakken? Het systeem geeft antwoorden op vragen die je zelf niet eens dacht te stellen. Bij grip.academy wordt die data actief gebruikt om lessen te sturen: zo werden onze oefeningen na de Golfbox-analyse direct aangepast op wat we écht nodig hadden.",
      },
      {
        type: "p",
        text: "Die combinatie van baan-data en oefenfaciliteit is precies waarom een bezoek aan grip.academy op de Kempense Golf zo waardevol is. Je vertrekt niet met een algemeen advies, maar met een plan dat op jou persoonlijk is afgestemd.",
      },
      { type: "h2", text: "3D drukplaten — de kracht die je niet ziet" },
      {
        type: "p",
        text: "Het meest spectaculaire moment van onze sessie bij grip.academy was zonder twijfel het werken met de 3D drukplaten. We stapten op het platform, sloegen een bal, en keken in real-time toe hoe een heatmap onze gewichtsoverdracht in kaart bracht. De meest onderschatte component van een goede golfswing — hoe jij je kracht via de grond ontwikkelt — lag plots volledig bloot.",
      },
      {
        type: "quote",
        text: "We zagen live hoe we al ons gewicht naar onze achtervoet lieten hangen na impact. Dat kostte minstens 20 meter carry. Vijf slagen later, met de feedback van de coach en de drukplaat, begon het al te verbeteren.",
      },
      {
        type: "p",
        text: "Het systeem meet in real-time de druk onder beide voeten — links, rechts, voor, achter — tijdens elke fase van de swing. De resulterende data wordt omgezet in een heatmap en een temporele grafiek die laat zien hoe jouw gewicht beweegt doorheen de tijd. Met meer dan duizend metingen per seconde gaat geen enkele nuance verloren. Op de Kempense Golf is dit geïntegreerd in de analyseruimte van grip.academy, wat het gebruik ervan uitzonderlijk vlot en intuïtief maakt.",
      },
      {
        type: "p",
        text: "Wat 3D drukplaten zo onmisbaar maakt is dat ze bewegingspatronen onthullen die totaal niet zichtbaar zijn op video — en die de coaches bij grip.academy gebruiken om gericht en snel te corrigeren. Bovendien zijn ze een krachtig instrument voor blessurepreventie: asymmetrische belasting vroeg detecteren betekent rugklachten, kniepijn of heupproblemen voorkómen voor ze ontstaan.",
      },
      { type: "h2", text: "Ons verdict: ga erheen" },
      {
        type: "p",
        text: "We vertrokken van de Kempense Golf met meer inzichten over onze swing dan na jaren van klassieke lessen. Dat is de kracht van grip.academy: de combinatie van vier complementaire technologieën, bediend door coaches die weten hoe ze die data moeten vertalen naar bruikbaar advies. Trackman onthult wat de bal doet, HackMotion wat de handen doen, de drukplaten wat de voeten doen, en Golfbox AI wat het allemaal betekent op de baan. Samen vormen ze een 360°-analyse die tien jaar geleden alleen voor tourspelers toegankelijk was.",
      },
      {
        type: "p",
        text: "grip.academy op de Kempense Golf is een adres dat elke serieuze golfer — van enthousiaste amateur tot gevorderde speler — minstens één keer zou moeten bezoeken. Niet omdat technologie golf vervangt, maar omdat het je eindelijk laat zien wat je zelf nooit kon waarnemen. En dan gaat het snel. Opvallend snel.",
      },
      {
        type: "source",
        text: "Bron: grip.academy · Kempense Golf — sessieverslag mei 2026",
      },
    ],
  },
  {
    slug: "einde-liv-golf",
    title: "Bedankt voor de biljarden, sheik — het einde van LIV Golf",
    titleHtml: "Bedankt voor de<br/>biljarden, sheik —<br/><em>het einde van LIV Golf.</em>",
    excerpt:
      "Saudi-Arabië trekt de stekker eruit. Bryson wil terug. Phil Mickelson zit ergens op een jacht. Een terugblik met gepaste — en eerlijk gezegd verdiende — leedvermaak.",
    seoDescription:
      "Saudi-Arabië trekt de stekker eruit, Bryson wil terug, Phil zit op een jacht. Een terugblik op het einde van LIV Golf, met gepast leedvermaak.",
    date: "03/05/2026",
    author: "PAMPAS Redactie",
    readTime: "6 min",
    topics: ["LIV Golf", "PGA Tour", "Saudi-Arabië", "Rahm", "DeChambeau"],
    category: "Tours · Profgolf · LIV · PGA",
    sourceName: "CBS Sports · Golf Digest · Sky Sports · Athlon Sports",
    content:
      "Vier jaar geleden denderde LIV Golf de golfwereld binnen alsof iemand een olievat had aangestoken op de 18de green van Augusta.",
    richContent: [
      {
        type: "subtitle",
        text: "Saudi-Arabië trekt de stekker eruit. Bryson wil terug. Phil Mickelson zit ergens op een jacht. Een terugblik met gepaste — en eerlijk gezegd verdiende — leedvermaak.",
      },
      {
        type: "p",
        text: "Vier jaar geleden denderde LIV Golf de golfwereld binnen alsof iemand een olievat had aangestoken op de 18de green van Augusta. Geld? Zoveel als je wil. Spelers? Die kopen we gewoon. Publiek? Tja — dat hadden ze eigenlijk niet echt voorzien. En nu, terwijl de stofwolken optrekken, blijkt het allemaal een beetje anders te zijn gelopen dan de PowerPoint-presentaties van 2022 hadden beloofd.",
      },
      {
        type: "p",
        text: 'Saudi-Arabië\'s Public Investment Fund — het fonds dat met naar schatting meer dan vijf miljard dollar LIV Golf had gefinancierd — heeft beslist dat het genoeg is geweest. De financiering stopt eind 2026. Chairman Yasir Al-Rumayyan, de architect van het hele avontuur, is al vertrokken. Een toernooi werd onlangs uitgesteld wegens "hitte en een voetbalconflict" — wat eerlijk gezegd de meest Belgische reden voor annulatie is die ik ooit heb gehoord, maar dan in de Arabische woestijn.',
      },
      {
        type: "stats",
        items: [
          { num: "$5 mrd", label: "totale investering PIF" },
          { num: "175K", label: "kijkers per toernooi" },
          { num: "3,1 M", label: "PGA Tour gemiddeld" },
          { num: "4 jaar", label: "van launch tot uitdoof" },
        ],
      },
      { type: "h2", text: "Hoe gaat het met de spelers?" },
      {
        type: "p",
        text: 'Brooks Koepka is al weg. Patrick Reed ook. En Bryson DeChambeau — het gezicht van LIV, de man die volgens bronnen een contract vroeg dat ruim boven de 300 miljoen van Jon Rahm lag — laat nu via zijn entourage weten dat hij "openstaat voor opties". Vertaling: hij neemt LIV\'s oproepen niet meer op. Rahm zelf zit nog geblokkeerd op de DP World Tour, wat zijn Ryder Cup-toekomst gecompliceerd maakt. De ironie wil dat Rahm in 2023 precies het moment koos om over te stappen waarop LIV al op zijn retour was — en daarmee het conflict een jaar langer rekte dan nodig was.',
      },
      {
        type: "quote",
        text: "LIV Golf was geen golfcompetitie. Het was een geopolitiek instrument. En zodra het zijn doel had gediend — of niet had gediend — werd de stekker eruit getrokken. Zo simpel is het.",
      },
      { type: "h2", text: "Wat blijft er over?" },
      {
        type: "p",
        text: "Het grappige is dat LIV Golf, in zijn wanhopige poging om serieus genomen te worden, zichzelf volledig omvormde tot datgene waartegen het zich had afgezet. Van 54 naar 72 holes, van shotgun naar gewone startlijsten, wereldranking-punten voor enkel de top tien — ze werden de PGA Tour, maar dan zonder de kijkers, de geschiedenis, of het gevoel dat er iets op het spel staat. Zoals een coverband die besluit exact hetzelfde te spelen als het origineel, maar in een lege parking.",
      },
      {
        type: "p",
        text: 'Zullen we LIV missen? Een klein beetje. Het was tenminste drama. In een sport waar het grootste nieuws normaal "Rory McIlroy heeft een nieuwe putter" is, was dat soms verfrissend. Maar uiteindelijk gold voor LIV Golf hetzelfde als voor elke poging om iets te kopen dat je niet kan kopen: het publiek pikt het gewoon niet.',
      },
      {
        type: "source",
        text: "Bronnen: CBS Sports · Golf Digest · Sky Sports · Athlon Sports — april/mei 2026",
      },
    ],
  },
  {
    slug: "route-36-just-golf",
    title: "Just Golf — Jouw persoonlijk startpistool",
    titleHtml: "Just Golf —<br/>Jouw persoonlijk<br/><em>startpistool</em>.",
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
      "Wil je beginnen met golf in België maar heb je geen idee waar te starten? Dan is de Just Golf route — voorheen bekend als Route 36 — precies wat je nodig hebt.",
    richContent: [
      {
        type: "subtitle",
        text: "Hoe Golf Vlaanderen het leren golfen hertekende van een stresstest naar een spelenderwijs avontuur.",
      },
      {
        type: "p",
        text: "Wil je beginnen met golf in België maar heb je geen idee waar te starten? Dan is de <strong>Just Golf route</strong> — voorheen bekend als <strong>Route 36</strong> — precies wat je nodig hebt. Dit persoonlijk begeleidingstraject van Golf Vlaanderen vervangt het vroegere GVB-systeem met zijn zware examens en verplichte testen. Het doel is simpel: elke nieuwe golfer spelenderwijs naar een eerste officiële handicap begeleiden.",
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
      { type: "h2", text: "Waarom bestaat de Just Golf route?" },
      {
        type: "p",
        text: "Golf Vlaanderen stelde een ongemakkelijke waarheid vast: de helft van alle drop-out — meer dan 3.000 golfers per jaar — stopt bij spelers die nog geen twee jaar actief zijn én de drempel van handicap 36 nog niet gehaald hebben. Het waren mensen die de sport graag zagen, maar ergens onderweg afhaken. De Just Golf route is het antwoord op die stilte.",
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
        text: "De app is de centrale plek voor je volledige Just Golf-traject. Je installeert hem via je federatienummer en persoonlijk wachtwoord. Je volgt er je voortgang op, oefent je regelkennis, boekt greenfees op andere clubs en schrijft je in voor clubwedstrijden. Elke badge die je behaalt, verschijnt er live — een kleine, maar merkbare motivatie om door te zetten.",
      },
      { type: "quote", text: "\u201CGeen zorgen, Just Golf.\u201D — Golf Vlaanderen" },
      { type: "h2", text: "Klaar om te starten?" },
      {
        type: "p",
        text: "De Just Golf route maakt van golf wat het altijd had moeten zijn: toegankelijk, plezierig en op jouw tempo. Geen zware examens, geen onnodige druk op slechte rondes. Gewoon stap voor stap, badge per badge, richting je eerste officiële handicap. Contacteer een golfclub bij jou in de buurt en vraag naar het Just Golf traject.",
      },
      {
        type: "source",
        text: "Bron: Golf Vlaanderen & golfvlaanderen.be — Just Golf route documentatie",
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
      {
        type: "subtitle",
        text: "Een rondleiding langs de meest irritante, meest geliefde en meest Belgische obstakels op onze golfbanen: de boom midden in de fairway.",
      },
      {
        type: "p",
        text: "Hij staat er al twintig jaar. Misschien dertig. Niemand weet nog precies waarom, niemand heeft hem geplant met de intentie om jouw drive te verpesten — en toch doet hij dat, elke keer weer, met de serene rust van iemand die weet dat hij gelijk heeft. De boom midden in de fairway is een Belgisch fenomeen van de eerste orde: tegelijk obstakel, landmark en stille getuige van duizenden gevloekte slagen.",
      },
      {
        type: "p",
        text: "Wij trokken onze stoute schoenen aan en maakten een inventaris op. Geen wetenschappelijk onderzoek, geen officiële studie — gewoon een lijst van holes waarop de natuur besloten heeft om het woord te nemen. In totaal identificeerden we samen met onze Pampas community <strong>33 holes</strong> op Belgische golfbanen waar een boom, een bomenrij of een opvallend houtachtig wezen zijn permanente woonst heeft gevonden op het rechte pad tussen tee en green.",
      },
      {
        type: "stats",
        items: [
          { num: "33", label: "holes met boom(en)" },
          { num: "20+", label: "verschillende clubs" },
          { num: "7", label: "clubs met 2+ holes" },
          { num: "∞", label: "gevloekte slagen" },
        ],
      },
      { type: "h2", text: "Waarom bestaat de fairway-boom eigenlijk?" },
      {
        type: "p",
        text: "De eerlijke waarheid: de meeste bomen stonden er al voor de baan aangelegd werd. Een architect tekende de hole eromheen, of deed alsof hij dat deed, en zo werd een eik of een beuk opeens een strategisch element. Anderen werden geplant als landmark, als schaduwgever, of gewoon omdat iemand op het bestuur een zwak had voor linden. En dan is er nog de categorie die gewoon spontaan opgegroeid is terwijl niemand keek.",
      },
      {
        type: "p",
        text: "Hoe dan ook: ze zijn er. Ze gaan niet weg. En ergens — als je eerlijk bent na een koude Duvel op de terras — hou je er wel van. Ze maken de hole. Ze dwingen je om na te denken. Ze scheiden de dragers van de lijders.",
      },
      { type: "quote", text: "Links golf heeft bunkers. Belgisch golf heeft bomen. En die bomen winnen altijd." },
      { type: "h2", text: "De toppers: clubs met meerdere boombeschermde holes" },
      {
        type: "p",
        text: "Uit onze bevraging blijkt dat sommige clubs all-in gaan. Keerbergen heeft er drie, Millennium maar liefst drie, Hasselt drie, Steenhoven twee, Limburg drie, Oudenaarde Anker twee, en Enghien twee. Dat is geen toeval, dat is een filosofie. Of gewoon een heel oud bos.",
      },
      {
        type: "p",
        text: "Een bijzondere vermelding voor de holes met een asterisk (*) in onze lijst: dat zijn de plaatsen waar de boom er wel staat, maar niet helemaal centraal. Een halve blokkade dus. Genoeg om twijfel te zaaien, maar niet genoeg om je een volwaardige uitweg te ontzeggen. Sommige golfers vinden dat het ergste van de twee opties.",
      },
      { type: "h2", text: "De volledige lijst: hole per hole" },
      {
        type: "p",
        text: "Hieronder vind je alle geïnventariseerde holes, netjes geordend per club. Holes met een (*) zijn die waarbij de boom niet centraal staat maar wel degelijk in het spel komt. Beschouw het als een waarschuwing — of als een uitnodiging om te gaan kijken.",
      },
      {
        type: "badges",
        items: [
          {
            num: "Club 01",
            title: "Kempense Golf Club — Holes 12 & 18",
            text: "Twee holes, twee bomen, één consistente boodschap: de Kempense houdt van karakter. Hole 12 is de bekendste boomspeelhole van de baan. De boom staat er fier en centraal. Hole 18 laat je afsluiten met een doordacht afscheidsgebaar. Alleen een lay-up met precies de juiste afstand opent de poort naar de green net voor het clubhuis.",
          },
          {
            num: "Club 02",
            title: "Golfclub Kampenhout — Hole 1",
            text: "Een bewuste eerste indruk. Kampenhout gooit meteen op hole 1 een boom in de weg. En deze boom staat écht pal in het midden. Welkom, beste golfer.",
          },
          {
            num: "Club 03",
            title: "Golf Hasselt — Holes 1, 2 & 14",
            text: "Hasselt doet het grondig. Drie holes, drie obstakels. Je weet meteen hoe laat het is op hole 1, en als je denkt dat je het onder controle hebt, herinnert hole 2 je eraan dat niks vanzelfsprekend is.",
          },
          {
            num: "Club 04",
            title: "Golf de Rigenée — Hole 1",
            text: "Rigenée, diep in de Brabantse heuvels, ontvangt zijn spelers met een boom op de eerste hole. En wat voor een. Groot, centraal en aanwezig. Een warme begroeting, Waalse stijl.",
          },
          {
            num: "Club 05",
            title: "Koksijde Golf ter Hille — Hole 11",
            text: "Aan de kust, waar de wind al genoeg doet, voelt een boom in de fairway bijna als overkill. En toch: hole 11 op Koksijde bewijst dat ook linksgolf niet immuun is voor het fenomeen.",
          },
          {
            num: "Club 06",
            title: "Steenhoven Country Club — Holes 5 & 11",
            text: "Steenhoven heeft twee holes waar een boom de spellogica compliceert. Hole 5 en hole 11 liggen ver genoeg uit elkaar om je elke keer opnieuw te verrassen, alsof je het de eerste keer al vergeten bent. Perfect tee shot in de opening op hole 11? Check. Tweede slag volledig geblokkeerd door een boom? Check!",
          },
          {
            num: "Club 07",
            title: "Golf Club Mont Garni — Hole 14",
            text: "In de Henegouwse Borinage, op een baan die voor veel Vlamingen onontgonnen terrein is, staat op hole 14 een boom die wacht. Rustig. Geduldig. Altijd.",
          },
          {
            num: "Club 08",
            title: "Royal Limburg Golf — Holes 13, 17* & 18*",
            text: "Drie holes, waarvan twee met een asterisk. Hole 13 is de centrale boomaanwezigheid. Op hole 17 en 18 staat de boom er ietwat half — hij staat er en hij staat er ook niet helemaal. Genoeg voor twijfel. Genoeg voor debat aan de bar achteraf.",
          },
          {
            num: "Club 09",
            title: "Drie Eycken — Hole 3",
            text: "De naam van de club verraadt al iets over de relatie met bomen. Op hole 3 krijgt die relatie een concrete vorm: een boom midden in de lijn.",
          },
          {
            num: "Club 10",
            title: "Royal Keerbergen Golf Club — Holes 3*, 7* & 12",
            text: "Keerbergen speelt het slim: holes 3 en 7 hebben een boom die het midden niet helemaal opeist (*), maar hole 12 compenseert dat met een boom die er vol voor gaat. Een baan die je op drie momenten aan het twijfelen brengt.",
          },
          {
            num: "Club 11",
            title: "Golf Oudenaarde (Anker) — Holes 14 & 17",
            text: "Oudenaarde heeft twee courses en de Anker-baan rekent op twee fairway-bomen om zijn identiteit te verdedigen. Hole 14 en 17 — allebei in de tweede helft van de ronde, precies wanneer de concentratie wat wegebt.",
          },
          {
            num: "Club 12",
            title: "Golf Oudenaarde (Kasteel) — Hole 13",
            text: "Ook op de Kasteel-course van Oudenaarde staat er eentje klaar. Hole 13 — klassiek golfgetal voor klassiek golfkarakter.",
          },
          {
            num: "Club 13",
            title: "Cleydael Golf & Country Club — Hole 2",
            text: "Cleydael, de Antwerpse kasteelbaan, heeft op hole 2 een boom die je al vroeg in de ronde laat nadenken over wie hier eigenlijk de baas is.",
          },
          {
            num: "Club 14",
            title: "Millennium Golf — Holes 3*, 8* & 10*",
            text: "Millennium is de kampioen van de halve blokkade. Drie holes met een asterisk — drie bomen die niet helemaal centraal staan maar je toch alle kanten op sturen. Het is bijna artistiek: aanwezig genoeg om je beslissing te beïnvloeden, bescheiden genoeg om je nadien te laten twijfelen of je er last van had.",
          },
          {
            num: "Club 15",
            title: "Golf Mergelhof — Hole 12",
            text: "In het Limburgse heuvelland heeft Mergelhof op hole 12 een boom die past bij het landschap: groot, robuust en niet van plan om zich te verontschuldigen.",
          },
          {
            num: "Club 16",
            title: "Spiegelven Golfclub — Hole 4",
            text: "Spiegelven ligt in Genk, in een landschap van heide en naaldbomen. Dat hole 4 er ook eentje in de fairway heeft staan, voelt bijna logisch.",
          },
          {
            num: "Club 17",
            title: "Golf Enghien — Holes 5 & 18",
            text: "Enghien laat je beginnen én eindigen met een boom. Hole 5 voor het vroege twijfelmoment, hole 18 voor de dramatische finale. Wie zegt dat Belgisch golf geen verhaalstructuur heeft?",
          },
          {
            num: "Club 18",
            title: "Rinkven Golfclub South — Hole 4*",
            text: "Rinkven, een van de meest gerenommeerde clubs van het land, heeft ook zijn boom. Hole 4 op de South course. Al staat deze niet écht in de weg, tenzij je links in de Pampas ligt.",
          },
          {
            num: "Club 19",
            title: "Royal Waterloo Golf Club (Lion) — Hole 4",
            text: "Aan de voet van de Leeuw van Waterloo staat op hole 4 een boom die minstens even onwrikbaar is als het monument op de heuvel. Napoleon had al problemen met de omgeving, jij ook.",
          },
          {
            num: "Club 20",
            title: "Golf Rougemont — Hole 4",
            text: "Rougemont, in de Brabantse Waalse heuvels, heeft op hole 4 een boom die de setting compleet maakt. Groen, stil, en precies daar waar je hem niet wil.",
          },
          {
            num: "Club 21",
            title: "Durbuy Golf — Hole 13",
            text: "Durbuy, de kleinste stad ter wereld, heeft een baan die allesbehalve klein speelt. Hole 13 heeft een boom die past bij de Ardense stijl: wild, onverwacht en absoluut niet te negeren.",
          },
        ],
      },
      { type: "h2", text: "Wat doe je ermee?" },
      {
        type: "p",
        text: "Er zijn drie soorten golfers als ze een boom in de fairway zien. De eerste type slaat er gewoon omheen, kiest veilig, en accepteert dat de baan de architect heeft. Het tweede type probeert erdoorheen te spelen, ontdekt dat bomen daadwerkelijk hout zijn, en scoort een extra slag. Het derde type — de ware romanticus — ziet de boom als kans, speelt een prachtige fade of draw rondom het obstakel, en staat die avond nog te vertellen over die ene swing op hole 13 van de Kempense.",
      },
      {
        type: "p",
        text: "De waarheid is dat fairway-bomen Belgisch golf maken tot wat het is: minder perfect dan een moderne strokesavers-baan, maar veel meer een gesprek. Elke boom heeft een naam die niemand hem gegeven heeft maar iedereen kent. Elke boom heeft een verhaal. En elke boom wacht rustig op je volgende bezoek.",
      },
      {
        type: "quote",
        text: "Hij staat er al twintig jaar. Hij gaat er nog twintig jaar staan. En eerlijk? We zouden het niet anders willen.",
      },
      { type: "h2", text: "Help ons de lijst aanvullen" },
      {
        type: "p",
        text: "Dit is geen gesloten inventaris. Integendeel: we zijn ervan overtuigd dat er nog tientallen bomen zijn die wachten op erkenning. Ken jij een hole waar een boom de fairway in tweeën deelt, een line-up belemmert of gewoon staat te lachen terwijl jij zoekt? Stuur het ons door. We houden de lijst bij. We gaan ze allemaal spelen.",
      },
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
