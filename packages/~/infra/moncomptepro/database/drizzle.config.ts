//

import type { Config } from "drizzle-kit";
import { env } from "node:process";

//

export default {
  dbCredentials: {
    url:
      env["DATABASE_URL"] ||
      "postgresql://postgres:postgres@localhost:5432/postgres?schema=public",
  },
  dialect: "postgresql",
  introspect: { casing: "preserve" },
  out: "src/drizzle",
  schema: "src/drizzle/schema.ts",
  strict: true,
  tablesFilter: [
    "email_domains",
    "moderations",
    "oidc_clients",
    "organizations",
    "users_oidc_clients",
    "users_organizations",
    "users",
  ],
  verbose: true,
} satisfies Config;
