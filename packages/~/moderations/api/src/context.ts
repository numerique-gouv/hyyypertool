//

import type { Pagination } from "@~/app.core/schema";
import { z_coerce_boolean } from "@~/app.core/schema/z.coerce.boolean";
import type { get_moderations_list } from "@~/moderations.repository/get_moderations_list";
import { createContext } from "hono/jsx";
import { z } from "zod";

//

export const MODERATION_TABLE_ID = "moderation_table";
export const MODERATION_TABLE_PAGE_ID = "moderation_table_page";
export const SEARCH_SIRET_INPUT_ID = "search_siret";
export const SEARCH_EMAIL_INPUT_ID = "search_email";
export const PROCESSED_REQUESTS_INPUT_ID = "processed_requests";
export const HIDE_NON_VERIFIED_DOMAIN_INPUT_ID = "hide_non_verified_domain";
export const HIDE_JOIN_ORGANIZATION_INPUT_ID = "hide_join_organization";

export const Search_Schema = z.object({
  [SEARCH_SIRET_INPUT_ID]: z.string().default(""),
  [SEARCH_EMAIL_INPUT_ID]: z.string().default(""),
  [PROCESSED_REQUESTS_INPUT_ID]: z.string().pipe(z_coerce_boolean).default(""),
  [HIDE_NON_VERIFIED_DOMAIN_INPUT_ID]: z
    .string()
    .pipe(z_coerce_boolean)
    .default(""),
  [HIDE_JOIN_ORGANIZATION_INPUT_ID]: z
    .string()
    .pipe(z_coerce_boolean)
    .default(""),
});
export type Search = z.infer<typeof Search_Schema>;

//

export default createContext({
  query_moderations_list: {} as Promise<
    Awaited<ReturnType<typeof get_moderations_list>>
  >,
  pagination: {} as Pagination,
});
