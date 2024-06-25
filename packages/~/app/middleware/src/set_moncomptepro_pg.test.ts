//

import { pg } from "@~/moncomptepro.database/testing";
import { expect, test } from "bun:test";
import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { set_moncomptepro_pg } from "./set_moncomptepro_pg";

//

test("should set moncomptepro_pg variable", async () => {
  const app = new Hono().get(
    "/readyz",
    set_moncomptepro_pg(pg),
    async ({ text, var: { moncomptepro_pg } }) => {
      const is_ok = await moncomptepro_pg.execute(sql`SELECT 1`);
      return text(is_ok ? "✅" : "❌");
    },
  );

  const res = await app.request("/readyz");

  expect(res.status).toBe(200);
  expect(await res.text()).toBe("✅");
});
