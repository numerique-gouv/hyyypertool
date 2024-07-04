//

import type { Pagination } from "@~/app.core/schema";
import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import {
  and,
  desc,
  count as drizzle_count,
  eq,
  ilike,
  isNull,
  not,
  or,
  sql,
} from "drizzle-orm";

//

export async function get_unverified_organizations(
  pg: MonComptePro_PgDatabase,
  {
    pagination = { page: 0, page_size: 10 },
    search,
  }: { pagination?: Pagination; search?: string },
) {
  const { page, page_size: take } = pagination;
  const search_where = search
    ? or(
        ilike(schema.organizations.cached_libelle, `%${search}%`),
        ilike(schema.organizations.siret, `%${search}%`),
      )
    : undefined;
  const where_authorized_email_domains = and(
    not(
      sql`${schema.organizations.authorized_email_domains} <@ ${schema.organizations.verified_email_domains}`,
    ),
    not(
      sql`${schema.organizations.authorized_email_domains} <@ ${schema.organizations.trackdechets_email_domains}`,
    ),
  );
  const where = and(search_where, where_authorized_email_domains);

  return pg.transaction(async function moderation_count(tx) {
    const member_count_by_organization = tx
      .select({
        organization_id: schema.users_organizations.organization_id,
        member_count: drizzle_count(schema.users_organizations.user_id).as(
          "member_count",
        ),
      })
      .from(schema.users_organizations)
      .groupBy(schema.users_organizations.organization_id)
      .as("member_count_by_organization");

    const moderation_by_organization = tx
      .select({
        organization_id: schema.moderations.organization_id,
        moderation_count: drizzle_count(schema.moderations.user_id).as(
          "moderation_count",
        ),
      })
      .from(schema.moderations)
      .groupBy(schema.moderations.organization_id)
      .as("moderation_by_organization");

    const moderation_to_process_by_organization = tx
      .select({
        organization_id: schema.moderations.organization_id,
        moderation_to_process_count: drizzle_count(
          schema.moderations.user_id,
        ).as("moderation_to_process_count"),
      })
      .from(schema.moderations)
      .groupBy(schema.moderations.organization_id)
      .where(isNull(schema.moderations.moderated_at))
      .as("moderation_to_process_by_organization");

    const organizations = await tx
      .select({
        authorized_email_domains: schema.organizations.authorized_email_domains,
        cached_libelle: schema.organizations.cached_libelle,
        created_at: schema.organizations.created_at,
        id: schema.organizations.id,
        member_count: member_count_by_organization.member_count,
        moderation_count: moderation_by_organization.moderation_count,
        moderation_to_process_count:
          moderation_to_process_by_organization.moderation_to_process_count,
        siret: schema.organizations.siret,
        trackdechets_email_domains:
          schema.organizations.trackdechets_email_domains,
        verified_email_domains: schema.organizations.verified_email_domains,
      })
      .from(schema.organizations)
      .leftJoin(
        member_count_by_organization,
        eq(
          member_count_by_organization.organization_id,
          schema.organizations.id,
        ),
      )
      .leftJoin(
        moderation_by_organization,
        eq(moderation_by_organization.organization_id, schema.organizations.id),
      )
      .leftJoin(
        moderation_to_process_by_organization,
        eq(
          moderation_to_process_by_organization.organization_id,
          schema.organizations.id,
        ),
      )
      .groupBy(
        schema.organizations.id,
        member_count_by_organization.member_count,
        moderation_by_organization.moderation_count,
        moderation_to_process_by_organization.moderation_to_process_count,
      )
      .limit(take)
      .offset(page * take)
      .where(where)
      .orderBy(
        sql`${member_count_by_organization.member_count} DESC NULLS LAST`,
        desc(schema.organizations.created_at),
      );

    const [{ value: count }] = await tx
      .select({ value: drizzle_count() })
      .from(schema.organizations)
      .where(where);

    return { organizations, count };
  });
}

export type get_unverified_organizations_dto = Awaited<
  ReturnType<typeof get_unverified_organizations>
>;
