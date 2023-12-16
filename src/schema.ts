//

import { z } from "zod";

//

export const Id_Schema = z.object({
  id: z.string().pipe(z.coerce.number()),
});

export const Pagination_Schema = z.object({
  page: z.string().pipe(z.coerce.number()).default("0"),
});
