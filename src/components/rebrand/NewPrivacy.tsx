import { LegalPage, type LegalSection } from "./LegalPage";
import { GBA, LEGAL_CONTACT_EMAIL, LEGAL_CONTROLLER } from "@/lib/legal";

const mail = (
  <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>
);

const sections: LegalSection[] = [
  {
    id: "wie",
    title: "Wie is verantwoordelijk?",
    body: (
      <>
        <p>
          Verantwoordelijk voor de verwerking van je persoonsgegevens op deze website is{" "}
          <strong>{LEGAL_CONTROLLER.name}</strong>
          {LEGAL_CONTROLLER.form ? ` (${LEGAL_CONTROLLER.form})` : ""}, een onafhankelijke Belgische
          golfpodcast van Lars, Levi en Niels.
        </p>
        <ul>
          {LEGAL_CONTROLLER.companyNumber && <li>Ondernemingsnummer: {LEGAL_CONTROLLER.companyNumber}</li>}
          {LEGAL_CONTROLLER.address && <li>Adres: {LEGAL_CONTROLLER.address}</li>}
          <li>E-mail: {mail}</li>
        </ul>
        <p>
          Voor alle vragen over je gegevens kan je terecht op dat e-mailadres. We hebben geen
          functionaris voor gegevensbescherming aangesteld, omdat we daartoe niet verplicht zijn.
        </p>
      </>
    ),
  },
  {
    id: "kort",
    title: "Kort samengevat",
    body: (
      <ul>
        <li>
          Je kan de site gebruiken zonder account en zonder je naam of e-mailadres te geven.
        </li>
        <li>
          We gebruiken <strong>geen advertentie- of trackingcookies</strong> en geen Google Analytics.
        </li>
        <li>
          Persoonsgegevens verzamelen we alleen als je ze zelf geeft (contactformulier, nieuwsbrief) of
          als ze nodig zijn om misbruik van de stemfuncties te voorkomen (een geheugensteun in je browser
          en een versleutelde afdruk van je IP-adres).
        </li>
        <li>We verkopen geen gegevens en delen ze niet voor reclamedoeleinden.</li>
        <li>Je kan je gegevens altijd opvragen, laten verbeteren of laten wissen.</li>
      </ul>
    ),
  },
  {
    id: "gegevens",
    title: "Welke gegevens verwerken we, waarom en hoe lang?",
    body: (
      <>
        <h3 className="font-rb-serif text-lg text-[var(--rb-ink)] pt-2">Contactformulier</h3>
        <ul>
          <li>
            <strong>Gegevens:</strong> naam, e-mailadres, onderwerp, je bericht en het type vraag
            (algemeen, sponsoring of gast).
          </li>
          <li>
            <strong>Doel:</strong> je vraag beantwoorden en een eventuele samenwerking opvolgen.
          </li>
          <li>
            <strong>Rechtsgrond:</strong> ons gerechtvaardigd belang om vragen te beantwoorden, of de
            voorbereiding van een overeenkomst waar je om vraagt.
          </li>
          <li>
            <strong>Bewaartermijn:</strong> zolang nodig om je te antwoorden, en daarna niet langer dan
            24 maanden, tenzij er een lopende samenwerking is.
          </li>
          <li>
            <strong>Hoe:</strong> het bericht wordt via onze e-mailverstuurder (Brevo) naar ons
            gemeenschappelijk postvak bezorgd. We bewaren het bericht niet in een aparte database op de
            website.
          </li>
        </ul>

        <h3 className="font-rb-serif text-lg text-[var(--rb-ink)] pt-4">Nieuwsbrief</h3>
        <ul>
          <li>
            <strong>Gegevens:</strong> je e-mailadres, de plaats op de site waar je je inschreef en het
            tijdstip.
          </li>
          <li>
            <strong>Doel:</strong> je op de hoogte houden van nieuwe afleveringen en nieuws van PAMPAS.
          </li>
          <li>
            <strong>Rechtsgrond:</strong> je toestemming. Je kan die op elk moment intrekken.
          </li>
          <li>
            <strong>Bewaartermijn:</strong> tot je je uitschrijft. Uitschrijven kan via de link onderaan
            elke nieuwsbrief of door ons te mailen.
          </li>
          <li>
            <strong>Hoe:</strong> we bewaren je inschrijving in onze eigen database (Supabase) en in
            onze nieuwsbriefdienst (Brevo).
          </li>
        </ul>

        <h3 className="font-rb-serif text-lg text-[var(--rb-ink)] pt-4">Community-stemmen over banen</h3>
        <p>
          Je kan bij banen een score geven en aangeven of honden mee mogen (het "pootje"). Dat kan
          anoniem. Om te zorgen dat één persoon niet honderden keren stemt, gebruiken we twee dingen:
        </p>
        <ul>
          <li>
            <strong>Een willekeurig stem-ID in je browser.</strong> Dit is een toevallig gegenereerd
            nummer (sleutel <code>pampas_voter_id</code> in de lokale opslag van je browser). Het bevat
            geen naam of e-mailadres. Wis je de gegevens van je browser, dan verlies je dat nummer en
            kunnen we je eerdere stemmen niet meer aan jou koppelen.
          </li>
          <li>
            <strong>Een versleutelde afdruk van je IP-adres.</strong> Je IP-adres zelf bewaren we niet.
            We maken er met een geheime sleutel een onomkeerbare code (een "hash") van. Bij de
            hondenvraag bewaren we die code bij je stem, zodat elke bezoeker maar één keer per baan
            telt. Bij beide soorten stemmen gebruiken we zo'n code ook om het aantal stemmen per uur en
            per dag te beperken. Omdat die code een bezoeker kan herkennen, beschouwen we ze als
            persoonsgegeven (gepseudonimiseerd).
          </li>
          <li>
            <strong>Doel:</strong> betrouwbare scores en een eerlijke uitslag, en misbruik tegengaan.
          </li>
          <li>
            <strong>Rechtsgrond:</strong> ons gerechtvaardigd belang om manipulatie van de scores te
            voorkomen.
          </li>
          <li>
            <strong>Bewaartermijn:</strong> de stem en het stem-ID blijven bewaard zolang de stem
            meetelt. De tellers die het aantal stemmen beperken worden na twee dagen automatisch verwijderd. Wil
            je dat een stem verdwijnt, mail ons dan het stem-ID uit je browser; zonder dat nummer kunnen
            we je stem niet terugvinden, want we weten niet wie je bent.
          </li>
        </ul>

        <h3 className="font-rb-serif text-lg text-[var(--rb-ink)] pt-4">Veiligheid en misbruik</h3>
        <p>
          Ook bij het contactformulier en de nieuwsbrief tellen we met een versleutelde afdruk van je
          IP-adres hoeveel verzoeken één bezoeker doet, om spam en aanvallen tegen te gaan. Die tellers worden na twee dagen automatisch verwijderd. Daarnaast
          verwerkt onze hostingpartij (Cloudflare) technische gegevens zoals je IP-adres en browsertype
          om de site te leveren en te beveiligen.
        </p>

        <h3 className="font-rb-serif text-lg text-[var(--rb-ink)] pt-4">Statistieken</h3>
        <p>
          We meten het bezoek met de eigen statistieken van ons platform. Daarmee zien we het aantal
          bezoeken en bekeken pagina's, zonder je over andere websites te volgen en zonder dat gegevens
          voor reclame worden gebruikt. We gebruiken op dit moment <strong>geen Google Analytics</strong>.
          Zouden we dat later toevoegen, dan passen we deze verklaring aan en vragen we vooraf je
          toestemming.
        </p>

        <h3 className="font-rb-serif text-lg text-[var(--rb-ink)] pt-4">Beheer van de site</h3>
        <p>
          Alleen de makers van PAMPAS kunnen inloggen op het beheergedeelte. Bezoekers hebben geen
          account.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies en lokale opslag",
    body: (
      <>
        <p>
          We plaatsen geen tracking- of advertentiecookies. Wel gebruiken we een paar technische
          onderdelen die nodig zijn voor de werking van de site. Daarvoor is geen toestemming nodig.
        </p>
        <ul>
          <li>
            <code>pampas_voter_id</code> (lokale opslag): je anonieme stem-ID, zie hierboven.
          </li>
          <li>
            <code>emailPopupSeen</code> en <code>emailCaptured</code> (lokale opslag): onthouden dat je
            het nieuwsbriefvenster al zag of je al inschreef, zodat het niet blijft terugkomen.
          </li>
          <li>
            <code>pampas:geocode:v2</code> (lokale opslag): een tijdelijk geheugen met de ligging van
            golfbanen, zodat de kaart sneller laadt. Er staat geen persoonlijke informatie in.
          </li>
          <li>
            Een sessiecookie en een versiecookie van ons hostingplatform (<code>session-id</code>,{" "}
            <code>__dpl</code>) voor de werking en de statistieken van de site.
          </li>
        </ul>
        <p>
          Je kan cookies en lokale opslag altijd verwijderen via de instellingen van je browser. De
          site blijft dan werken, maar je stem-ID is dan weg.
        </p>
      </>
    ),
  },
  {
    id: "derden",
    title: "Diensten van derden",
    body: (
      <>
        <p>
          Voor sommige onderdelen laden we inhoud van andere bedrijven. Zij ontvangen dan technische
          gegevens zoals je IP-adres en kunnen zelf cookies plaatsen. Voor wat zij daarmee doen, gelden
          hun eigen privacyverklaringen.
        </p>
        <ul>
          <li>
            <strong>Spotify</strong>: de ingebouwde podcastspeler. Spotify kan gegevens ontvangen
            zodra de speler op de pagina verschijnt.
          </li>
          <li>
            <strong>Instagram (Meta)</strong>: ingebedde berichten, enkel op pagina's waar we die tonen.
          </li>
          <li>
            <strong>Google Maps</strong>: de kaarten bij de banen. Google ontvangt je IP-adres en de
            kaartaanvragen. In de routeplanner sturen we de plaats of postcode die je invult via onze
            server naar Google om de afstand te berekenen. Wij bewaren die invoer niet.
          </li>
        </ul>
        <p>
          Voor het verwerken van gegevens in opdracht van ons werken we met de volgende
          verwerkers: <strong>Supabase</strong> (database), <strong>Cloudflare</strong> (hosting en
          beveiliging), <strong>Lovable</strong> (ontwikkel- en hostingplatform) en{" "}
          <strong>Brevo</strong> (e-mail en nieuwsbrief). Waar gegevens buiten de Europese Economische
          Ruimte worden verwerkt, gebeurt dat met passende waarborgen, zoals de modelcontractbepalingen
          van de Europese Commissie.
        </p>
        <p>We verkopen je gegevens niet en delen ze niet met adverteerders of sponsors.</p>
      </>
    ),
  },
  {
    id: "rechten",
    title: "Jouw rechten",
    body: (
      <>
        <p>Op grond van de Algemene Verordening Gegevensbescherming (AVG) heb je het recht om:</p>
        <ul>
          <li>je gegevens in te kijken en een kopie te krijgen;</li>
          <li>onjuiste gegevens te laten verbeteren;</li>
          <li>je gegevens te laten wissen ("recht om vergeten te worden");</li>
          <li>de verwerking te laten beperken of er bezwaar tegen te maken;</li>
          <li>je gegevens in een bruikbaar formaat te ontvangen (overdraagbaarheid);</li>
          <li>je toestemming op elk moment in te trekken, zonder dat dit de eerdere verwerking aantast.</li>
        </ul>
        <p>
          Stuur je vraag naar {mail}. We kunnen vragen om je identiteit te bevestigen en antwoorden
          binnen één maand. Bij een vraag over een anonieme stem hebben we het stem-ID uit je browser
          nodig, anders kunnen we de stem niet aan jou koppelen.
        </p>
        <p>
          Ben je niet tevreden over ons antwoord? Dan kan je een klacht indienen bij de{" "}
          <a href={GBA.url} target="_blank" rel="noreferrer">
            {GBA.name}
          </a>
          , {GBA.address}, <a href={`mailto:${GBA.email}`}>{GBA.email}</a>.
        </p>
      </>
    ),
  },
  {
    id: "veiligheid",
    title: "Beveiliging",
    body: (
      <p>
        We nemen redelijke technische en organisatorische maatregelen om je gegevens te beschermen: een
        beveiligde verbinding (HTTPS), beperkte toegang tot de database, en geen publieke toegang tot
        inschrijvingen of stem-IDs. Een volledig veilig systeem bestaat niet. Merk je een probleem op,
        meld het dan aan {mail}.
      </p>
    ),
  },
  {
    id: "kinderen",
    title: "Kinderen",
    body: (
      <p>
        De site richt zich niet tot kinderen onder de 13 jaar. Geef geen persoonsgegevens door als je
        jonger bent dan 13. Merk je dat een kind ons toch gegevens bezorgde, mail ons dan en we
        verwijderen ze.
      </p>
    ),
  },
  {
    id: "wijzigingen",
    title: "Wijzigingen",
    body: (
      <p>
        We passen deze verklaring aan als onze werkwijze verandert, bijvoorbeeld als we accounts voor
        bezoekers invoeren of statistiekdiensten toevoegen. De datum bovenaan toont de laatste
        wijziging. Bij ingrijpende wijzigingen vragen we waar nodig opnieuw je toestemming.
      </p>
    ),
  },
];

export function NewPrivacy() {
  return (
    <LegalPage
      kicker="Jouw gegevens"
      title={
        <>
          Privacy<em className="italic">verklaring</em>.
        </>
      }
      intro={
        <p>
          Hier lees je welke persoonsgegevens we verwerken op indepampas.be, waarom, hoe lang en wat je
          zelf kan doen. We houden het zo beperkt mogelijk.
        </p>
      }
      sections={sections}
      other={{ to: "/disclaimer", label: "disclaimer" }}
    />
  );
}
