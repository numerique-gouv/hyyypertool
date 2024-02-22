//

import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./drizzle/schema";

//

export type MonComptePro_PgDatabase = NodePgDatabase<typeof schema>;
export { drizzle } from "drizzle-orm/node-postgres";
export { Pool } from "pg";
export * as schema from "./drizzle/schema";

//

export type Organization = typeof schema.organizations.$inferSelect;
export type Moderation = typeof schema.moderations.$inferSelect;
export type User = typeof schema.users.$inferSelect;
export type Users_Organizations =
  typeof schema.users_organizations.$inferSelect;
