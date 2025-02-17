//

import { schema } from "@~/moncomptepro.database";
import { create_unicorn_organization } from "@~/moncomptepro.database/seed/unicorn";
import { empty_database, migrate, pg } from "@~/moncomptepro.database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { get_domain_count } from "./get_domain_count";

//

beforeAll(migrate);
beforeEach(empty_database);

//

test("returns no member", async () => {
  const domain_unicorn = await get_domain_count(pg, {
    organization_id: 666,
  });

  expect(domain_unicorn).toEqual(0);
});

test("returns 1 member", async () => {
  const unicorn_organization_id = await create_unicorn_organization(pg);

  const domain_unicorn = await get_domain_count(pg, {
    organization_id: unicorn_organization_id,
  });

  expect(domain_unicorn).toBe(1);
});

test("returns 3 domains", async () => {
  const unicorn_organization_id = await create_unicorn_organization(pg);
  await pg.insert(schema.email_domains).values({
    domain: "bi.corn",
    organization_id: unicorn_organization_id,
  });
  await pg.insert(schema.email_domains).values({
    domain: "xorn.corn",
    organization_id: unicorn_organization_id,
  });

  const domain_unicorn = await get_domain_count(pg, {
    organization_id: unicorn_organization_id,
  });

  expect(domain_unicorn).toBe(3);
});
