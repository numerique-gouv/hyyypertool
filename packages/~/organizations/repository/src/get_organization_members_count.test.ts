//

import { create_cactus_organization } from "@~/moncomptepro.database/seed/captus";
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
import { GetOrganizationMembersCount } from "./get_organization_members_count";

//

beforeAll(migrate);
beforeEach(empty_database);

//

const get_organization_members_count = GetOrganizationMembersCount({
  pg,
});

test("returns no member", async () => {
  const unicorn_organization_id = await create_unicorn_organization(pg);

  const domain_unicorn = await get_organization_members_count({
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

  const domain_unicorn = await get_organization_members_count({
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

  const domain_unicorn = await get_organization_members_count({
    organization_id: unicorn_organization_id,
  });

  expect(domain_unicorn).toEqual(3);
});
