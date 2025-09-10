//

import { NotFoundError } from "@~/app.core/error";
import { create_adora_pony_user } from "@~/identite-proconnect.database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect.database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { GetUserById } from "./GetUserById";

//

beforeAll(migrate);
beforeEach(empty_database);

test("returns user with specified columns", async () => {
  const user_id = await create_adora_pony_user(pg);

  const get_user_by_id = GetUserById(pg, {
    columns: {
      id: true,
      email: true,
      given_name: true,
      family_name: true,
    },
  });
  const result = await get_user_by_id(user_id);

  expect(result).toMatchInlineSnapshot(`
{
  "email": "adora.pony@unicorn.xyz",
  "family_name": "Pony",
  "given_name": "Adora",
  "id": ${user_id},
}
`);
});

test("returns user with name columns only", async () => {
  const user_id = await create_adora_pony_user(pg);

  const get_user_by_id = GetUserById(pg, {
    columns: { given_name: true, family_name: true },
  });
  const result = await get_user_by_id(user_id);

  expect(result).toMatchInlineSnapshot(`
{
  "family_name": "Pony",
  "given_name": "Adora",
}
`);
});

test("returns user with single column when specified", async () => {
  const user_id = await create_adora_pony_user(pg);

  const get_user_by_id = GetUserById(pg, {
    columns: { email: true },
  });
  const result = await get_user_by_id(user_id);

  expect(result).toMatchInlineSnapshot(`
{
  "email": "adora.pony@unicorn.xyz",
}
`);
});

test("throws NotFoundError when user not found", async () => {
  const get_user_by_id = GetUserById(pg, {
    columns: { id: true, email: true },
  });

  await expect(async () => await get_user_by_id(999999)).toThrow(NotFoundError);
});

test("returns user with specific columns using snapshots", async () => {
  const user_id = await create_adora_pony_user(pg);

  const get_user_by_id = GetUserById(pg, {
    columns: { id: true, email: true, given_name: true, family_name: true },
  });
  const result = await get_user_by_id(user_id);

  expect(result).toMatchInlineSnapshot(`
{
  "email": "adora.pony@unicorn.xyz",
  "family_name": "Pony",
  "given_name": "Adora",
  "id": ${user_id},
}
`);
});
