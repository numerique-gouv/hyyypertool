//

import { set_config } from "@~/app.middleware/set_config";
import { set_moncomptepro_pg } from "@~/app.middleware/set_moncomptepro_pg";
import { set_nonce } from "@~/app.middleware/set_nonce";
import { set_userinfo } from "@~/app.middleware/set_userinfo";
import { anais_tailhade } from "@~/app.middleware/set_userinfo#fixture";
import { schema } from "@~/moncomptepro.database";
import {
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/moncomptepro.database/seed/unicorn";
import {
  client,
  empty_database,
  migrate,
  pg,
} from "@~/moncomptepro.database/testing";
import { setDatabaseConnection } from "@~/moncomptepro.lib/sdk";
import {
  beforeAll,
  beforeEach,
  expect,
  mock,
  setSystemTime,
  test,
} from "bun:test";
import { Hono } from "hono";
import app, { FORM_SCHEMA } from "./validate";

//

mock.module("@~/moncomptepro.lib", () => ({ join_organization: mock() }));
setDatabaseConnection(client as any);

//

beforeAll(migrate);
beforeAll(() => setSystemTime(new Date("2222-01-01T00:00:00.000Z")));
beforeEach(empty_database);

test("GET /moderation/:id/$procedures/validate", async () => {
  const unicorn_organization_id = await create_unicorn_organization(pg);
  const adora_pony_user_id = await create_adora_pony_user(pg);

  await pg.insert(schema.moderations).values({
    id: 42,
    organization_id: unicorn_organization_id,
    user_id: adora_pony_user_id,
    type: "",
  });

  const body = new FormData();
  body.append("add_domain", "true");
  body.append("add_member", FORM_SCHEMA.shape.add_member.Enum.AS_INTERNAL);

  setSystemTime(new Date("2222-01-02T00:00:00.000Z"));

  const response = await new Hono()
    .use(set_config({}))
    .use(set_moncomptepro_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo(anais_tailhade))
    .route("/:id", app)
    .onError((error) => {
      throw error;
    })
    .request("/42", { method: "PATCH", body });

  expect(response.status).toBe(200);

  expect(
    await pg.query.moderations.findFirst({
      where: (table, { eq }) => eq(table.id, 42),
    }),
  ).toEqual({
    id: 42,
    organization_id: unicorn_organization_id,
    user_id: adora_pony_user_id,
    type: "",
    ticket_id: null,
    moderated_at: "2222-01-02 00:00:00+00",
    moderated_by: "anais.tailhade@omage.gouv.fr",
    comment:
      "7952428800000 anais.tailhade@omage.gouv.fr | Validé par anais.tailhade@omage.gouv.fr ",
    created_at: "2222-01-01 00:00:00+00",
  });

  expect(
    await pg.query.users_organizations.findFirst({
      where: (table, { and, eq }) =>
        and(
          eq(table.organization_id, unicorn_organization_id),
          eq(table.user_id, adora_pony_user_id),
        ),
    }),
  ).toEqual({
    authentication_by_peers_type: null,
    created_at: "2222-01-02 00:00:00+00",
    has_been_greeted: false,
    is_external: false,
    needs_official_contact_email_verification: false,
    official_contact_email_verification_sent_at: null,
    official_contact_email_verification_token: null,
    organization_id: unicorn_organization_id,
    sponsor_id: null,
    updated_at: "2222-01-02 00:00:00+00",
    user_id: adora_pony_user_id,
    verification_type: "domain",
    verified_at: null,
  });
});
