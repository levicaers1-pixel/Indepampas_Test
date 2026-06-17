import { Link } from "@tanstack/react-router";
import type { Post } from "@/data/posts";

type Props = { post: Post; prev?: Post; next?: Post };

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=DM+Sans:wght@400;500;700&display=swap');

.gm-root {
  --cream: #F6F1E7;
  --dark-green: #1F3A2E;
  --lime: #C8E063;
  --ink: #2A2A26;
  --line: rgba(31, 58, 46, 0.12);
  background: var(--cream);
  color: var(--ink);
  font-family: 'DM Sans', sans-serif;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}
.gm-root * { box-sizing: border-box; }
.gm-root .wrap { max-width: 760px; margin: 0 auto; padding: 64px 24px 96px; }
.gm-root .eyebrow {
  font-family: 'DM Sans', sans-serif;
  font-weight: 700; font-size: 13px;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--dark-green); opacity: 0.6; margin-bottom: 18px;
}
.gm-root h1 {
  font-family: 'Playfair Display', serif; font-weight: 700;
  font-size: clamp(36px, 6vw, 56px); line-height: 1.12;
  color: var(--dark-green); margin: 0 0 18px; letter-spacing: -0.01em;
}
.gm-root .subtitle {
  font-size: 19px; color: var(--ink); opacity: 0.75;
  max-width: 540px; margin: 0 0 36px;
}
.gm-root .hero-quote {
  border-left: 3px solid var(--lime); padding: 18px 28px;
  margin: 36px 0 44px; background: rgba(200, 224, 99, 0.16);
  border-radius: 0 12px 12px 0;
}
.gm-root .hero-quote p {
  font-family: 'Playfair Display', serif; font-style: italic;
  font-size: 22px; color: var(--dark-green); line-height: 1.5; margin: 0;
}
.gm-root h2 {
  font-family: 'Playfair Display', serif; font-weight: 600;
  font-size: 28px; color: var(--dark-green); margin: 48px 0 16px;
}
.gm-root p { margin: 0 0 18px; font-size: 17px; }
.gm-root .lede { font-size: 19px; }
.gm-root .feature-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin: 28px 0 12px;
}
@media (max-width: 600px) {
  .gm-root .feature-grid { grid-template-columns: 1fr; }
}
.gm-root .feature-card {
  background: #FFFFFF; border: 1px solid var(--line);
  border-radius: 14px; padding: 22px 24px;
}
.gm-root .feature-card .icon-tag {
  display: inline-block; font-family: 'DM Sans', sans-serif;
  font-weight: 700; font-size: 12px; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--dark-green);
  background: var(--lime); padding: 4px 10px; border-radius: 6px; margin-bottom: 12px;
}
.gm-root .feature-card h3 {
  font-family: 'Playfair Display', serif; font-weight: 600;
  font-size: 19px; color: var(--dark-green); margin: 0 0 8px;
}
.gm-root .feature-card p { font-size: 15px; margin: 0; opacity: 0.85; }
.gm-root .stat-row {
  display: flex; gap: 32px; margin: 40px 0; padding: 28px;
  background: var(--dark-green); border-radius: 16px;
  color: var(--cream); flex-wrap: wrap;
}
.gm-root .stat { flex: 1; min-width: 140px; }
.gm-root .stat .num {
  font-family: 'Playfair Display', serif; font-weight: 700;
  font-size: 34px; color: var(--lime); display: block; margin-bottom: 4px;
}
.gm-root .stat .label { font-size: 13px; opacity: 0.85; }
.gm-root .brand-strip {
  margin: 32px 0; padding: 24px 0;
  border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);
}
.gm-root .brand-strip .label {
  font-family: 'DM Sans', sans-serif; font-weight: 700;
  font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--dark-green); opacity: 0.5; margin-bottom: 12px;
}
.gm-root .brand-list {
  font-family: 'Playfair Display', serif; font-size: 17px;
  color: var(--dark-green); line-height: 1.9;
}
.gm-root .closing {
  margin-top: 48px; padding: 32px;
  background: rgba(200, 224, 99, 0.18);
  border-radius: 16px; text-align: center;
}
.gm-root .closing p {
  font-family: 'Playfair Display', serif; font-style: italic;
  font-size: 20px; color: var(--dark-green); margin: 0 0 14px;
}
.gm-root .closing a {
  display: inline-block; font-family: 'DM Sans', sans-serif;
  font-weight: 700; font-size: 14px; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--cream);
  background: var(--dark-green); padding: 12px 28px;
  border-radius: 30px; text-decoration: none; transition: opacity 0.2s;
}
.gm-root .closing a:hover { opacity: 0.85; }
.gm-root .meta-footer {
  margin-top: 56px; font-size: 13px;
  color: var(--dark-green); opacity: 0.5; text-align: center;
}
.gm-root .back-link {
  display: inline-block; font-family: 'DM Sans', sans-serif;
  font-weight: 700; font-size: 12px; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--dark-green);
  text-decoration: none; margin-bottom: 24px; opacity: 0.7;
}
.gm-root .back-link:hover { opacity: 1; }
.gm-root .prevnext {
  display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
  margin-top: 48px; padding-top: 32px; border-top: 1px solid var(--line);
}
@media (max-width: 600px) { .gm-root .prevnext { grid-template-columns: 1fr; } }
.gm-root .prevnext a {
  font-family: 'DM Sans', sans-serif; text-decoration: none;
  color: var(--dark-green);
}
.gm-root .prevnext .pn-label {
  font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
  opacity: 0.55; display: block; margin-bottom: 6px;
}
.gm-root .prevnext .pn-title {
  font-family: 'Playfair Display', serif; font-size: 18px; line-height: 1.3;
}
`;

export function GolfMediaBlogPost({ post, prev, next }: Props) {
  return (
    <article className="gm-root -mx-6 lg:-mx-12 -mt-28 sm:-mt-36 lg:-mt-44 -mb-16">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="wrap">
        <Link to="/blog" className="back-link">← Terug naar de blog</Link>

        <div className="eyebrow">Partner in de spotlight</div>

        <h1>Een great network to play: hoe Golf Media de clubervaring naar een hoger niveau tilt</h1>

        <p className="subtitle">
          PAMPAS werkt samen met Golf Media, en dat is geen toeval. Hun digitale netwerk in de Belgische
          golfclubs maakt het leven van golfers net dat tikkeltje makkelijker, en dat is precies waar wij ook voor staan.
        </p>

        <p className="lede">
          Wie de afgelopen jaren door een Belgische golfclub heeft gewandeld, is er ongetwijfeld al langsgekomen:
          een strak digitaal scherm bij het onthaal of buiten op het terras, met de weersverwachting, de
          wedstrijdkalender en het laatste nieuws van de club. Dat scherm is van Golf Media, en het is meer dan
          alleen reclame. Wij vertellen je graag waarom dit Belgische bedrijf een meerwaarde is voor elke club en elke golfer.
        </p>

        <div className="hero-quote">
          <p>"A great network to play." Dat is de belofte van Golf Media, en op het terrein houden ze die belofte ook echt waar.</p>
        </div>

        <h2>De Golf Kiosk: praktisch, mooi en gratis voor de club</h2>

        <p>
          Het kroonjuweel van Golf Media is de Golf Kiosk, een digitale informatiezuil die golfers meteen bij
          aankomst alle nuttige info geeft. Geen rondvragen meer aan het onthaal of zoeken naar een papiertje
          met de wedstrijdkalender: alles staat overzichtelijk op een touchscreen.
        </p>

        <div className="feature-grid">
          <div className="feature-card">
            <span className="icon-tag">Baaninfo</span>
            <h3>Status van de baan</h3>
            <p>In één oogopslag zien of de baan open is, of er beperkingen zijn, en wat de actuele weersomstandigheden zijn.</p>
          </div>
          <div className="feature-card">
            <span className="icon-tag">Agenda</span>
            <h3>Wedstrijdkalender</h3>
            <p>Altijd up-to-date overzicht van competities en evenementen, zodat niemand nog iets mist.</p>
          </div>
          <div className="feature-card">
            <span className="icon-tag">Tools</span>
            <h3>Stroke calculator & BEgolf</h3>
            <p>Een digitale stroke calculator en directe link naar BEgolf, handig voor wie z'n handicap of inschrijvingen wil checken.</p>
          </div>
          <div className="feature-card">
            <span className="icon-tag">Sociaal</span>
            <h3>Social media feeds</h3>
            <p>De laatste posts en sfeerbeelden van de club, mooi geïntegreerd in het scherm.</p>
          </div>
        </div>

        <p>
          Het mooiste van dit verhaal: de Golf Kiosk wordt volledig gratis aangeboden aan de club. Clubs krijgen
          een professioneel, modern communicatiemiddel zonder dat het hen iets kost, en met software die ze zelf
          met één klik kunnen updaten via een bibliotheek vol stijlvolle templates.
        </p>

        <h2>Een netwerk dat groeit, in de mooiste clubs van het land</h2>

        <p>
          Golf Media is intussen aanwezig in meer dan dertig exclusieve golfclubs in België, van Golf de l'Empereur
          tot Royal Golf Club du Sart Tilman en Rigenée. Daarmee bouwen ze stap voor stap aan een netwerk dat
          golfers overal in het land hetzelfde niveau van comfort en informatie biedt.
        </p>

        <div className="stat-row">
          <div className="stat">
            <span className="num">45+</span>
            <span className="label">exclusieve golfclubs in België aangesloten</span>
          </div>
          <div className="stat">
            <span className="num">50+</span>
            <span className="label">schermen, inclusief het eerste outdoor scherm</span>
          </div>
          <div className="stat">
            <span className="num">100K+</span>
            <span className="label">impressies per week op het netwerk</span>
          </div>
        </div>

        <h2>Vertrouwd door grote merken, gebouwd voor de golfer</h2>

        <p>
          Dat dit concept werkt, bewijzen de merken die met Golf Media samenwerken. Internationale namen zien de
          waarde van een select, betrokken golfpubliek in een omgeving waar rust en kwaliteit centraal staan.
        </p>

        <div className="brand-strip">
          <div className="label">Onder andere te zien op het netwerk</div>
          <div className="brand-list">American Express · Breitling · Brussels Airlines · BMW · Hugo Boss · Club Med · ING · Garmin · Maserati</div>
        </div>

        <p>
          Voor de golfclubs zelf betekent dit ook iets: een netwerk dat gedragen wordt door A-merken, straalt
          kwaliteit uit en past naadloos bij de premium uitstraling die zij zelf willen bieden aan hun leden en gasten.
        </p>

        <h2>Waarom dit voor ons als PAMPAS klikt</h2>

        <p>
          Bij PAMPAS draait alles om de golfervaring beter, leuker en toegankelijker maken, op en naast de baan.
          Golf Media doet dat letterlijk op de baan: ze zorgen dat golfers op het juiste moment de juiste info
          krijgen, en dat clubs zonder extra werk een professionele uitstraling kunnen behouden. Het is dezelfde
          mentaliteit als waarmee wij elke aflevering en blogpost maken: nuttig, mooi vormgegeven, en met aandacht voor de golfer.
        </p>

        <div className="closing">
          <p>Dankjewel aan Golf Media om PAMPAS te steunen. We zijn fier op deze samenwerking.</p>
          <a href="https://www.golfmedia.be" target="_blank" rel="noreferrer">Ontdek Golf Media</a>
        </div>

        <div className="meta-footer">PAMPAS · indepampas.be</div>

        {(prev || next) && (
          <nav className="prevnext">
            {prev ? (
              <Link to="/blog/$slug" params={{ slug: prev.slug }}>
                <span className="pn-label">Vorige</span>
                <span className="pn-title">{prev.title}</span>
              </Link>
            ) : <span />}
            {next && (
              <Link to="/blog/$slug" params={{ slug: next.slug }} style={{ textAlign: "right" }}>
                <span className="pn-label">Volgende</span>
                <span className="pn-title">{next.title}</span>
              </Link>
            )}
          </nav>
        )}
      </div>
    </article>
  );
}
