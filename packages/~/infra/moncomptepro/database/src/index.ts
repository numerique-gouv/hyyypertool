//

import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { PgliteDatabase } from "drizzle-orm/pglite";
import Pg from "pg";
import * as schema from "./drizzle/relations";

//

export { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
export { schema };
export type MonComptePro_NodePgDatabase = NodePgDatabase<typeof schema>;
export type MonComptePro_PgliteDatabase = PgliteDatabase<typeof schema>;
export type MonComptePro_PgDatabase =
  | MonComptePro_NodePgDatabase
  | MonComptePro_PgliteDatabase;
export const Pool = Pg.Pool;
export type { NodePgDatabase };

//

export type Readonly_Fields = "created_at" | "id" | "updated_at";
export type Organization = typeof schema.organizations.$inferSelect;
export type Moderation = typeof schema.moderations.$inferSelect;
export type User = typeof schema.users.$inferSelect;
export type Writable_User = Omit<
  typeof schema.users.$inferInsert,
  Readonly_Fields | "encrypted_password"
>;
export type Users_Organizations =
  typeof schema.users_organizations.$inferSelect;

export type Writable_Users_Organizations = Omit<
  typeof schema.users_organizations.$inferInsert,
  Readonly_Fields | "user_id" | "organization_id"
>;
