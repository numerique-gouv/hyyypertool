//

import {
  schema,
  type IdentiteProconnect_PgDatabase,
} from "@~/identite-proconnect.database";
import { ilike, or } from "drizzle-orm";

//

export async function find_users_by_name(
  pg: IdentiteProconnect_PgDatabase,
  { name }: { name: string },
) {
  return pg.query.users.findMany({
    where: or(
      ilike(schema.users.given_name, name),
      ilike(schema.users.family_name, name),
    ),
  });
}

export type find_users_by_name_dto = ReturnType<typeof find_users_by_name>;
