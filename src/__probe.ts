import { ratingsSearchSchema } from "@/routes/ratings.index";
import { zodValidator } from "@tanstack/zod-adapter";

type SchemaOut = typeof ratingsSearchSchema["_output"];
type SchemaIn = typeof ratingsSearchSchema["_input"];

const a: 1 = null as unknown as SchemaOut;
const b: 2 = null as unknown as SchemaIn;

const adapted = zodValidator(ratingsSearchSchema);
type AdaptedOut = ReturnType<typeof adapted>;
const c: 3 = null as unknown as AdaptedOut;
export { a, b, c };
