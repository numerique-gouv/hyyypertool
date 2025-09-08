//

import { type Pagination } from "@~/app.core/schema";
import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect.database";
import { schema } from "@~/identite-proconnect.database";
import type { MCP_EmailDomain_Type } from "@~/identite-proconnect.lib/types";
import { and, asc, count as drizzle_count, eq } from "drizzle-orm";

//

export function get_organizations_by_user_id(
  pg: IdentiteProconnect_PgDatabase,
  {
    user_id,
    pagination = { page: 0, page_size: 10 },
  }: { user_id: number; pagination?: Pagination },
) {
  const { page, page_size: take } = pagination;

  const where = and(eq(schema.users_organizations.user_id, user_id));

  return pg.transaction(async function organization_with_count(tx) {
    const users_organizations = await tx.query.users_organizations.findMany({
      columns: {
        verification_type: true,
      },
      limit: take,
      offset: page * take,
      orderBy: asc(schema.organizations.created_at),
      where,
      with: {
        organization: {
          columns: {
            cached_code_officiel_geographique: true,
            cached_libelle: true,
            created_at: true,
            id: true,
            siret: true,
          },
          with: {
            email_domains: {
              columns: { domain: true },
              where: eq(
                schema.email_domains.verification_type,
                "authorized" as MCP_EmailDomain_Type,
              ),
            },
          },
        },
      },
    });
    const organizations = users_organizations.map(
      ({ organization, verification_type }) => ({
        ...organization,
        verification_type,
      }),
    );
    const [{ value: count }] = await tx
      .select({ value: drizzle_count() })
      .from(schema.organizations)
      .innerJoin(
        schema.users_organizations,
        eq(schema.organizations.id, schema.users_organizations.organization_id),
      )
      .where(where);

    return { organizations, count };
  });
}

export type get_organizations_by_user_id_dto = ReturnType<
  typeof get_organizations_by_user_id
>;
