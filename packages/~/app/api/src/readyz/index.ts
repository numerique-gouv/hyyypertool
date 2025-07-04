//

import env from "@~/app.core/config";
import { identite_pg_database } from "@~/app.middleware/identite_pg";
import { get_zammad_me } from "@~/zammad.lib";
import { to } from "await-to-js";
import { sql } from "drizzle-orm";
import { Hono } from "hono";

//

export default new Hono()
  .get("/", ({ text }) => text(`readyz check passed`))
  .get("/sentry", () => {
    throw new Error("Sentry Check " + new Date().toISOString());
  })
  .get("/zammad", async ({ text }) => {
    const [, user] = await to(get_zammad_me());
    const is_ok = user !== undefined;
    return text(
      [
        `[${is_ok ? "+" : "-"}]zammad identite connection ${user ? "OK" : "FAIL"}`,
        `[${is_ok ? "+" : "-"}]zammad connected as ${user ? user.email : "FAIL"}`,
      ].join("\n"),
    );
  })
  .get(
    "/drizzle/identite",
    identite_pg_database({ connectionString: env.DATABASE_URL }),
    async ({ text, var: { identite_pg } }) => {
      const [, is_ok] = await to(identite_pg.execute(sql`SELECT 1`));
      return text("[+]drizzle identite connection " + (is_ok ? "OK" : "FAIL"));
    },
  );
