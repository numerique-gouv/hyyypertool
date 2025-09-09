//

import {
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/identite-proconnect.database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect.database/testing";
import { beforeAll, beforeEach, expect, setSystemTime, test } from "bun:test";
import { get_organizations_by_user_id } from "./get_organizations_by_user_id";

//

beforeAll(migrate);
beforeEach(empty_database);

beforeAll(() => {
  setSystemTime(new Date("2222-01-01T00:00:00.000Z"));
});

//

test("get organizations for a user", async () => {
  const organization_id = await create_unicorn_organization(pg);
  const user_id = await create_adora_pony_user(pg);

  const result = await get_organizations_by_user_id(pg, {
    user_id,
  });

  expect(result.count).toBeGreaterThan(0);
  expect(result.organizations).toHaveLength(result.count);
  expect(result.organizations[0]).toMatchObject({
    id: organization_id,
    siret: expect.any(String),
    cached_libelle: expect.any(String),
    verification_type: expect.any(String),
  });
});

test("returns empty result for user with no organizations", async () => {
  const user_id = await create_adora_pony_user(pg);

  const result = await get_organizations_by_user_id(pg, {
    user_id,
  });

  expect(result.count).toBe(0);
  expect(result.organizations).toEqual([]);
});

test("supports pagination", async () => {
  const user_id = await create_adora_pony_user(pg);
  
  // Create multiple organizations for the user
  await create_unicorn_organization(pg);
  await create_unicorn_organization(pg);

  const page1 = await get_organizations_by_user_id(pg, {
    user_id,
    pagination: { page: 0, page_size: 1 },
  });

  expect(page1.organizations).toHaveLength(1);
  expect(page1.count).toBeGreaterThanOrEqual(1);
});

test("returns empty for non-existent user", async () => {
  const result = await get_organizations_by_user_id(pg, {
    user_id: 999999,
  });

  expect(result.count).toBe(0);
  expect(result.organizations).toEqual([]);
});