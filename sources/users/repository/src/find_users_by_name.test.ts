//

import {
  create_adora_pony_user,
  create_pink_diamond_user,
} from "@~/identite-proconnect.database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect.database/testing";
import { beforeAll, beforeEach, expect, setSystemTime, test } from "bun:test";
import { find_users_by_name } from "./find_users_by_name";

//

beforeAll(migrate);
beforeEach(empty_database);

beforeAll(() => {
  setSystemTime(new Date("2222-01-01T00:00:00.000Z"));
});

//

test("find users by given name", async () => {
  const adora_id = await create_adora_pony_user(pg);
  await create_pink_diamond_user(pg);

  const users = await find_users_by_name(pg, { name: "Adora" });

  expect(users).toHaveLength(1);
  expect(users[0]).toMatchObject({
    id: adora_id,
    given_name: "Adora",
    family_name: "Grayskull",
    email: "adora@princesses-of-power.etheria",
  });
});

test("find users by family name", async () => {
  const adora_id = await create_adora_pony_user(pg);
  await create_pink_diamond_user(pg);

  const users = await find_users_by_name(pg, { name: "Grayskull" });

  expect(users).toHaveLength(1);
  expect(users[0]).toMatchObject({
    id: adora_id,
    family_name: "Grayskull",
  });
});

test("search is case insensitive", async () => {
  const adora_id = await create_adora_pony_user(pg);

  const users = await find_users_by_name(pg, { name: "adora" });

  expect(users).toHaveLength(1);
  expect(users[0].id).toBe(adora_id);
});

test("returns empty array when no matches found", async () => {
  await create_adora_pony_user(pg);

  const users = await find_users_by_name(pg, { name: "NonExistent" });

  expect(users).toEqual([]);
});

test("finds multiple users with similar names", async () => {
  await create_adora_pony_user(pg);
  await create_pink_diamond_user(pg);

  // This should find users where either given_name or family_name matches
  const users = await find_users_by_name(pg, { name: "%a%" });

  expect(users.length).toBeGreaterThan(0);
});