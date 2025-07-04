//

import { schema } from "@~/identite-proconnect.database";
import { create_unicorn_organization } from "@~/identite-proconnect.database/seed/unicorn";
import { create_zombie_organization } from "@~/identite-proconnect.database/seed/zombie";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect.database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { get_domains } from "./get_domains";

//

beforeAll(migrate);
beforeEach(empty_database);

//

test("returns no domains", async () => {
  const domain_unicorn = await get_domains(pg, {
    organization_id: 666,
  });

  expect(domain_unicorn).toEqual([]);
});

test("returns 1 member", async () => {
  const unicorn_organization_id = await create_unicorn_organization(pg);

  const domain_unicorn = await get_domains(pg, {
    organization_id: unicorn_organization_id,
  });

  expect(domain_unicorn).toMatchInlineSnapshot(`
    [
      {
        "domain": "unicorn.xyz",
      },
    ]
  `);
});

test("returns 3 domains", async () => {
  await create_zombie_organization(pg);
  const unicorn_organization_id = await create_unicorn_organization(pg);
  await pg.insert(schema.email_domains).values({
    domain: "bi.corn",
    organization_id: unicorn_organization_id,
  });
  await pg.insert(schema.email_domains).values({
    domain: "xorn.corn",
    organization_id: unicorn_organization_id,
  });

  const domain_unicorn = await get_domains(pg, {
    organization_id: unicorn_organization_id,
  });

  expect(domain_unicorn).toMatchInlineSnapshot(`
    [
      {
        "domain": "bi.corn",
      },
      {
        "domain": "unicorn.xyz",
      },
      {
        "domain": "xorn.corn",
      },
    ]
  `);
});
