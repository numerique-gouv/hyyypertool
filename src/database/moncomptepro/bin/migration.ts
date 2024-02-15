//

import env from ":common/env.ts";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Client } from "pg";
import * as schema from "../drizzle/schema";

export const connection = new Client({
  connectionString: env.DATABASE_URL,
});

await connection.connect();

const db = drizzle(connection, {
  schema,
  logger: env.DEPLOY_ENV === "preview",
});

await migrate(db, { migrationsFolder: "src/database/moncomptepro/drizzle" });

await connection.end();
