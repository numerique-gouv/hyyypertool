//

import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { eq } from "drizzle-orm";

//

export async function get_emails_by_organization_id(
  pg: MonComptePro_PgDatabase,
  { organization_id }: { organization_id: number },
) {
  return pg
    .select({ email: schema.users.email })
    .from(schema.users)
    .innerJoin(
      schema.users_organizations,
      eq(schema.users.id, schema.users_organizations.user_id),
    )
    .where(eq(schema.users_organizations.organization_id, organization_id));
}

export type get_emails_by_organization_id_dto = ReturnType<
  typeof get_emails_by_organization_id
>;
