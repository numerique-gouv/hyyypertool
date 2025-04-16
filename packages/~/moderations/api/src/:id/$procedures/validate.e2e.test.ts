//

import { set_config } from "@~/app.middleware/set_config";
import {
  set_moncomptepro_pg,
  set_moncomptepro_pg_client,
} from "@~/app.middleware/set_moncomptepro_pg";
import { set_nonce } from "@~/app.middleware/set_nonce";
import { set_userinfo } from "@~/app.middleware/set_userinfo";
import { anais_tailhade } from "@~/app.middleware/set_userinfo#fixture";
import { validate_form_schema } from "@~/moderations.lib/schema/validate.form";
import {
  create_adora_pony_moderation,
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/moncomptepro.database/seed/unicorn";
import {
  client,
  empty_database,
  migrate,
  pg,
} from "@~/moncomptepro.database/testing";
import { beforeAll, beforeEach, expect, setSystemTime, test } from "bun:test";
import { Hono } from "hono";
import app from "./validate";

//

beforeAll(migrate);
beforeEach(() => setSystemTime(new Date("2222-01-01T00:00:00.000Z")));
beforeEach(empty_database);

test("GET /moderation/:id/$procedures/validate { add_domain: true, add_member: AS_INTERNAL }", async () => {
  const { adora_pony_user_id, moderation_id, unicorn_organization_id } =
    await given_moderation_42();

  const body = new FormData();
  body.append("add_domain", "true");
  body.append(
    "add_member",
    validate_form_schema.shape.add_member.enum.AS_INTERNAL,
  );
  const response = await new Hono()
    .use(set_config({}))
    .use(set_moncomptepro_pg(pg))
    .use(set_moncomptepro_pg_client(client as any))
    .use(set_nonce("nonce"))
    .use(set_userinfo(anais_tailhade))
    .route("/:id", app)
    .onError((error) => {
      throw error;
    })
    .request(`/${moderation_id}`, { method: "PATCH", body });

  expect(response.status).toBe(200);

  expect(
    await pg.query.moderations.findFirst({
      where: (table, { eq }) => eq(table.id, moderation_id),
    }),
  ).toEqual({
    id: moderation_id,
    organization_id: unicorn_organization_id,
    user_id: adora_pony_user_id,
    type: "",
    ticket_id: null,
    moderated_at: "2222-01-02 00:00:00+00",
    moderated_by: "Anais Tailhade <anais.tailhade@omage.gouv.fr>",
    comment:
      "7952428800000 anais.tailhade@omage.gouv.fr | Validé par anais.tailhade@omage.gouv.fr",
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
    created_at: "2222-01-02 00:00:00+00",
    has_been_greeted: false,
    is_external: false,
    needs_official_contact_email_verification: false,
    official_contact_email_verification_sent_at: null,
    official_contact_email_verification_token: null,
    organization_id: unicorn_organization_id,
    updated_at: "2222-01-02 00:00:00+00",
    user_id: adora_pony_user_id,
    verification_type: "domain",
    verified_at: null,
  });
});

test("GET /moderation/:id/$procedures/validate { add_domain: false, add_member: AS_EXTERNAL }", async () => {
  const { adora_pony_user_id, moderation_id, unicorn_organization_id } =
    await given_moderation_42();

  const body = new FormData();
  body.append("add_domain", "false");
  body.append(
    "add_member",
    validate_form_schema.shape.add_member.enum.AS_EXTERNAL,
  );
  const response = await new Hono()
    .use(set_config({}))
    .use(set_moncomptepro_pg(pg))
    .use(set_moncomptepro_pg_client(client as any))
    .use(set_nonce("nonce"))
    .use(set_userinfo(anais_tailhade))
    .route("/:id", app)
    .onError((error) => {
      throw error;
    })
    .request(`/${moderation_id}`, { method: "PATCH", body });

  expect(response.status).toBe(200);

  expect(
    await pg.query.moderations.findFirst({
      where: (table, { eq }) => eq(table.id, moderation_id),
    }),
  ).toEqual({
    id: moderation_id,
    organization_id: unicorn_organization_id,
    user_id: adora_pony_user_id,
    type: "",
    ticket_id: null,
    moderated_at: "2222-01-02 00:00:00+00",
    moderated_by: "Anais Tailhade <anais.tailhade@omage.gouv.fr>",
    comment:
      "7952428800000 anais.tailhade@omage.gouv.fr | Validé par anais.tailhade@omage.gouv.fr",
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
    created_at: "2222-01-02 00:00:00+00",
    has_been_greeted: false,
    is_external: true,
    needs_official_contact_email_verification: false,
    official_contact_email_verification_sent_at: null,
    official_contact_email_verification_token: null,
    organization_id: unicorn_organization_id,
    updated_at: "2222-01-02 00:00:00+00",
    user_id: adora_pony_user_id,
    verification_type: "domain",
    verified_at: null,
  });
});

async function given_moderation_42() {
  const unicorn_organization_id = await create_unicorn_organization(pg);
  const adora_pony_user_id = await create_adora_pony_user(pg);

  const moderation_id = await create_adora_pony_moderation(pg, { type: "" });
  setSystemTime(new Date("2222-01-02T00:00:00.000Z"));

  return {
    adora_pony_user_id,
    moderation_id,
    unicorn_organization_id,
  };
}
