import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { recordPageview } from "@/lib/pageviews.functions";
import { PRODUCTION_HOST, countablePath } from "@/lib/pageviews";

/** The first count of a visit knows where the visitor came from; later ones are in-site navigation. */
let landed = false;

/**
 * Sends one anonymous count per page. The server decides what is counted; this only skips the
 * request on other hostnames, the admin area, unknown pages and automated browsers.
 */
export function PageviewTracker() {
  const pathname = useRouterState({
    select: (s) => (s.statusCode === 404 ? null : s.location.pathname),
  });

  useEffect(() => {
    if (!pathname || !PRODUCTION_HOST.test(window.location.hostname) || navigator.webdriver) return;
    if (!countablePath(pathname)) return;

    const input = landed
      ? { path: pathname, internal: true }
      : {
          path: pathname,
          referrer: document.referrer || undefined,
          utm: new URLSearchParams(window.location.search).get("utm_source") ?? undefined,
        };
    landed = true;
    recordPageview({ data: input }).catch(() => {});
  }, [pathname]);

  return null;
}
