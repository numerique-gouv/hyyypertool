//

import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { EmailDomain_Type_Schema } from "@~/moncomptepro.lib/email_domain";

//

export function add_authorized_domain(
  pg: MonComptePro_PgDatabase,
  { organization_id, domain }: { organization_id: number; domain: string },
) {
  return pg.insert(schema.email_domains).values({
    domain,
    organization_id,
    verification_type: EmailDomain_Type_Schema.unwrap().enum.verified,
  });
}
