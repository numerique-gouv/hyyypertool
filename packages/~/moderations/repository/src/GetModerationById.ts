//

import { NotFoundError } from "@~/app.core/error";
import { schema } from "@~/moncomptepro.database";
import { eq } from "drizzle-orm";
import type { MonComptePro_PostgresContext } from "./context";

//

export function GetModerationById({ pg }: MonComptePro_PostgresContext) {
  type ModerationColumns = keyof typeof schema.moderations._.columns;
  type ModerationColumnsFilter = Partial<Record<ModerationColumns, true>>;
  type UsersColumns = keyof typeof schema.users._.columns;
  type UserColumnsFilter = Partial<Record<UsersColumns, true>>;
  type WithTableNamess = {
    user?: {
      columns: UserColumnsFilter;
    };
  };
  //
  return async function get_moderation_by_id<
    TColumns extends ModerationColumnsFilter,
    TWith extends WithTableNamess | undefined,
  >(
    moderation_id: number,
    { columns, with: with_relation }: { columns: TColumns; with: TWith },
  ) {
    const moderation = await pg.query.moderations.findFirst({
      columns,
      with: with_relation,
      where: eq(schema.moderations.id, moderation_id),
    });

    if (!moderation) throw new NotFoundError("Moderation not found.");

    return moderation;
  };
}

export type GetModerationByIdHandler = ReturnType<typeof GetModerationById>;
