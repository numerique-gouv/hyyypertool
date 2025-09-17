import type { IdentiteProconnect_PgDatabase } from "../..";
import { schema } from "../../index";

export async function insert_jeanbon(db: IdentiteProconnect_PgDatabase) {
  const insert = await db
    .insert(schema.users)
    .values({
      created_at: "2018-07-13T17:35:15+02:00",
      email: "jeanbon@yopmail.com",
      family_name: "Bon",
      given_name: "Jean",
      job: "Boucher",
      phone_number: "0123456789",
      updated_at: "2023-06-22T16:34:34+02:00",
      verify_email_sent_at: "2023-06-22T16:34:34+02:00",
    })
    .returning();

  return insert.at(0)!;
}
