//

import { create_cactus_organization } from "@~/identite-proconnect.database/seed/captus";
import {
  create_adora_pony_user,
  create_pink_diamond_user,
  create_red_diamond_user,
  create_unicorn_organization,
} from "@~/identite-proconnect.database/seed/unicorn";
import {
  add_user_to_organization,
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect.database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { count_organization_members } from "./count_organization_members";

//

beforeAll(migrate);
beforeEach(empty_database);

//

test("returns no member", async () => {
  const unicorn_organization_id = await create_unicorn_organization(pg);

  const domain_unicorn = await count_organization_members(pg, {
    organization_id: unicorn_organization_id,
  });

  expect(domain_unicorn).toEqual(0);
});

test("returns 1 member", async () => {
  await create_cactus_organization(pg);
  const unicorn_organization_id = await create_unicorn_organization(pg);
  await add_user_to_organization({
    organization_id: unicorn_organization_id,
    user_id: await create_pink_diamond_user(pg),
  });

  const domain_unicorn = await count_organization_members(pg, {
    organization_id: unicorn_organization_id,
  });

  expect(domain_unicorn).toEqual(1);
});

test("returns 3 member", async () => {
  await create_cactus_organization(pg);
  const unicorn_organization_id = await create_unicorn_organization(pg);
  await add_user_to_organization({
    organization_id: unicorn_organization_id,
    user_id: await create_pink_diamond_user(pg),
  });
  await add_user_to_organization({
    organization_id: unicorn_organization_id,
    user_id: await create_adora_pony_user(pg),
  });
  await add_user_to_organization({
    organization_id: unicorn_organization_id,
    user_id: await create_red_diamond_user(pg),
  });

  const domain_unicorn = await count_organization_members(pg, {
    organization_id: unicorn_organization_id,
  });

  expect(domain_unicorn).toEqual(3);
});
