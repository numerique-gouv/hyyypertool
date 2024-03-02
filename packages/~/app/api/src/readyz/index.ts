//

import env from "@~/app.core/config";
import { moncomptepro_pg_database } from "@~/app.middleware/moncomptepro_pg";
import { get_zammad_me } from "@~/zammad.lib";
import { to } from "await-to-js";
import { sql } from "drizzle-orm";
import { Hono } from "hono";

//

export default new Hono()
  .get("/", ({ text }) => text(`readyz check passed`))
  .get("/zammad", async ({ text }) => {
    const [, user] = await to(get_zammad_me());
    const is_ok = user !== undefined;
    return text(
      [
        `[${is_ok ? "+" : "-"}]zammad moncomptepro connection ${user ? "OK" : "FAIL"}`,
        `[${is_ok ? "+" : "-"}]zammad connected as ${user ? user.email : "FAIL"}`,
      ].join("\n"),
    );
  })
  .get(
    "/drizzle/moncomptepro",
    moncomptepro_pg_database({ connectionString: env.DATABASE_URL }),
    async ({ text, var: { moncomptepro_pg } }) => {
      const [, is_ok] = await to(moncomptepro_pg.execute(sql`SELECT 1`));
      return text(
        "[+]drizzle moncomptepro connection " + (is_ok ? "OK" : "FAIL"),
      );
    },
  );
