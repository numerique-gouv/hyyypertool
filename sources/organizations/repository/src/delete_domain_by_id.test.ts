//

import { create_unicorn_organization } from "@~/identite-proconnect.database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect.database/testing";
import { beforeAll, expect, test } from "bun:test";
import { delete_domain_by_id } from "./delete_domain_by_id";

//

beforeAll(migrate);
beforeAll(empty_database);

//

test("should delete a domain", async () => {
  const unicorn_organization_id = await create_unicorn_organization(pg);

  const { id: domain_id } = await pg.query.email_domains
    .findFirst({
      where: (table, { eq }) =>
        eq(table.organization_id, unicorn_organization_id),
    })
    .then((domain) => domain!);

  await delete_domain_by_id(pg, domain_id);

  expect(
    await pg.query.email_domains.findFirst({
      where: (table, { eq }) => eq(table.id, domain_id),
    }),
  ).toBeUndefined();
});
