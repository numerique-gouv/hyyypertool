//

import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { eq } from "drizzle-orm";

//

export function delete_domain_by_id(pg: MonComptePro_PgDatabase, id: number) {
  return pg.delete(schema.email_domains).where(eq(schema.email_domains.id, id));
}
