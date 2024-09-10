//

import { NotFoundError } from "@~/app.core/error";
import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { eq } from "drizzle-orm";

//

export function GetModerationById({ pg }: { pg: MonComptePro_PgDatabase }) {
  type ModerationColumns = keyof typeof schema.moderations._.columns;
  return async function get_moderation_by_id<
    TColumns extends Partial<Record<ModerationColumns, true>>,
  >(moderation_id: number, { columns }: { columns: TColumns }) {
    const moderation = await pg.query.moderations.findFirst({
      columns,
      where: eq(schema.moderations.id, moderation_id),
    });

    if (!moderation) throw new NotFoundError("Moderation not found.");

    return moderation;
  };
}

export type GetModerationByIdHandler = ReturnType<typeof GetModerationById>;
