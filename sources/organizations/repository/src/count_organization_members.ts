//

import {
  schema,
  type IdentiteProconnect_PgDatabase,
} from "@~/identite-proconnect.database";
import { count as drizzle_count, eq } from "drizzle-orm";

//

export async function count_organization_members(
  pg: IdentiteProconnect_PgDatabase,
  { organization_id }: { organization_id: number },
) {
  const [{ value: count }] = await pg
    .select({ value: drizzle_count() })
    .from(schema.users_organizations)
    .where(eq(schema.users_organizations.organization_id, organization_id));

  return count;
}

export type count_organization_members_dto = Awaited<
  ReturnType<typeof count_organization_members>
>;
