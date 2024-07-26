//

import { PGlite } from "@electric-sql/pglite";
import type { PgInsertValue } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/pglite";
import { migrate as pglite_migrate } from "drizzle-orm/pglite/migrator";
import path from "node:path";
import { schema } from "..";

//

export const client = new PGlite(undefined, { debug: 0 });
export type { PgliteClient } from "drizzle-orm/pglite";

export const pg = drizzle(client, { schema });

export async function empty_database() {
  await pg.transaction(async (tx) => {
    await tx.delete(schema.users_organizations);
    //
    await tx.delete(schema.email_domains);
    await tx.delete(schema.organizations);
    await tx.delete(schema.users);
  });
}
export function migrate() {
  return pglite_migrate(pg, {
    migrationsFolder: path.resolve(import.meta.dirname, "../drizzle"),
  });
}

export async function add_user_to_organization(
  value: PgInsertValue<typeof schema.users_organizations>,
) {
  return pg.insert(schema.users_organizations).values(value);
}
