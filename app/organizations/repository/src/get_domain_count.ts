//

import {
  schema,
  type IdentiteProconnect_PgDatabase,
} from "@~/identite-proconnect.database";
import { count as drizzle_count, eq } from "drizzle-orm";

//

export async function get_domain_count(
  pg: IdentiteProconnect_PgDatabase,
  { organization_id }: { organization_id: number },
) {
  const [{ value: count }] = await pg
    .select({ value: drizzle_count() })
    .from(schema.email_domains)
    .innerJoin(
      schema.organizations,
      eq(schema.email_domains.organization_id, schema.organizations.id),
    )
    .where(eq(schema.organizations.id, organization_id));

  return count;
}

export type get_domain_count_dto = Awaited<ReturnType<typeof get_domain_count>>;
