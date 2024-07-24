//

import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { eq } from "drizzle-orm";
import type { PgUpdateSetSource } from "drizzle-orm/pg-core";

//

export function update_domain_by_id(
  pg: MonComptePro_PgDatabase,
  id: number,
  values: PgUpdateSetSource<typeof schema.email_domains>,
) {
  return pg
    .update(schema.email_domains)
    .set({ ...values, updated_at: new Date().toISOString() })
    .where(eq(schema.email_domains.id, id));
}
