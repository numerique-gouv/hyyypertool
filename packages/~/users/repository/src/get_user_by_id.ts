//

import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { eq } from "drizzle-orm";

//

export async function get_user_by_id(
  pg: MonComptePro_PgDatabase,
  { id }: { id: number },
) {
  return pg.query.users.findFirst({
    where: eq(schema.users.id, id),
  });
}

export type get_user_by_id_dto = ReturnType<typeof get_user_by_id>;
