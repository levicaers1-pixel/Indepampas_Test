import { createServerFn } from "@tanstack/react-start";

export const getMapsBrowserKey = createServerFn({ method: "GET" }).handler(async () => {
  const key =
    process.env.GOOGLE_API_KEY ||
    process.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY ||
    "";
  return { key };
});
