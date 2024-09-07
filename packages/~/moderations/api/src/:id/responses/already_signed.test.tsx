//

import { set_moncomptepro_pg } from "@~/app.middleware/set_moncomptepro_pg";
import {
  create_adora_pony_user,
  create_pink_diamond_user,
  create_red_diamond_user,
  create_unicorn_organization,
} from "@~/moncomptepro.database/seed/unicorn";
import {
  add_user_to_organization,
  empty_database,
  migrate,
  pg,
} from "@~/moncomptepro.database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { type ContextType } from "../context";
import type { GetModeration } from "../repository";
import already_signed from "./already_signed";

//

beforeAll(migrate);
beforeEach(empty_database);

test("returns all members", async () => {
  const unicorn_organization_id = await given_unicorn_organization();

  const app = new Hono<ContextType>()
    .use("*", jsxRenderer())
    .use("*", set_moncomptepro_pg(pg))
    .get(
      "/already_signed",
      ({ set }, next) => {
        set("domain", "unicorn.xyz");
        set("moderation", {
          organization: { cached_libelle: "🦄", id: unicorn_organization_id },
          user: { family_name: "🧟" },
        } as Awaited<ReturnType<GetModeration>>);
        set("organization_member", { is_external: false });
        return next();
      },
      ({ render }) => {
        return render(<AlreadySigned />);
      },
    );

  const res = await app.fetch(
    new Request("http://localhost:3000/already_signed"),
  );
  expect(res.status).toBe(200);
  expect(await res.text()).toMatchSnapshot();
});

test("returns Diamond members", async () => {
  const unicorn_organization_id = await given_unicorn_organization();

  const app = new Hono<ContextType>()
    .use("*", jsxRenderer())
    .use("*", set_moncomptepro_pg(pg))
    .get(
      "/already_signed",
      ({ set }, next) => {
        set("domain", "unicorn.xyz");
        set("moderation", {
          organization: { cached_libelle: "🦄", id: unicorn_organization_id },
          user: { family_name: "🧟" },
        } as Awaited<ReturnType<GetModeration>>);
        set("organization_member", { is_external: false });
        return next();
      },
      ({ render }) => {
        return render(<AlreadySigned />);
      },
    );

  const res = await app.fetch(
    new Request("http://localhost:3000/already_signed"),
  );
  expect(res.status).toBe(200);
  expect(await res.text()).toMatchSnapshot();
});

async function given_unicorn_organization() {
  const unicorn_organization_id = await create_unicorn_organization(pg);
  const adora_pony_user_id = await create_adora_pony_user(pg);
  await add_user_to_organization({
    organization_id: unicorn_organization_id,
    user_id: adora_pony_user_id,
  });
  const pink_diamond_user_id = await create_pink_diamond_user(pg);
  await add_user_to_organization({
    organization_id: unicorn_organization_id,
    user_id: pink_diamond_user_id,
  });
  const red_diamond_user_id = await create_red_diamond_user(pg);
  await add_user_to_organization({
    organization_id: unicorn_organization_id,
    user_id: red_diamond_user_id,
  });
  return unicorn_organization_id;
}

async function AlreadySigned() {
  return <>{await already_signed()}</>;
}
