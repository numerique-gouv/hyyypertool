//

import { z } from "zod";

//

export const Id_Schema = z.string().pipe(z.coerce.number());
export const Entity_Schema = z.object({
  id: Id_Schema,
});

export const Pagination_Schema = z.object({
  page: z.string().pipe(z.coerce.number()).default("0"),
});
