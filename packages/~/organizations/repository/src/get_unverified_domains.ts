//

import type { Pagination } from "@~/app.core/schema";
import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import {
  and,
  asc,
  count as drizzle_count,
  eq,
  ilike,
  isNull,
  or,
} from "drizzle-orm";

//

const where_authorized_email_domains = and(
  isNull(schema.email_domains.verification_type),
);
export async function get_unverified_domains(
  pg: MonComptePro_PgDatabase,
  {
    pagination = { page: 0, page_size: 10 },
    search,
  }: { pagination?: Pagination; search?: string },
) {
  const { page, page_size: take } = pagination;
  const search_where = search
    ? or(
        ilike(schema.email_domains.domain, `%${search}%`),
        ilike(schema.organizations.cached_libelle, `%${search}%`),
        ilike(schema.organizations.siret, `%${search}%`),
      )
    : undefined;

  const where = and(search_where, where_authorized_email_domains);

  return pg.transaction(async function moderation_count(tx) {
    const domains = await tx
      .select({
        domain: schema.email_domains.domain,
        id: schema.email_domains.id,
        organization: {
          cached_libelle: schema.organizations.cached_libelle,
          created_at: schema.organizations.created_at,
          id: schema.organizations.id,
          siret: schema.organizations.siret,
        },
      })
      .from(schema.email_domains)
      .innerJoin(
        schema.organizations,
        eq(schema.email_domains.organization_id, schema.organizations.id),
      )
      .where(where)
      .offset(page * take)
      .limit(take)
      .orderBy(asc(schema.email_domains.domain), asc(schema.organizations.id));

    const [{ value: count }] = await tx
      .select({ value: drizzle_count() })
      .from(schema.email_domains)
      .innerJoin(
        schema.organizations,
        eq(schema.email_domains.organization_id, schema.organizations.id),
      )
      .where(where);
    return { domains, count };
  });
}

export type get_unverified_domains_dto = Awaited<
  ReturnType<typeof get_unverified_domains>
>;
