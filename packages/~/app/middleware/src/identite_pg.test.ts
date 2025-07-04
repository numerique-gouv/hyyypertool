//

import type { App_Config } from "@~/app.core/config";
import { expect, mock, test } from "bun:test";
import { sql } from "drizzle-orm";
import { Hono } from "hono";

//

test("IdentiteProconnect Postgres middleware", async () => {
  mock.module("@~/app.core/config", (): { default: Partial<App_Config> } => ({
    default: {},
  }));

  const { identite_pg_database } = await import("./identite_pg");

  const app = new Hono()
    .get(
      "/readyz",
      identite_pg_database({
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

  expect(() => app.fetch(new Request("http://localhost/readyz"))).toThrowError(
    new Error(""),
  );
});
