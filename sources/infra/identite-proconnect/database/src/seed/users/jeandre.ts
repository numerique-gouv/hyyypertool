//

import type { IdentiteProconnect_PgDatabase } from "../..";
import { schema } from "../../index";

//

export async function insert_jeandre(db: IdentiteProconnect_PgDatabase) {
  const insert = await db
    .insert(schema.users)
    .values({
      created_at: new Date("2024-01-15T10:30:00.000Z").toISOString(),
      email: "jeandre@yopmail.com",
      family_name: "Dré",
      given_name: "Jean",
      updated_at: new Date("2024-01-15T10:30:00.000Z").toISOString(),
    })
    .returning();

  return insert.at(0)!;
}
