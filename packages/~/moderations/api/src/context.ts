//

import { Pagination_Schema, type Pagination } from "@~/app.core/schema";
import { z_coerce_boolean } from "@~/app.core/schema/z.coerce.boolean";
import type { get_moderations_list } from "@~/moderations.repository/get_moderations_list";
import { createContext } from "hono/jsx";
import { z } from "zod";

//

export const MODERATION_TABLE_ID = "moderation_table";
export const MODERATION_TABLE_PAGE_ID = "moderation_table_page";

export const Search_Schema = z.object({
  search_siret: z.string().default(""),
  search_email: z.string().default(""),
  processed_requests: z.string().pipe(z_coerce_boolean).default(""),
  hide_non_verified_domain: z.string().pipe(z_coerce_boolean).default(""),
  hide_join_organization: z.string().pipe(z_coerce_boolean).default(""),
});
export const Page_Query = Search_Schema.merge(Pagination_Schema).partial();
export type Search = z.infer<typeof Search_Schema>;

//

export default createContext({
  query_moderations_list: {} as Promise<
    Awaited<ReturnType<typeof get_moderations_list>>
  >,
  pagination: {} as Pagination,
});
