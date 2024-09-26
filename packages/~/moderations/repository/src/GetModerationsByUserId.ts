//

import {
  schema,
  type MonCompteProDatabaseCradle,
} from "@~/moncomptepro.database";
import { asc, desc, eq } from "drizzle-orm";

//

export function GetModerationsByUserId({ pg }: MonCompteProDatabaseCradle) {
  return async function get_moderations_by_user_id(user_id: number) {
    return pg.query.moderations.findMany({
      orderBy: [
        asc(schema.moderations.moderated_at),
        desc(schema.moderations.created_at),
      ],
      where: eq(schema.moderations.user_id, user_id),
    });
  };
}

//

export type GetModerationsByUserIdHandler = ReturnType<
  typeof GetModerationsByUserId
>;
