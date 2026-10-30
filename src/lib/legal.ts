/**
 * Facts shown on /privacy and /disclaimer. Edit here, nowhere else.
 * The optional fields stay hidden until they are filled in.
 */
export const LEGAL_CONTACT_EMAIL = "pampas.podcast@gmail.com";

/** Date of the last substantive change to the texts. */
export const LEGAL_UPDATED = "30 oktober 2026";

export const LEGAL_CONTROLLER = {
  name: "PAMPAS Podcast",
  /** Legal form, e.g. "VOF" or "eenmanszaak van …". Leave empty if there is none. */
  form: "",
  /** Full names of the private persons behind the site. Leave empty until known. */
  people: [] as string[],
  /** Ondernemingsnummer (KBO), e.g. "BE 0123.456.789". Leave empty if there is none. */
  companyNumber: "",
  /** Postal address. Leave empty if there is none. */
  address: "",
};

export const GBA = {
  name: "Gegevensbeschermingsautoriteit",
  address: "Drukpersstraat 35, 1000 Brussel",
  email: "contact@apd-gba.be",
  url: "https://www.gegevensbeschermingsautoriteit.be",
};
