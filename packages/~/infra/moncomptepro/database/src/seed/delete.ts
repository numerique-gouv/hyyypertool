//

import consola from "consola";
import { sql } from "drizzle-orm";
import type { MonComptePro_PgDatabase } from "../index";
import { schema } from "../index";

//

export async function delete_database(db: MonComptePro_PgDatabase) {
  try {
    const users_organizations = await db
      .delete(schema.users_organizations)
      .returning();
    consola.info(`🚮 DELETE ${users_organizations.length} users_organizations`);

    const users_oidc_clients = await db
      .delete(schema.users_oidc_clients)
      .returning();
    await db.execute(
      sql`ALTER SEQUENCE users_oidc_clients_id_seq RESTART WITH 1`,
    );
    consola.info(`🚮 DELETE ${users_oidc_clients.length} users_oidc_clients`);

    const oidc_clients = await db.delete(schema.oidc_clients).returning();
    await db.execute(sql`ALTER SEQUENCE oidc_clients_id_seq RESTART WITH 1`);
    consola.info(`🚮 DELETE ${oidc_clients.length} oidc_clients`);

    const users = await db.delete(schema.users).returning();
    await db.execute(sql`ALTER SEQUENCE users_id_seq RESTART WITH 1`);
    consola.info(`🚮 DELETE ${users.length} users`);

    const organizations = await db.delete(schema.organizations).returning();
    await db.execute(sql`ALTER SEQUENCE organizations_id_seq RESTART WITH 1`);
    consola.info(`🚮 DELETE ${organizations.length} organizations`);

    const moderations = await db.delete(schema.moderations).returning();
    await db.execute(sql`ALTER SEQUENCE moderations_id_seq RESTART WITH 1`);
    consola.info(`🚮 DELETE ${moderations.length} moderations`);
  } catch (err) {
    console.error("Something went wrong...");
    console.error(err);
  }
}
