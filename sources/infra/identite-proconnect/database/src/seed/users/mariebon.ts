//

import { schema, type IdentiteProconnect_PgDatabase } from "../..";

//

export async function insert_mariebon(pg: IdentiteProconnect_PgDatabase) {
  const [{ id: user_id }] = await pg
    .insert(schema.users)
    .values({
      created_at: new Date("2014-02-13T17:25:09.000Z").toISOString(),
      email_verified: true,
      email: "marie.bon@fr.bosch.com",
      family_name: "Bon",
      given_name: "Marie",
      job: "Gestionnaire données sociales",
      last_sign_in_at: new Date("2024-02-15T12:48:00.106Z").toISOString(),
      sign_in_count: 3,
      updated_at: new Date("2014-02-15T13:48:00.000Z").toISOString(),
    })
    .returning({ id: schema.users.id });

  return user_id;
}
