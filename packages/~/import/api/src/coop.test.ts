//

import { set_config } from "@~/app.middleware/set_config";
import { set_moncomptepro_pg } from "@~/app.middleware/set_moncomptepro_pg";
import { set_userinfo } from "@~/app.middleware/set_userinfo";
import { empty_database, migrate, pg } from "@~/moncomptepro.database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { Hono } from "hono";
import { z } from "zod";
import coop_router, { Input_Schema } from "./coop";

//

beforeAll(migrate);
beforeEach(empty_database);

//

test("POST /coop", async () => {
  const account: z.input<typeof Input_Schema> = {
    prenom: "🧌 prenom",
    nom: "🐻 nom",
    téléphone: "📞 téléphone",
    email: "jean@mich.com",
    coordinateur: "👨‍💻 coordinateur",
    "Code Postal": "🏢 ",
    "Nom commune": "🏢",
    "SIRET structure": "🏢",
    "email professionnel secondaire": "📧",
  };

  const response = await new Hono()
    .use(set_config({ API_COOP_USERNAME: "coop", API_COOP_PASSWORD: "coop" }))
    .use(set_moncomptepro_pg(pg))
    .use(set_userinfo({ email: "good@captain.yargs" }))
    .route("/", coop_router)
    .onError((error) => {
      throw error;
    })
    .request("/coop", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from("coop:coop").toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(account),
    });

  if (response.status >= 400) throw await response.text();

  expect(response.status).toBe(200);
  await expect(response.json()).resolves.toEqual({ ok: "OK" });
});

test("❌ fails with empty body", async () => {
  const response = await new Hono()
    .use(set_config({ API_COOP_USERNAME: "coop", API_COOP_PASSWORD: "coop" }))
    .use(set_moncomptepro_pg(pg))
    .use(set_userinfo({ email: "good@captain.yargs" }))
    .route("/", coop_router)
    .onError((error) => {
      throw error;
    })
    .request("/coop", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from("coop:coop").toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

  expect(response.status).toBe(400);
  await expect(response.json()).resolves.toEqual({
    error: {
      issues: expect.any(Array),
      name: "ZodError",
    },
    success: false,
  });
});
