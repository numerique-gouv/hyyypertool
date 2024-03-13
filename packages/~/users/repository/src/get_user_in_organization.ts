//

import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { and, eq } from "drizzle-orm";

//

export async function get_user_in_organization(
  pg: MonComptePro_PgDatabase,
  { organization_id, user_id }: { organization_id: number; user_id: number },
) {
  return pg.query.users_organizations.findFirst({
    where: and(
      eq(schema.users_organizations.organization_id, organization_id),
      eq(schema.users_organizations.user_id, user_id),
    ),
  });
}

export type get_user_in_organization_dto = ReturnType<
  typeof get_user_in_organization
>;
