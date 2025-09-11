//

import {
  Pagination_Schema,
  Search_Schema,
  type Pagination,
} from "@~/app.core/schema";
import type { App_Context } from "@~/app.middleware/context";
import type { urls } from "@~/app.urls";
import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect.database";
import { GetUsersList } from "@~/users.repository";
import type { Env, InferRequestType } from "hono";
import { useRequestContext } from "hono/jsx-renderer";

//

export async function loadUsersListPageVariables(
  pg: IdentiteProconnect_PgDatabase,
) {
  return {
    query_users: GetUsersList(pg),
  };
}

//

export interface ContextVariablesType extends Env {
  Variables: Awaited<ReturnType<typeof loadUsersListPageVariables>>;
}
export type ContextType = App_Context & ContextVariablesType;

//

export const PageInput_Schema = Pagination_Schema.merge(Search_Schema);

type PageInputType = {
  out: InferRequestType<typeof urls.users.$get>;
};
export const usePageRequestContext = useRequestContext<
  ContextType,
  any,
  PageInputType
>;

//
//
//

