//

import { set_moncomptepro_pg } from "@~/app.middleware/set_moncomptepro_pg";
import { schema } from "@~/moncomptepro.database";
import { empty_database, migrate, pg } from "@~/moncomptepro.database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import {
  ModerationPage_Context,
  type get_moderation_dto,
  type get_organization_member_dto,
} from "../context";
import already_signed from "./already_signed";

//

let unicorn_organization_id: number;

//

beforeAll(migrate);
beforeEach(empty_database);
beforeEach(async function create_unicorn_organization() {
  const [{ id: organization_id }] = await pg
    .insert(schema.organizations)
    .values({
      authorized_email_domains: [],
      external_authorized_email_domains: [],
      siret: "",
      trackdechets_email_domains: [],
      verified_email_domains: [],
    })
    .returning({ id: schema.organizations.id });

  unicorn_organization_id = organization_id;
});

beforeEach(async function create_adora_user() {
  const [{ id: user_id }] = await pg
    .insert(schema.users)
    .values({
      created_at: new Date().toISOString(),
      email: "adora@uni.corn",
      updated_at: new Date().toISOString(),
    })
    .returning({ id: schema.users.id });

  await pg.insert(schema.users_organizations).values({
    organization_id: unicorn_organization_id,
    user_id,
  });
});

beforeEach(async function create_bella_user() {
  const [{ id: user_id }] = await pg
    .insert(schema.users)
    .values({
      created_at: new Date().toISOString(),
      email: "bella@uni.corn",
      updated_at: new Date().toISOString(),
    })
    .returning({ id: schema.users.id });

  await pg.insert(schema.users_organizations).values({
    organization_id: unicorn_organization_id,
    user_id,
  });
});

test("returns signed member emails", async () => {
  const app = new Hono()
    .use("*", jsxRenderer())
    .use("*", set_moncomptepro_pg(pg))
    .get("/already_signed", ({ render }) => {
      const domain = "uni.corn";
      const moderation = {
        organization: { cached_libelle: "🦄", id: unicorn_organization_id },
      } as get_moderation_dto;
      const organization_member = {} as get_organization_member_dto;

      return render(
        <ModerationPage_Context.Provider
          value={{ domain, moderation, organization_member }}
        >
          <AlreadySigned />
        </ModerationPage_Context.Provider>,
      );
    });
  const res = await app.fetch(
    new Request("http://localhost:3000/already_signed"),
  );
  expect(res.status).toBe(200);
  expect(await res.text()).toMatchSnapshot();
});

async function AlreadySigned() {
  return <>{await already_signed()}</>;
}
