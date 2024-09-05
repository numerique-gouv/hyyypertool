//

import { type Pagination } from "@~/app.core/schema";
import { z_coerce_boolean } from "@~/app.core/schema/z_coerce_boolean";
import { z_empty_string_to_undefined } from "@~/app.core/schema/z_empty_string_to_undefined";
import type { App_Context } from "@~/app.middleware/context";
import type { GetModerationsList } from "@~/moderations.core/queries/get_moderations_list/handler";
import type { Env } from "hono";
import { useRequestContext } from "hono/jsx-renderer";
import { z } from "zod";

//

export const MODERATION_TABLE_ID = "moderation_table";
export const MODERATION_TABLE_PAGE_ID = "moderation_table_page";

export const z_query = z.object({
  day: z
    .string()
    .default("")
    .pipe(z.coerce.date().or(z_empty_string_to_undefined)),
  siret: z.string().default(""),
  email: z.string().default(""),
  processed_requests: z.string().pipe(z_coerce_boolean).default("false"),
  hide_non_verified_domain: z.string().pipe(z_coerce_boolean).default("false"),
  hide_join_organization: z.string().pipe(z_coerce_boolean).default("false"),
});

//

interface GetModerationsListComand {
  get_moderations_list: GetModerationsList;
}
export type Commands = GetModerationsListComand;

//

export interface ViewModel {
  pagination: Pagination;
  search: z.infer<typeof z_query>;
  query_moderations_list: ReturnType<GetModerationsList>;
}

export interface ContextVariablesType extends Env {
  Variables: Commands & ViewModel;
}

export type ContextType = App_Context & ContextVariablesType;

//

export const usePageRequestContext = useRequestContext<ContextType>;
