//

import {
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
import { beforeAll, beforeEach, expect, setSystemTime, test } from "bun:test";
import { get_users_by_organization_id } from "./get_users_by_organization_id";

//

beforeAll(migrate);
beforeEach(empty_database);

beforeAll(() => {
  setSystemTime(new Date("2222-01-01T00:00:00.000Z"));
});

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

  const emails = await get_users_by_organization_id(pg, {
    organization_id: unicorn_organization_id,
  });

  expect(emails).toEqual({
    count: 2,
    users: [
      {
        email: "red.diamond@unicorn.xyz",
        family_name: "Diamond",
        given_name: "Red",
        id: red_diamond_user_id,
        job: null,
        verification_type: null,
        is_external: false,
      },
      {
        email: "pink.diamond@unicorn.xyz",
        family_name: "Diamond",
        given_name: "Pink",
        id: pink_diamond_user_id,
        job: null,
        verification_type: null,
        is_external: false,
      },
    ],
  });
});
