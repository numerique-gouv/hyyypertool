//

import { NotFoundError } from "@~/app.core/error";
import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { eq } from "drizzle-orm";

//

export function GetOrganizationById({ pg }: { pg: MonComptePro_PgDatabase }) {
  type Organizations = typeof schema.organizations.$inferSelect;
  type OrganizationColumnsKeys = keyof Organizations;

  return async function get_organization_by_id<
    TColumns extends Partial<Record<OrganizationColumnsKeys, true>>,
  >(organization_id: number, { columns }: { columns: TColumns }) {
    const organization = await pg.query.organizations.findFirst({
      columns,
      where: eq(schema.organizations.id, organization_id),
    });

    if (!organization) throw new NotFoundError("Organization Not Found.");

    return organization;
  };
}

export type GetOrganizationByIdHandler = ReturnType<typeof GetOrganizationById>;
