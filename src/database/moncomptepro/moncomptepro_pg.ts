//

import env from ":common/env.ts";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./drizzle/schema";

//

export const connection = new Client({
  connectionString: env.DATABASE_URL,
});

//

try {
  await connection.connect();
} catch (error) {
  console.error(error);
  console.error("Could not connect to database");
}

//

export const moncomptepro_pg = drizzle(connection, {
  schema,
  logger: env.DEPLOY_ENV === "preview",
});
export * as schema from "./drizzle/schema";
export type MonComptePro_PgDatabase = NodePgDatabase<typeof schema>;

//

export type User = typeof schema.users.$inferSelect;
export type Organization = typeof schema.organizations.$inferSelect;
export type Moderation = typeof schema.moderations.$inferSelect;
export type Users_Organizations =
  typeof schema.users_organizations.$inferSelect;
