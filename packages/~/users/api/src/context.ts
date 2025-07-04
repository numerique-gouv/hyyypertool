//

import {
  Pagination_Schema,
  Search_Schema,
  type Pagination,
} from "@~/app.core/schema";
import type { App_Context } from "@~/app.middleware/context";
import type { urls } from "@~/app.urls";
import {
  schema,
  type IdentiteProconnect_PgDatabase,
} from "@~/identite-proconnect.database";
import { desc, count as drizzle_count, ilike, or } from "drizzle-orm";
import type { Env, InferRequestType } from "hono";
import { useRequestContext } from "hono/jsx-renderer";

//

export interface ContextVariablesType extends Env {
  Variables: {
    query_users: typeof get_users_list;
  };
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

export function get_users_list(
  pg: IdentiteProconnect_PgDatabase,
  {
    pagination = { page: 0, page_size: 10 },
    search,
  }: {
    search?: string;
    pagination?: Pagination;
  },
) {
  const { page, page_size: take } = pagination;

  const where = or(
    ilike(schema.users.family_name, `%${search ?? ""}%`),
    ilike(schema.users.given_name, `%${search ?? ""}%`),
    ilike(schema.users.email, `%${search ?? ""}%`),
  );
  return pg.transaction(async function users_with_count(tx) {
    const users = await tx
      .select({
        id: schema.users.id,
        email: schema.users.email,
        created_at: schema.users.created_at,
        family_name: schema.users.family_name,
        given_name: schema.users.given_name,
        email_verified_at: schema.users.email_verified_at,
        last_sign_in_at: schema.users.last_sign_in_at,
      })
      .from(schema.users)
      .where(where)
      .orderBy(desc(schema.users.created_at))
      .limit(take)
      .offset(page * take);

    const [{ value: count }] = await tx
      .select({ value: drizzle_count() })
      .from(schema.users)
      .where(where);
    return { users, count };
  });
}
export type get_users_list_dto = Awaited<ReturnType<typeof get_users_list>>;
