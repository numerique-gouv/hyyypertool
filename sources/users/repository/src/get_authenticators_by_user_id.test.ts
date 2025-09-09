//

import { insert_nordPass_authenticator } from "@~/identite-proconnect.database/seed/authenticators/nordPass";
import { insert_1Password_authenticator } from "@~/identite-proconnect.database/seed/authenticators/onePassword";
import { create_pink_diamond_user } from "@~/identite-proconnect.database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect.database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { GetAuthenticatorByUserId } from "./GetAuthenticatorByUserId";

//

beforeAll(migrate);
beforeEach(empty_database);

const get_authenticators_by_user_id = GetAuthenticatorByUserId(pg);
test("should returns one authenticator", async () => {
  const pink_diamond_user_id = await create_pink_diamond_user(pg);

  await insert_1Password_authenticator(pg, pink_diamond_user_id);

  const authenticators =
    await get_authenticators_by_user_id(pink_diamond_user_id);

  expect(authenticators).toHaveLength(1);
});

test("should returns two authenticators & structure of authenticators", async () => {
  const pink_diamond_user_id = await create_pink_diamond_user(pg);

  await insert_1Password_authenticator(pg, pink_diamond_user_id);
  await insert_nordPass_authenticator(pg, pink_diamond_user_id);

  const authenticators =
    await get_authenticators_by_user_id(pink_diamond_user_id);

  expect(authenticators).toHaveLength(2);
  expect(authenticators).toEqual([
    {
      display_name: "1Password",
      created_at: expect.any(String),
      last_used_at: expect.any(String),
      usage_count: expect.any(Number),
    },
    {
      display_name: "NordPass",
      created_at: expect.any(String),
      last_used_at: expect.any(String),
      usage_count: expect.any(Number),
    },
  ]);
});

test("should returns zero authenticator", async () => {
  const pink_diamond_user_id = await create_pink_diamond_user(pg);

  const authenticators =
    await get_authenticators_by_user_id(pink_diamond_user_id);

  expect(authenticators).toHaveLength(0);
});
