//

import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import Pg from "pg";
import * as schema from "./drizzle.schema";

//

export { drizzle } from "drizzle-orm/node-postgres";
export * from "./types";
export { schema };

export type MonComptePro_PgDatabase = PgDatabase<
  PgQueryResultHKT,
  typeof schema
>;
export type MonCompteProDatabaseCradle = {
  pg: MonComptePro_PgDatabase;
};
export const Pool = Pg.Pool;
