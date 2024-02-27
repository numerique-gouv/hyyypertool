//

import consola from "consola";
import { sql } from "drizzle-orm";
import * as schema from "../drizzle/schema";
import type { MonComptePro_PgDatabase } from "../index";

//

export async function delete_database(db: MonComptePro_PgDatabase) {
  try {
    const users_organizations = await db.delete(schema.users_organizations);
    consola.verbose(
      `🚮 ${users_organizations.command} ${users_organizations.rowCount} users_organizations`,
    );

    const users_oidc_clients = await db.delete(schema.users_oidc_clients);
    await db.execute(
      sql`ALTER SEQUENCE users_oidc_clients_id_seq RESTART WITH 1`,
    );
    consola.verbose(
      `🚮 ${users_oidc_clients.command} ${users_oidc_clients.rowCount} users_oidc_clients`,
    );

    const oidc_clients = await db.delete(schema.oidc_clients);
    await db.execute(sql`ALTER SEQUENCE oidc_clients_id_seq RESTART WITH 1`);
    consola.verbose(
      `🚮 ${oidc_clients.command} ${oidc_clients.rowCount} oidc_clients`,
    );

    const users = await db.delete(schema.users);
    await db.execute(sql`ALTER SEQUENCE users_id_seq RESTART WITH 1`);
    consola.verbose(`🚮 ${users.command} ${users.rowCount} users`);

    const organizations = await db.delete(schema.organizations);
    await db.execute(sql`ALTER SEQUENCE organizations_id_seq RESTART WITH 1`);
    consola.verbose(
      `🚮 ${organizations.command} ${organizations.rowCount} organizations`,
    );

    const moderations = await db.delete(schema.moderations);
    await db.execute(sql`ALTER SEQUENCE moderations_id_seq RESTART WITH 1`);
    consola.verbose(
      `🚮 ${moderations.command} ${moderations.rowCount} moderations`,
    );
  } catch (err) {
    console.error("Something went wrong...");
    console.error(err);
  }
}
