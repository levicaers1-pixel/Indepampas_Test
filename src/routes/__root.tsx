import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { NewHeader } from "@/components/rebrand/NewHeader";
import { NewFooter } from "@/components/rebrand/NewFooter";
import { SponsorsBanner } from "@/components/SponsorsBanner";
import { EmailPopup } from "@/components/EmailPopup";

import appCss from "../styles.css?url";

import { SITE_URL } from "@/lib/site";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-serif text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-serif italic text-foreground">Out of bounds</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Deze pagina ligt ergens diep in de rough. Loop terug naar de fairway.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Terug naar de tee
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "PAMPAS Podcast" },
      { name: "theme-color", content: "#0c1a12" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "PAMPAS Podcast" },
      { property: "og:locale", content: "nl_BE" },
      { name: "twitter:card", content: "summary_large_image" },
      // Default social card (1200x630, self-hosted); pages with their own image override these.
      { property: "og:image", content: `${SITE_URL}/og-default.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "PAMPAS — de Belgische golfpodcast" },
      { name: "twitter:image", content: `${SITE_URL}/og-default.jpg` },
      { name: "google-site-verification", content: "9eeBZdMt11552ANhBkJgtZSXNRyZPsHKBTjtA7W9u38" },
      { name: "google-site-verification", content: "6BWBbJMruLd9lG0hxGrFUS60hrEEO_AtgX6YWUF28tg" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              name: "PAMPAS Podcast",
              url: SITE_URL,
              logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.png`, width: 256, height: 256 },
              sameAs: [
                "https://open.spotify.com/show/37wE4nKPeQNjYLYoMFelLP",
                "https://www.instagram.com/pampas.golfpodcast",
              ],
            },
            {
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              name: "PAMPAS — de Belgische golfpodcast",
              url: SITE_URL,
              inLanguage: "nl-BE",
              publisher: { "@id": `${SITE_URL}/#organization` },
            },
          ],
        }),
      },
    ],
    links: [
      { rel: "preload", as: "font", type: "font/woff2", href: "/fonts/archivo-latin.woff2", crossOrigin: "anonymous" },
      { rel: "preload", as: "font", type: "font/woff2", href: "/fonts/inter-latin.woff2", crossOrigin: "anonymous" },
      { rel: "preload", as: "font", type: "font/woff2", href: "/fonts/dm-mono-400-latin.woff2", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="theme-new min-h-screen flex flex-col">
      <NewHeader />
      <main className="flex-1 pt-[64px]">
        <Outlet />
      </main>
      <SponsorsBanner />
      <NewFooter />
      <EmailPopup />
    </div>
  );
}
