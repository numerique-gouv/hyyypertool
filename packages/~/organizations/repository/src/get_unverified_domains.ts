//

import type { Pagination } from "@~/app.core/schema";
import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import {
  and,
  asc,
  count as drizzle_count,
  eq,
  ilike,
  inArray,
  isNotNull,
  isNull,
  not,
  or,
} from "drizzle-orm";

//

const where_authorized_email_domains = and(
  isNull(schema.email_domains.verification_type),
)!;

// Inspired by https://github.com/numerique-gouv/moncomptepro/blob/f56812b300edcb6ef444ac07f91c1e8dbf411967/src/services/organization.ts#L9-L26
const where_unipersonnelle = and(
  isNotNull(schema.organizations.cached_libelle_categorie_juridique),
  inArray(schema.organizations.cached_libelle_categorie_juridique, [
    "Entrepreneur individuel",
    "SAS, société par actions simplifiée",
    "Société à responsabilité limitée (sans autre indication)",
  ]),
  or(
    isNull(schema.organizations.cached_tranche_effectifs),
    inArray(schema.organizations.cached_tranche_effectifs, ["NN", "00", "01"]),
  ),
)!;

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

  const where = and(
    search_where,
    where_authorized_email_domains,
    not(where_unipersonnelle),
  );

  return pg.transaction(async function moderation_count(tx) {
    const member_count = tx
      .select({
        count: drizzle_count(schema.users_organizations.user_id).as("count"),
        organization_id: schema.users_organizations.organization_id,
      })
      .from(schema.users_organizations)
      .groupBy(schema.users_organizations.organization_id)
      .as("member_count");

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
      .leftJoin(
        member_count,
        eq(schema.email_domains.organization_id, member_count.organization_id),
      )
      .where(where)
      .offset(page * take)
      .limit(take)
      .orderBy(
        asc(member_count.count),
        asc(schema.email_domains.domain),
        asc(schema.organizations.id),
      );

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
