//

import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { and, desc, count as drizzle_count, ilike } from "drizzle-orm";
import { createContext } from "hono/jsx";

//

export function get_users_list(
  pg: MonComptePro_PgDatabase,
  {
    search,
    pagination = { page: 0, take: 10 },
  }: {
    search: {
      email?: string;
    };
    pagination?: { page: number; take: number };
  },
) {
  const { page, take } = pagination;
  const { email } = search;

  const where = and(ilike(schema.users.email, `%${email ?? ""}%`));

  return pg.transaction(async function users_with_count() {
    const users = await pg
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
    const [{ value: count }] = await pg
      .select({ value: drizzle_count() })
      .from(schema.users)
      .where(where);
    return { users, count };
  });
}
export type get_users_list_dto = Awaited<ReturnType<typeof get_users_list>>;

export const Table_Context = createContext({
  page: 0,
  take: 10,
  count: 0,
});
