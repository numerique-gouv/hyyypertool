import type { MonComptePro_PgDatabase } from "../..";
import { schema } from "../../index";

export async function insert_richardbon(db: MonComptePro_PgDatabase) {
  const insert = await db
    .insert(schema.users)
    .values({
      created_at: new Date("2022-02-03T11:23:48.375Z").toISOString(),
      email: "richardbon@leclerc.fr",
      family_name: "Bon",
      given_name: "Richard",
      job: "Dirigeant",
      email_verified: true,
      phone_number: "0123456789",
      updated_at: new Date("2022-02-03T11:25:06.312Z").toISOString(),
      verify_email_sent_at: new Date("2022-02-03T11:25:06.312Z").toISOString(),
    })
    .returning();

  return insert.at(0)!;
}
