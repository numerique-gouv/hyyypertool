//

import { schema } from ":database:moncomptepro";
import {
  and,
  asc,
  count as drizzle_count,
  eq,
  ilike,
  isNotNull,
  isNull,
} from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

//

export function get_moderations_list(
  pg: NodePgDatabase<typeof schema>,
  {
    search,
    pagination = { page: 0, take: 10 },
  }: {
    search: { siret?: string; email?: string; show_archived?: boolean };
    pagination?: { page: number; take: number };
  },
) {
  const { page, take } = pagination;
  const { email, siret, show_archived } = search;

  const where = and(
    ilike(schema.organizations.siret, `%${siret ?? ""}%`),
    ilike(schema.users.email, `%${email ?? ""}%`),
    show_archived
      ? isNotNull(schema.moderations.moderated_at)
      : isNull(schema.moderations.moderated_at),
  );

  return pg.transaction(async function moderation_count() {
    const moderations = await pg
      .select()
      .from(schema.moderations)
      .innerJoin(schema.users, eq(schema.moderations.user_id, schema.users.id))
      .innerJoin(
        schema.organizations,
        eq(schema.moderations.organization_id, schema.organizations.id),
      )
      .where(where)
      .orderBy(asc(schema.moderations.created_at))
      .limit(take)
      .offset(page * take);
    const [{ value: count }] = await pg
      .select({ value: drizzle_count() })
      .from(schema.moderations)
      .innerJoin(schema.users, eq(schema.moderations.user_id, schema.users.id))
      .innerJoin(
        schema.organizations,
        eq(schema.moderations.organization_id, schema.organizations.id),
      )
      .where(where);
    return { moderations, count };
  });
}
