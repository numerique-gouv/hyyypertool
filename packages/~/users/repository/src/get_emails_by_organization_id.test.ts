//

import {
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
import { get_emails_by_organization_id } from "./get_emails_by_organization_id";

//

beforeAll(migrate);
beforeEach(empty_database);

test("returns pink diamond", async () => {
  const unicorn_organization_id = await create_unicorn_organization(pg);
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

  const emails = await get_emails_by_organization_id(pg, {
    organization_id: unicorn_organization_id,
    family_name: "Diamond",
  });

  expect(emails).toEqual([
    { email: "pink.diamond@unicorn.xyz" },
    { email: "red.diamond@unicorn.xyz" },
  ]);
});
