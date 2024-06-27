//

import consola, { LogLevels } from "consola";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Client } from "pg";
import * as schema from "../src/drizzle/schema";

export const connection = new Client({
  connectionString:
    process.env["DATABASE_URL"] ??
    "postgresql://postgres:postgres@localhost:5432/postgres",
});
await connection.connect();

const db = drizzle(connection, {
  schema,
  logger: consola.level >= LogLevels.debug,
});

await migrate(db, { migrationsFolder: "src/drizzle" });

await connection.end();
