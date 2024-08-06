//

import type { Pagination } from "@~/app.core/schema";
import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import {
  and,
  asc,
  count as drizzle_count,
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
    const domains = await tx.query.email_domains.findMany({
      columns: {
        domain: true,
        id: true,
        organization_id: true,
      },
      limit: take,
      offset: page * take,
      orderBy: asc(schema.email_domains.domain),
      where,
      with: {
        organization: {
          columns: {
            cached_libelle: true,
            created_at: true,
            id: true,
            siret: true,
          },
        },
      },
    });

    const [{ value: count }] = await tx
      .select({ value: drizzle_count() })
      .from(schema.email_domains)
      .where(where);
    return { domains, count };
  });
}

export type get_unverified_domains_dto = Awaited<
  ReturnType<typeof get_unverified_domains>
>;
