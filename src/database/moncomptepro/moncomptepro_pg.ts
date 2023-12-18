//

import env from ":env";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./drizzle/schema";

//

export const connection = new Client({
  connectionString: env.DATABASE_URL,
});

//

await connection.connect();

//

export const moncomptepro_pg = drizzle(connection, {
  schema,
  logger: env.DEPLOY_ENV === "preview",
});
export * as schema from "./drizzle/schema";
