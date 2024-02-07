//

import * as schema from "../drizzle/schema";
import type { MonComptePro_PgDatabase } from "../moncomptepro_pg";

//

export async function delete_database(db: MonComptePro_PgDatabase) {
  try {
    const users_organizations = await db.delete(schema.users_organizations);
    const users_oidc_clients = await db.delete(schema.users_oidc_clients);
    const oidc_clients = await db.delete(schema.oidc_clients);
    const users = await db.delete(schema.users);
    const sessions = await db.delete(schema.organizations);
    const moderations = await db.delete(schema.moderations);

    console.log({
      users,
      sessions,
      users_organizations,
      users_oidc_clients,
      oidc_clients,
      moderations,
    });
  } catch (err) {
    console.error("Something went wrong...");
    console.error(err);
  }
}
