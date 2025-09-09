//

import { NotFoundError } from "@~/app.core/error";
import {
  schema,
  type IdentiteProconnect_PgDatabase,
} from "@~/identite-proconnect.database";
import { eq } from "drizzle-orm";

//

export function GetModeration(pg: IdentiteProconnect_PgDatabase) {
  return async function get_moderation(moderation_id: number) {
    const moderation = await pg.query.moderations.findFirst({
      columns: {
        id: true,
        comment: true,
        organization_id: true,
        user_id: true,
        ticket_id: true,
      },
      with: { user: { columns: { email: true } } },
      where: eq(schema.moderations.id, moderation_id),
    });

    if (!moderation) throw new NotFoundError("Moderation not found.");

    return moderation;
  };
}

export type GetModerationHandler = ReturnType<typeof GetModeration>;
export type GetModerationDto = Awaited<ReturnType<GetModerationHandler>>;
