//

import { set_config } from "@~/app.middleware/set_config";
import { set_identite_pg } from "@~/app.middleware/set_identite_pg";
import { set_nonce } from "@~/app.middleware/set_nonce";
import { set_userinfo } from "@~/app.middleware/set_userinfo";
import {
  create_adora_pony_moderation,
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/identite-proconnect.database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect.database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { Hono } from "hono";
import app from "./index";

//

beforeAll(migrate);
beforeEach(empty_database);

//

test("GET /moderations/:id/duplicate_warning", async () => {
  const organization_id = await create_unicorn_organization(pg);
  const user_id = await create_adora_pony_user(pg);

  const moderation_id = await create_adora_pony_moderation(pg, { type: "" });
  const query_params = new URLSearchParams({
    organization_id: organization_id.toString(),
    user_id: user_id.toString(),
  });
  //

  const response = await new Hono()
    .use(set_config({ ALLOWED_USERS: "good@captain.yargs" }))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "good@captain.yargs" }))
    .route("/:id/duplicate_warning", app)
    .onError((error) => {
      throw error;
    })
    .request(
      `/${moderation_id}/duplicate_warning?${query_params.toString()}`,
      {},
    );

  if (response.status >= 400) throw await response.text();

  expect(response.status).toBe(200);
});
