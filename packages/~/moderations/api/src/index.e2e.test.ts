//

import { asValue, set_injector } from "@~/app.di";
import { set_config } from "@~/app.middleware/set_config";
import { set_moncomptepro_pg } from "@~/app.middleware/set_moncomptepro_pg";
import { set_nonce } from "@~/app.middleware/set_nonce";
import { set_userinfo } from "@~/app.middleware/set_userinfo";
import type { Database } from "@~/moderations.repository/Database";
import { empty_database, migrate, pg } from "@~/moncomptepro.database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { Hono } from "hono";
import app from "./index";

//

beforeAll(migrate);
beforeEach(empty_database);

//

test("GET /moderations", async () => {
  const response = await new Hono()
    .use(
      set_injector<Database>((injector) => {
        injector.register({
          pg: asValue(pg),
        });
      }),
    )
    .use(set_config({ ALLOWED_USERS: "good@captain.yargs" }))
    .use(set_moncomptepro_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "good@captain.yargs" }))
    .route("/", app)
    .onError((error) => {
      throw error;
    })
    .request("/");

  if (response.status >= 400) throw await response.text();

  expect(response.status).toBe(200);
});
