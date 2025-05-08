//

import type { Config } from "drizzle-kit";
import { env } from "node:process";

//

export default {
  dbCredentials: {
    url:
      env["DATABASE_URL"] ||
      "postgresql://postgres:postgres@localhost:6543/postgres?schema=public",
  },
  dialect: "postgresql",
  introspect: { casing: "preserve" },
  out: "src/drizzle",
  schema: "src/drizzle/schema.ts",
  strict: true,
  verbose: true,
} satisfies Config;
