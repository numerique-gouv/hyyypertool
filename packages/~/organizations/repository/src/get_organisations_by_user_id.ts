//

import { type Pagination } from "@~/app.core/schema";
import type { MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { schema } from "@~/moncomptepro.database";
import { and, asc, count as drizzle_count, eq } from "drizzle-orm";

//

export function get_organisations_by_user_id(
  pg: MonComptePro_PgDatabase,
  {
    user_id,
    pagination = { page: 0, page_size: 10 },
  }: { user_id: number; pagination?: Pagination },
) {
  const { page, page_size: take } = pagination;

  const where = and(eq(schema.users_organizations.user_id, user_id));

  return pg.transaction(async function organization_with_count() {
    const organizations = await pg
      .select()
      .from(schema.organizations)
      .innerJoin(
        schema.users_organizations,
        eq(schema.organizations.id, schema.users_organizations.organization_id),
      )
      .where(where)
      .orderBy(asc(schema.users_organizations.created_at))
      .limit(take)
      .offset(page * take);
    const [{ value: count }] = await pg
      .select({ value: drizzle_count() })
      .from(schema.organizations)
      .innerJoin(
        schema.users_organizations,
        eq(schema.organizations.id, schema.users_organizations.user_id),
      )
      .where(where);
    return { organizations, count };
  });
}

export type get_organisations_by_user_id_dto = ReturnType<
  typeof get_organisations_by_user_id
>;
