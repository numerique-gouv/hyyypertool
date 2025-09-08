//

import {
  schema,
  type IdentiteProconnect_PgDatabase,
} from "@~/identite-proconnect.database";
import { count as drizzle_count, eq } from "drizzle-orm";

//

export async function get_organization_members_count(
  pg: IdentiteProconnect_PgDatabase,
  { organization_id }: { organization_id: number },
) {
  const [{ value: count }] = await pg
    .select({ value: drizzle_count() })
    .from(schema.users_organizations)
    .where(eq(schema.users_organizations.organization_id, organization_id));

  return count;
}

export type get_organization_members_count_dto = Awaited<
  ReturnType<typeof get_organization_members_count>
>;
