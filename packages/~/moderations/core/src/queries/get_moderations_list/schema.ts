//

import { schema as Type_Schema } from "#src/entities/Type";
import { Entity_Schema } from "@~/app.core/schema";
import { z } from "zod";

//

export const z_search_params = z.object({
  created_at: z.date().optional(),
  email: z.string().default(""),
  hide_join_organization: z.boolean().default(false),
  hide_non_verified_domain: z.boolean().default(false),
  show_archived: z.boolean().default(false),
  siret: z.string().default(""),
});

export type SearchParams = z.infer<typeof z_search_params>;

//

export const z_moderation = Entity_Schema.extend({
  created_at: z.string(),
  moderated_at: z.string().nullable(),
  organization: z.object({ siret: z.string() }),
  type: Type_Schema,
  user: z.object({
    email: z.string(),
    family_name: z.string().nullable(),
    given_name: z.string().nullable(),
  }),
});

export type Moderation = z.infer<typeof z_moderation>;
