//

import { schema, type PgCradle } from "@~/moncomptepro.database";
import { count as drizzle_count, eq } from "drizzle-orm";

//

export function GetOrganizationMembersCount({ pg }: PgCradle) {
  return async function get_organization_members_count({
    organization_id,
  }: {
    organization_id: number;
  }) {
    const [{ value: count }] = await pg
      .select({ value: drizzle_count() })
      .from(schema.users_organizations)
      .where(eq(schema.users_organizations.organization_id, organization_id));

    return count;
  };
}

export type GetOrganizationMembersCount = ReturnType<
  typeof GetOrganizationMembersCount
>;
