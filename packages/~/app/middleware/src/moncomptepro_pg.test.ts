//

import type { App_Config } from "@~/app.core/config";
import { expect, mock, test } from "bun:test";
import { sql } from "drizzle-orm";
import { Hono } from "hono";

//

test("MonComptePro Postgres middleware", async () => {
  mock.module("@~/app.core/config", (): { default: Partial<App_Config> } => ({
    default: {},
  }));

  const { moncomptepro_pg_database } = await import("./moncomptepro_pg");

  const app = new Hono()
    .get(
      "/readyz",
      moncomptepro_pg_database({
        connectionString: "postgres://🦄:㊙️@🛖:1234/📕",
      }),
      async ({ text, var: { moncomptepro_pg } }) => {
        const is_ok = await moncomptepro_pg.execute(sql`SELECT 1`);
        return text(is_ok ? "✅" : "❌");
      },
    )
    .onError((e) => {
      throw e;
    });

  expect(() => app.fetch(new Request("http://localhost/readyz"))).toThrowError(
    /getaddrinfo ENOTFOUND|Failed to connect|ENOTFOUND/,
  );
});
