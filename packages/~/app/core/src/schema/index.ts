//

import { z } from "zod";

//

export const Id_Schema = z.string().pipe(z.coerce.number());
export const Entity_Schema = z.object({
  id: Id_Schema,
});

//

export const Pagination_Schema = z.object({
  page: z
    .string()
    .pipe(z.coerce.number().transform((number) => Math.max(1, number)))
    .default("1"),
  page_size: z.string().pipe(z.coerce.number()).default("10"),
});
export type Pagination = z.infer<typeof Pagination_Schema>;

//

export const PAGINATION_ALL_PAGES: Readonly<Pagination> = {
  page: 0,
  page_size: 0,
};

//

export const Search_Schema = z.object({
  q: z.string().default(""),
});
export type Search = z.infer<typeof Search_Schema>;
//

export const DescribedBy_Schema = z.object({
  describedby: z.string(),
});
export type DescribedBy = z.infer<typeof DescribedBy_Schema>;
export const MfaAcrValue_Schema = z.enum([
  "eidas2",
  "eidas3",
  "https://proconnect.gouv.fr/assurance/self-asserted-2fa",
  "https://proconnect.gouv.fr/assurance/consistency-checked-2fa",
]);

export type MfaAcrValue = z.infer<typeof MfaAcrValue_Schema>;
