export function renderErrorPage() {
  return `<!doctype html>
<html lang="nl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>PAMPAS — tijdelijk niet beschikbaar</title>
    <style>
      :root { color-scheme: light; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
        background: #f4efe5;
        color: #1c3d2a;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      main { max-width: 520px; text-align: center; }
      p:first-child {
        margin: 0 0 12px;
        color: #3d7a52;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: .18em;
        text-transform: uppercase;
      }
      h1 {
        margin: 0;
        font-family: Georgia, "Times New Roman", serif;
        font-size: clamp(34px, 8vw, 64px);
        font-weight: 500;
        line-height: .95;
      }
      p { color: #635c4b; line-height: 1.6; }
      nav { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; margin-top: 28px; }
      a, button {
        appearance: none;
        border: 1px solid rgba(28,61,42,.22);
        background: #1c3d2a;
        color: #f4efe5;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 44px;
        padding: 0 18px;
        text-decoration: none;
        font: inherit;
      }
      a.secondary { background: transparent; color: #1c3d2a; }
    </style>
  </head>
  <body>
    <main>
      <p>Serverfout</p>
      <h1>Even in de rough.</h1>
      <p>Er ging iets mis bij het laden van de website. Probeer opnieuw of keer terug naar de homepage.</p>
      <nav>
        <button onclick="window.location.reload()">Opnieuw proberen</button>
        <a class="secondary" href="/">Naar homepage</a>
      </nav>
    </main>
  </body>
</html>`;
}