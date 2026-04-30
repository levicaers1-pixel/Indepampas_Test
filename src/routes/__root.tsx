import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { VersionProvider, useVersion } from "@/components/VersionToggle";
import ogImage from "@/assets/hosts-walking.jpg";

import appCss from "../styles.css?url";

const NewHeader = lazy(() => import("@/components/rebrand/NewHeader").then((m) => ({ default: m.NewHeader })));
const Ticker = lazy(() => import("@/components/rebrand/NewHeader").then((m) => ({ default: m.Ticker })));
const NewFooter = lazy(() => import("@/components/rebrand/NewFooter").then((m) => ({ default: m.NewFooter })));

const SITE_URL = "https://indepampas.be";

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
      { name: "theme-color", content: "#1a1a1a" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "PAMPAS Podcast" },
      { property: "og:locale", content: "nl_BE" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
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
    <VersionProvider>
      <ShellSwitcher />
    </VersionProvider>
  );
}

function ShellSwitcher() {
  const { version } = useVersion();

  if (version === "new") {
    return (
      <div className="theme-new min-h-screen flex flex-col">
        <Suspense fallback={null}>
          <NewHeader />
          <Ticker />
        </Suspense>
        <main className="flex-1 pt-[92px]">
          <Outlet />
        </main>
        <Suspense fallback={null}>
          <NewFooter />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
