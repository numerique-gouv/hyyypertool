//

import type { Config } from "drizzle-kit";

//

export default {
  dbCredentials: {
    connectionString:
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
