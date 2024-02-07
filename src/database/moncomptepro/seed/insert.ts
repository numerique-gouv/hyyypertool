//

import * as schema from "../drizzle/schema";
import type { MonComptePro_PgDatabase } from "../moncomptepro_pg";

//

export async function insert_database(db: MonComptePro_PgDatabase) {
  try {
    const raphael = await insert_raphael(db);
    console.log(`🌱 ${raphael.command} ${raphael.rowCount} Raphael`);
  } catch (err) {
    console.error("Something went wrong...");
    console.error(err);
  }
}

//

function insert_raphael(db: MonComptePro_PgDatabase) {
  return db.insert(schema.users).values({
    created_at: new Date("2018-07-13 15:35:15"),
    family_name: "Dubigny",
    given_name: "Raphael",
    job: "Chef",
    phone_number: "0123456789",
    updated_at: new Date("2023-06-22 14:34:34"),
    verify_email_sent_at: new Date("2023-06-22 14:34:34"),
  });
}
