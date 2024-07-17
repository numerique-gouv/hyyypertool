//

import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import Pg from "pg";
import * as schema from "./drizzle/relations";

//

export { drizzle } from "drizzle-orm/node-postgres";
export { schema };

export type MonComptePro_PgDatabase = PgDatabase<
  PgQueryResultHKT,
  typeof schema
>;
export const Pool = Pg.Pool;

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
