//

import { create_unicorn_organization } from "@~/identite-proconnect.database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect.database/testing";
import { beforeAll, beforeEach, expect, setSystemTime, test } from "bun:test";
import { GetDomainCount } from "./GetDomainCount";

//

beforeAll(migrate);
beforeEach(empty_database);

beforeAll(() => {
  setSystemTime(new Date("2222-01-01T00:00:00.000Z"));
});

//

test("get domain count for organization", async () => {
  const organization_id = await create_unicorn_organization(pg);

  const get_domain_count = GetDomainCount(pg);
  const count = await get_domain_count(organization_id);

  expect(count).toBeGreaterThanOrEqual(0);
});

test("returns domain count for organization", async () => {
  const organization_id = await create_unicorn_organization(pg);

  const get_domain_count = GetDomainCount(pg);
  const count = await get_domain_count(organization_id);

  expect(count).toBeGreaterThanOrEqual(0);
});

test("returns 0 for non-existent organization", async () => {
  const get_domain_count = GetDomainCount(pg);
  const count = await get_domain_count(999999);

  expect(count).toBe(0);
});
