//

import {
  schema,
  type IdentiteProconnect_PgDatabase,
} from "@~/identite-proconnect.database";
import { eq } from "drizzle-orm";
import type { PgUpdateSetSource } from "drizzle-orm/pg-core";

//

export function update_domain_by_id(
  pg: IdentiteProconnect_PgDatabase,
  id: number,
  values: PgUpdateSetSource<typeof schema.email_domains>,
) {
  return pg
    .update(schema.email_domains)
    .set({ ...values, updated_at: new Date().toISOString() })
    .where(eq(schema.email_domains.id, id));
}
