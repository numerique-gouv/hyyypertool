//

import { create_unicorn_organization } from "@~/moncomptepro.database/seed/unicorn";
import { empty_database, migrate, pg } from "@~/moncomptepro.database/testing";
import { beforeAll, beforeEach, expect, setSystemTime, test } from "bun:test";

//

beforeAll(() => {
  setSystemTime(new Date("2222-01-01T00:00:00.000Z"));
});
beforeAll(migrate);
beforeEach(empty_database);

//

test("should add a domain", async () => {
  const unicorn_organization_id = await create_unicorn_organization(pg);

  const domain_unicorn = await pg.query.email_domains.findFirst({
    where: (table, { eq }) => eq(table.domain, "unicorn.xyz"),
  });

  expect(domain_unicorn).toEqual({
    id: expect.any(Number),
    organization_id: unicorn_organization_id,
    domain: "unicorn.xyz",
    verification_type: "verified",
    can_be_suggested: true,
    verified_at: null,
    created_at: "2222-01-01 00:00:00+00",
    updated_at: "2222-01-01 00:00:00+00",
  });
});
