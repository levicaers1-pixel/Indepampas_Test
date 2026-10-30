import { z } from "zod";

export const ratingsSearchSchema = z.object({
  q: z.string().default("").catch(""),
  region: z.string().default("").catch(""),
  country: z.string().default("").catch(""),
  type: z.string().default("").catch(""),
  fee: z.string().default("").catch(""),
  hosts: z.string().default("").catch(""), // comma-separated
  sort: z.string().default("pampas_desc").catch("pampas_desc"),
  tab: z.string().default("courses").catch("courses"),
});

export type RatingsSearch = z.output<typeof ratingsSearchSchema>;

export const ratingsSearchDefaults: RatingsSearch = {
  q: "",
  region: "",
  country: "",
  type: "",
  fee: "",
  hosts: "",
  sort: "pampas_desc",
  tab: "courses",
};
