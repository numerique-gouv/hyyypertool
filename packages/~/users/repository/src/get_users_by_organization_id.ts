//

import type { Pagination } from "@~/app.core/schema";
import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { and, desc, count as drizzle_count, eq } from "drizzle-orm";

//

export async function get_users_by_organization_id(
  pg: MonComptePro_PgDatabase,
  {
    organization_id,
    pagination = { page: 0, page_size: 10 },
  }: { organization_id: number; pagination?: Pagination },
) {
  const { page, page_size: take } = pagination;

  const where = and(
    eq(schema.users_organizations.organization_id, organization_id),
  );

  const { users, count } = await pg.transaction(async () => {
    const users = await pg
      .select()
      .from(schema.users)
      .innerJoin(
        schema.users_organizations,
        eq(schema.users.id, schema.users_organizations.user_id),
      )
      .where(where)
      .orderBy(desc(schema.users.created_at))
      .limit(take)
      .offset(page * take);
    const [{ value: count }] = await pg
      .select({ value: drizzle_count() })
      .from(schema.users)
      .innerJoin(
        schema.users_organizations,
        eq(schema.users.id, schema.users_organizations.user_id),
      )
      .where(where);

    return { users, count };
  });

  const users_with_external = users.map((user) => ({
    ...user.users,
    is_external: user.users_organizations.is_external,
    verification_type: user.users_organizations.verification_type,
  }));

  return { users: users_with_external, count };
}

export type get_user_by_id_dto = ReturnType<
  typeof get_users_by_organization_id
>;
