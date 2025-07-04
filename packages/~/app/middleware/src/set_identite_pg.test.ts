//

import { pg } from "@~/identite-proconnect.database/testing";
import { expect, test } from "bun:test";
import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { set_identite_pg } from "./set_identite_pg";

//

test("should set identite_pg variable", async () => {
  const app = new Hono().get(
    "/readyz",
    set_identite_pg(pg),
    async ({ text, var: { identite_pg } }) => {
      const is_ok = await identite_pg.execute(sql`SELECT 1`);
      return text(is_ok ? "✅" : "❌");
    },
  );

  const res = await app.request("/readyz");

  expect(res.status).toBe(200);
  expect(await res.text()).toBe("✅");
});
