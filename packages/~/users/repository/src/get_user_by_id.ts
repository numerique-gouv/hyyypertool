//

import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { eq } from "drizzle-orm";

//

export async function get_user_by_id(
  pg: MonComptePro_PgDatabase,
  { user_id }: { user_id: number },
) {
  return pg.query.users.findFirst({
    where: eq(schema.users.id, user_id),
  });
}
