import { createFileRoute } from "@tanstack/react-router";
import { NewContact } from "@/components/rebrand/NewContact";

const SITE_URL = "https://indepampas.be";
const CONTACT_DESCRIPTION =
  "Neem contact op met de PAMPAS podcast. Voor sponsoring, samenwerkingen of een goed verhaal van op de baan.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Sponsors — PAMPAS Podcast" },
      { name: "description", content: CONTACT_DESCRIPTION },
      { property: "og:title", content: "Contact & Sponsors — PAMPAS Podcast" },
      { property: "og:description", content: CONTACT_DESCRIPTION },
      { property: "og:url", content: SITE_URL + "/contact" },
      { name: "twitter:title", content: "Contact & Sponsors — PAMPAS Podcast" },
      { name: "twitter:description", content: CONTACT_DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/contact" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact — PAMPAS Podcast",
          description: CONTACT_DESCRIPTION,
          url: SITE_URL + "/contact",
          email: "pampas.podcast@gmail.com",
        }),
      },
    ],
  }),
  component: NewContact,
});
