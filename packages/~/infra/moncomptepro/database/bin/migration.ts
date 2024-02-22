//

import config from "@~/app.core/config";
import consola, { LogLevels } from "consola";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Client } from "pg";
import * as schema from "../src/drizzle/schema";

export const connection = new Client({
  connectionString: config.DATABASE_URL,
});

await connection.connect();

const db = drizzle(connection, {
  schema,
  logger: consola.level >= LogLevels.verbose,
});

await migrate(db, { migrationsFolder: "src/drizzle" });

await connection.end();
