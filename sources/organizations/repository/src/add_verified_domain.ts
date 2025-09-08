//

import {
  schema,
  type IdentiteProconnect_PgDatabase,
} from "@~/identite-proconnect.database";
import type { MCP_EmailDomain_Type } from "@~/identite-proconnect.lib/types";
import { eq } from "drizzle-orm";

//

export function add_verified_domain(
  pg: IdentiteProconnect_PgDatabase,
  { id }: { id: number; domain: string },
) {
  return pg
    .update(schema.email_domains)
    .set({
      verification_type: "verified" as MCP_EmailDomain_Type,
      verified_at: new Date().toISOString(),
    })
    .where(eq(schema.organizations.id, id));
}
