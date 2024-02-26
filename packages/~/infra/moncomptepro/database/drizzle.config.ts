//

import type { Config } from "drizzle-kit";
import { env } from "node:process";

//

export default {
  dbCredentials: {
    connectionString:
      env["DATABASE_URL"] ||
      "postgresql://postgres:postgres@localhost:5432/postgres?schema=public",
  },
  driver: "pg",
  out: "src/drizzle",
  schema: "src/drizzle/schema.ts",
  strict: true,
  introspect: {
    casing: "preserve",
  },
  tablesFilter: [
    "moderations",
    "oidc_clients",
    "organizations",
    "users_oidc_clients",
    "users_organizations",
    "users",
  ],
  verbose: true,
} satisfies Config;
