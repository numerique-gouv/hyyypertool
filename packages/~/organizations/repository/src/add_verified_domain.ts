//

import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { eq, sql } from "drizzle-orm";

//

export function add_verified_domain(
  pg: MonComptePro_PgDatabase,
  { id, domain }: { id: number; domain: string },
) {
  return pg
    .update(schema.organizations)
    .set({
      verified_email_domains: sql`array_append(verified_email_domains , ${domain})`,
      updated_at: new Date().toISOString(),
    })
    .where(eq(schema.organizations.id, id));
}
