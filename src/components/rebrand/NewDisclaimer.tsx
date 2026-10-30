import { Link } from "@tanstack/react-router";
import { LegalPage, type LegalSection } from "./LegalPage";
import { LEGAL_CONTACT_EMAIL } from "@/lib/legal";

const mail = <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>;

const sections: LegalSection[] = [
  {
    id: "algemeen",
    title: "Algemeen",
    body: (
      <>
        <p>
          indepampas.be is de website van PAMPAS, een onafhankelijke Belgische golfpodcast. Alles op deze
          site is bedoeld als informatie en entertainment. Door de site te gebruiken ga je akkoord met
          deze disclaimer.
        </p>
        <p>
          We doen ons best om alles correct en actueel te houden, maar we geven geen garantie dat de
          informatie volledig, juist of up-to-date is.
        </p>
      </>
    ),
  },
  {
    id: "meningen",
    title: "Meningen en ratings",
    body: (
      <>
        <p>
          Wat in de afleveringen, de blogs en bij de hosts-ratings staat, zijn <strong>persoonlijke
          meningen en ervaringen</strong> van Lars, Levi en Niels. Een rating is een subjectieve
          indruk op een bepaalde dag, geen feitelijk oordeel en geen objectieve test.
        </p>
        <p>
          De <strong>community-scores</strong> komen van bezoekers van de site. Wij controleren niet wie
          stemt, of die persoon de baan echt speelde, of de score eerlijk is. Ze zeggen daarom iets over
          wat bezoekers vinden, niet over de werkelijke kwaliteit van een baan. We beperken misbruik
          technisch, maar kunnen manipulatie niet volledig uitsluiten.
        </p>
        <p>
          Het is niet onze bedoeling een baan, club of persoon te schaden. Vind je dat iets op de site
          onjuist is, mail ons dan en we bekijken het snel.
        </p>
      </>
    ),
  },
  {
    id: "baaninfo",
    title: "Informatie over golfbanen",
    body: (
      <>
        <p>
          Gegevens over banen, zoals ligging, aantal holes, tarieven, openingstijden, toegankelijkheid
          en regels, kunnen veranderen. <strong>Controleer altijd bij de club zelf</strong> voor je
          reist of boekt. Wij zijn niet verantwoordelijk voor een vergeefse verplaatsing of een
          onverwachte prijs.
        </p>
        <p>
          Afstanden en routes uit de routeplanner zijn een schatting en houden geen rekening met files of
          werken.
        </p>
      </>
    ),
  },
  {
    id: "hond",
    title: "Hondvriendelijke banen (het pootje)",
    body: (
      <>
        <p>
          Het pootje bij een baan komt van <strong>stemmen van bezoekers</strong> en is een
          indicatie, geen officiële of bevestigde regel van de club. Of honden mogen meekomen, waar en
          onder welke voorwaarden (aan de leiband, enkel op de baan of enkel op het terras) beslist de
          club en kan per dag of seizoen verschillen.
        </p>
        <p>
          Neem dus altijd vooraf contact op met de club voor je een hond meebrengt. Soms
          wegen we na contact met een club een beslissing van PAMPAS zwaarder dan de stemmen, maar ook
          dat blijft een indicatie. Je blijft zelf verantwoordelijk voor je hond en voor eventuele schade.
        </p>
      </>
    ),
  },
  {
    id: "geen-advies",
    title: "Geen advies",
    body: (
      <p>
        Niets op deze site is juridisch, financieel, medisch of sportief advies. Tips over uitrusting,
        techniek of trainingen zijn persoonlijke ervaringen en niet afgestemd op jouw situatie. Raadpleeg
        bij twijfel een professional, zoals je golfpro of een arts.
      </p>
    ),
  },
  {
    id: "samenwerkingen",
    title: "Samenwerkingen en sponsors",
    body: (
      <p>
        PAMPAS wordt gesteund door sponsors. Die worden vermeld in de sponsorbanner en, waar relevant, bij
        het betreffende artikel of de betreffende aflevering. Samenwerkingen met een bedrijf of club
        geven we aan. Een sponsor kan de inhoud of een rating niet kopen: onze meningen blijven die van
        onszelf.
      </p>
    ),
  },
  {
    id: "links",
    title: "Links en ingebouwde inhoud",
    body: (
      <p>
        De site bevat links naar en ingebouwde inhoud van andere websites en diensten, zoals Spotify,
        Instagram en Google Maps. Wij hebben geen invloed op die inhoud en zijn er niet verantwoordelijk
        voor. Een link betekent niet dat we de inhoud of de aanbieder onderschrijven. Voor wat zij met je
        gegevens doen, lees je de <Link to="/privacy" hash="derden">privacyverklaring</Link>.
      </p>
    ),
  },
  {
    id: "auteursrecht",
    title: "Auteursrecht en gebruik",
    body: (
      <>
        <p>
          Teksten, foto's, beeld, geluid, ratings en het PAMPAS-logo op deze site zijn beschermd door
          auteursrecht en zijn eigendom van PAMPAS of van de rechthebbende. Je mag een korte passage
          citeren met duidelijke bronvermelding en een link naar de site. Verdere
          verspreiding, bewerking of commercieel gebruik kan enkel met onze schriftelijke toestemming.
        </p>
        <p>
          Namen en logo's van clubs, merken en andere bedrijven blijven eigendom van de betrokken partijen
          en worden enkel gebruikt om ze te benoemen. Meld je een inbreuk op jouw rechten, mail ons
          dan; we reageren snel en passen of verwijderen de inhoud waar nodig.
        </p>
      </>
    ),
  },
  {
    id: "aansprakelijkheid",
    title: "Aansprakelijkheid",
    body: (
      <>
        <p>
          Het gebruik van de site en van de informatie erop is op eigen risico. Voor zover de wet het
          toestaat, zijn wij niet aansprakelijk voor schade die voortvloeit uit het gebruik of het niet
          kunnen gebruiken van de site, of uit beslissingen die je neemt op basis van de inhoud.
        </p>
        <p>
          We garanderen niet dat de site altijd beschikbaar is of foutloos werkt. We kunnen de site of
          onderdelen ervan zonder aankondiging aanpassen of stopzetten.
        </p>
        <p>
          Deze beperking geldt niet bij opzet of zware fout, en laat de wettelijke rechten van
          consumenten die niet kunnen worden uitgesloten onverlet.
        </p>
      </>
    ),
  },
  {
    id: "recht",
    title: "Toepasselijk recht en contact",
    body: (
      <>
        <p>Op deze disclaimer is het Belgisch recht van toepassing.</p>
        <p>
          Vragen, opmerkingen of een correctie? Mail naar {mail} of gebruik het{" "}
          <Link to="/contact">contactformulier</Link>. Hoe we met persoonsgegevens omgaan, lees je in de{" "}
          <Link to="/privacy">privacyverklaring</Link>.
        </p>
      </>
    ),
  },
];

export function NewDisclaimer() {
  return (
    <LegalPage
      kicker="Spelregels"
      title={
        <>
          Dis<em className="italic">claimer</em>.
        </>
      }
      intro={
        <p>
          PAMPAS is een podcast van drie vrienden met een mening. Hier lees je wat je wel en niet van de
          site mag verwachten.
        </p>
      }
      sections={sections}
      other={{ to: "/privacy", label: "privacyverklaring" }}
    />
  );
}
