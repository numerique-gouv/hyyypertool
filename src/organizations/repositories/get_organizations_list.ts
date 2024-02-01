//

import { schema } from ":database:moncomptepro";
import { and, desc, count as drizzle_count, ilike } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

//

export function get_organizations_list(
  pg: NodePgDatabase<typeof schema>,
  {
    search,
    pagination = { page: 0, take: 10 },
  }: {
    search: {
      siret?: string;
    };
    pagination?: { page: number; take: number };
  },
) {
  const { page, take } = pagination;
  const { siret } = search;

  const where = and(ilike(schema.organizations.siret, `%${siret ?? ""}%`));

  return pg.transaction(async function organization_with_count() {
    const organizations = await pg
      .select()
      .from(schema.organizations)
      .where(where)
      .orderBy(desc(schema.organizations.created_at))
      .limit(take)
      .offset(page * take);
    const [{ value: count }] = await pg
      .select({ value: drizzle_count() })
      .from(schema.organizations)
      .where(where);
    return { organizations, count };
  });
}

export type Organization_DTO = Awaited<
  ReturnType<typeof get_organizations_list>
>["organizations"][number];
