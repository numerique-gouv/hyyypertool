//

import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { eq } from "drizzle-orm";

//

type Insert = Pick<
  typeof schema.moderations.$inferInsert,
  "comment" | "moderated_by" | "moderated_at" | "ticket_id"
>;
export function update_moderation_by_id(
  pg: MonComptePro_PgDatabase,
  values: { moderation_id: number } & Insert,
) {
  const { moderation_id, ...other_values } = values;
  return pg
    .update(schema.moderations)
    .set(other_values)
    .where(eq(schema.moderations.id, moderation_id));
}
