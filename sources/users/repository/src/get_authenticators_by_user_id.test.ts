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

  expect(authenticators).toMatchInlineSnapshot(`
    [
      {
        "created_at": "2023-06-23 03:33:33+00",
        "credential_id": "1",
        "display_name": "1Password",
        "last_used_at": "2023-06-24 04:44:44+00",
        "usage_count": 5,
      },
    ]
  `);
});

test("should returns two authenticators & structure of authenticators", async () => {
  const pink_diamond_user_id = await create_pink_diamond_user(pg);

  await insert_1Password_authenticator(pg, pink_diamond_user_id);
  await insert_nordPass_authenticator(pg, pink_diamond_user_id);

  const authenticators =
    await get_authenticators_by_user_id(pink_diamond_user_id);

  expect(authenticators).toMatchInlineSnapshot(`
    [
      {
        "created_at": "2023-06-23 03:33:33+00",
        "credential_id": "1",
        "display_name": "1Password",
        "last_used_at": "2023-06-24 04:44:44+00",
        "usage_count": 5,
      },
      {
        "created_at": "2023-06-23 13:33:33+00",
        "credential_id": "2",
        "display_name": "NordPass",
        "last_used_at": "2023-06-24 14:44:44+00",
        "usage_count": 87,
      },
    ]
  `);
});

test("should returns zero authenticator", async () => {
  const pink_diamond_user_id = await create_pink_diamond_user(pg);

  const authenticators =
    await get_authenticators_by_user_id(pink_diamond_user_id);

  expect(authenticators).toHaveLength(0);
});
