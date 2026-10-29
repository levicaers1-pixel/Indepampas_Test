import { ratingsSearchSchema } from "@/routes/ratings.index";
import { zodValidator } from "@tanstack/zod-adapter";

const adapted = zodValidator(ratingsSearchSchema);
type A = typeof adapted;
type Out = A extends { types: { output: infer O } } ? O : "NO-TYPES-PROP";
type Std = A extends { "~standard": { types?: { output: infer S } } } ? S : "NO-STANDARD";
const c: 3 = null as unknown as Out;
const d: 4 = null as unknown as Std;
export { c, d, adapted };
