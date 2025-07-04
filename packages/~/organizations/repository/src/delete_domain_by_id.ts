//

import {
  schema,
  type IdentiteProconnect_PgDatabase,
} from "@~/identite-proconnect.database";
import { eq } from "drizzle-orm";

//

export function delete_domain_by_id(
  pg: IdentiteProconnect_PgDatabase,
  id: number,
) {
  return pg.delete(schema.email_domains).where(eq(schema.email_domains.id, id));
}
