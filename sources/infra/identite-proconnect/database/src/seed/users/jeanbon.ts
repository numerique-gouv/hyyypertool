import type { IdentiteProconnect_PgDatabase } from "../..";
import { schema } from "../../index";

export async function insert_jeanbon(db: IdentiteProconnect_PgDatabase) {
  const insert = await db
    .insert(schema.users)
    .values({
      created_at: new Date("2018-07-13 15:35:15").toISOString(),
      email: "jeanbon@yopmail.com",
      family_name: "Bon",
      given_name: "Jean",
      job: "Boucher",
      phone_number: "0123456789",
      updated_at: new Date("2023-06-22 14:34:34").toISOString(),
      verify_email_sent_at: new Date("2023-06-22 14:34:34").toISOString(),
    })
    .returning();

  return insert.at(0)!;
}
