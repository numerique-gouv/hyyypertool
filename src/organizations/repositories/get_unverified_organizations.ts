//

import { schema } from "@~/moncomptepro.database";
import {
  and,
  asc,
  count as drizzle_count,
  eq,
  ilike,
  isNotNull,
  isNull,
  not,
} from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

//

export function get_unverified_organizations(
  pg: NodePgDatabase<typeof schema>,
  {
    search,
    pagination = { page: 0, take: 10 },
  }: {
    search: {
      email?: string;
      hide_join_organization?: boolean;
      hide_non_verified_domain?: boolean;
      show_archived?: boolean;
      siret?: string;
    };
    pagination?: { page: number; take: number };
  },
) {
  const { page, take } = pagination;
  const {
    email,
    hide_join_organization,
    hide_non_verified_domain,
    show_archived,
    siret,
  } = search;

  const where = and(
    ilike(schema.organizations.siret, `%${siret ?? ""}%`),
    ilike(schema.users.email, `%${email ?? ""}%`),
    show_archived
      ? isNotNull(schema.moderations.moderated_at)
      : isNull(schema.moderations.moderated_at),
    hide_non_verified_domain
      ? not(eq(schema.moderations.type, "non_verified_domain"))
      : undefined,
    hide_join_organization
      ? not(eq(schema.moderations.type, "organization_join_block"))
      : undefined,
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
