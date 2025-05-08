//

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate as pglite_migrate } from "drizzle-orm/pglite/migrator";
import path from "node:path";
import * as schema from "../drizzle/schema";

//

export const client = new PGlite("memory://", { debug: 0 });
export type { PgliteClient } from "drizzle-orm/pglite";

export const pg = drizzle(client, { schema });

export async function empty_database() {
  await pg.transaction(async (_tx) => {});
}
export function migrate() {
  return pglite_migrate(pg, {
    migrationsFolder: path.resolve(import.meta.dirname, "../drizzle"),
  });
}
