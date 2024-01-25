//

import { z } from "zod";

//

export const Id_Schema = z.string().pipe(z.coerce.number());
export const Entity_Schema = z.object({
  id: Id_Schema,
});

export const Pagination_Schema = z.object({
  page: z.string().pipe(z.coerce.number()).default("0"),
  page_size: z.string().pipe(z.coerce.number()).default("10"),
});
export type Pagination = z.infer<typeof Pagination_Schema>;
