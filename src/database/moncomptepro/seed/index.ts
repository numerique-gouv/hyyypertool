//

import env from ":common/env.ts";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../drizzle/schema.js";
import { delete_database } from "../seed/delete.js";
import { insert_database } from "../seed/insert.js";

//

export async function seed() {
  const client = new pg.Client({
    connectionString:
      env.DATABASE_URL ??
      "postgresql://postgres:postgres@localhost:5432/postgres",
  });
  await client.connect();

  const db = drizzle(client, {
    // logger: env.DEPLOY_ENV === "preview",
    schema,
  });

  await delete_database(db);
  await insert_database(db);

  await client.end();

  return null;
}
