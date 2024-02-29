//

import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { asc, desc, eq } from "drizzle-orm";

//

export function get_moderations_by_user_id(
  pg: MonComptePro_PgDatabase,
  {
    user_id,
  }: {
    user_id: number;
  },
) {
  return pg.query.moderations.findMany({
    orderBy: [
      asc(schema.moderations.moderated_at),
      desc(schema.moderations.created_at),
    ],
    where: eq(schema.moderations.user_id, user_id),
  });
}
