//

import { Pagination_Schema, type Pagination } from "@~/app.core/schema";
import type { App_Context } from "@~/app.middleware/context";
import { z_coerce_boolean } from "@~/app.core/schema/z_coerce_boolean";
import { z_empty_string_to_undefined } from "@~/app.core/schema/z_empty_string_to_undefined";
import type { GetModerationsListHandler } from "@~/moderations.repository";
import { createContext } from "hono/jsx";
import type { Env } from "hono";
import { useRequestContext } from "hono/jsx-renderer";
import { z } from "zod";

//

export const MODERATION_TABLE_ID = "moderation_table";
export const MODERATION_TABLE_PAGE_ID = "moderation_table_page";

export const Search_Schema = z.object({
  day: z
    .string()
    .default("")
    .pipe(z.coerce.date().or(z_empty_string_to_undefined)),
  search_siret: z.string().default(""),
  search_email: z.string().default(""),
  processed_requests: z.string().pipe(z_coerce_boolean).default("false"),
  hide_non_verified_domain: z.string().pipe(z_coerce_boolean).default("false"),
  hide_join_organization: z.string().pipe(z_coerce_boolean).default("false"),
});
export const Page_Query = Search_Schema.merge(Pagination_Schema).partial();
export type Search = z.infer<typeof Search_Schema>;

//
export type GetModerationsListDTO = Awaited<
  ReturnType<GetModerationsListHandler>
>;

export async function loadModerationsListPageVariables(
  { pagination, search }: { pagination: Pagination; search: Search },
) {
  return {
    pagination,
    search,
  };
}

//

export interface ContextVariablesType extends Env {
  Variables: Awaited<ReturnType<typeof loadModerationsListPageVariables>>;
}
export type ContextType = App_Context & ContextVariablesType;

//

export const usePageRequestContext = useRequestContext<
  ContextType,
  any,
  any
>();

export default createContext({
  query_moderations_list: {} as Promise<GetModerationsListDTO>,
  pagination: {} as Pagination,
});
