//

import { set_config } from "@~/app.middleware/set_config";
import { set_moncomptepro_pg } from "@~/app.middleware/set_moncomptepro_pg";
import { set_nonce } from "@~/app.middleware/set_nonce";
import { set_userinfo } from "@~/app.middleware/set_userinfo";
import { schema } from "@~/moncomptepro.database";
import {
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/moncomptepro.database/seed/unicorn";
import {
  add_user_to_organization,
  client,
  empty_database,
  migrate,
  pg,
} from "@~/moncomptepro.database/testing";
import { setDatabaseConnection } from "@~/moncomptepro.lib/sdk";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { Hono } from "hono";
import app from "./validate";

//

setDatabaseConnection(client as any);
beforeAll(migrate);
beforeEach(empty_database);

test("GET /moderation/:id/$procedures/validate", async () => {
  await given_moderation_42();
  const body = new FormData();
  body.append("add_domain", "true");

  const response = await new Hono()
    .use(set_config({}))
    .use(set_moncomptepro_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({}))
    .route("/:id", app)
    .request("/42", { method: "PATCH", body });

  expect(response.status).toBe(200);
});

async function given_moderation_42() {
  const unicorn_organization_id = await create_unicorn_organization(pg);
  const adora_pony_user_id = await create_adora_pony_user(pg);

  await add_user_to_organization({
    organization_id: unicorn_organization_id,
    user_id: adora_pony_user_id,
  });

  await pg.insert(schema.moderations).values({
    id: 42,
    organization_id: unicorn_organization_id,
    user_id: adora_pony_user_id,
    type: "",
  });
  return unicorn_organization_id;
}
