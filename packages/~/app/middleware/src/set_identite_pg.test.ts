//

import type { App_Config } from "@~/app.core/config";
import { pg } from "@~/identite-proconnect.database/testing";
import { expect, mock, test } from "bun:test";
import { sql } from "drizzle-orm";
import { Hono } from "hono";

//

test("set_identite_pg middleware", async () => {
  const { set_identite_pg } = await import("./set_identite_pg");

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

test("set_identite_pg_database middleware", async () => {
  mock.module("@~/app.core/config", (): { default: Partial<App_Config> } => ({
    default: {},
  }));

  const { set_identite_pg_database } = await import("./set_identite_pg");

  const app = new Hono()
    .get(
      "/readyz",
      set_identite_pg_database({
        connectionString: "postgres://🦄:㊙️@🛖:1234/📕",
      }),
      async ({ text, var: { identite_pg } }) => {
        const is_ok = await identite_pg.execute(sql`SELECT 1`);
        return text(is_ok ? "✅" : "❌");
      },
    )
    .onError((e) => {
      throw e;
    });

  expect(app.request("/readyz")).rejects.toThrow();
});
