import { createMiddleware, createStart } from "@tanstack/react-start";

/**
 * Security headers on every response the app itself serves (pages, server
 * functions, sitemap). Static assets are served by Cloudflare directly and are
 * configured in public/_headers; HSTS, nosniff and Referrer-Policy are already
 * added by the hosting platform.
 *
 * - Permissions-Policy: switch off browser features the site never uses.
 * - Framing: only the production hostnames refuse to be embedded by other
 *   sites. Preview and dev hosts (e.g. an editor preview) stay embeddable.
 */
const PRODUCTION_HOST = /(^|\.)indepampas\.be$/;

const securityHeaders = createMiddleware().server(async ({ next, request }) => {
  const result = await next();

  // Copy the response so its headers are mutable (redirects and fetched
  // responses can have immutable headers).
  const response = new Response(result.response.body, result.response);
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");

  if (PRODUCTION_HOST.test(new URL(request.url).hostname)) {
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    response.headers.set("Content-Security-Policy", "frame-ancestors 'self'");
  }

  return response;
});

export const startInstance = createStart(() => ({
  requestMiddleware: [securityHeaders],
}));
