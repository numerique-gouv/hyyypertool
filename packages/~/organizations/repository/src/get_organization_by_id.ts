//

import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { eq } from "drizzle-orm";

//

export async function get_organization_by_id(
  pg: MonComptePro_PgDatabase,
  { id }: { id: number },
) {
  return pg.query.organizations.findFirst({
    where: eq(schema.organizations.id, id),
  });
}

export type get_organization_by_id_dto = Awaited<
  ReturnType<typeof get_organization_by_id>
>;
