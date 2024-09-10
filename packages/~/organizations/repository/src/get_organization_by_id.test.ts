//

import { create_unicorn_organization } from "@~/moncomptepro.database/seed/unicorn";
import { empty_database, migrate, pg } from "@~/moncomptepro.database/testing";
import { beforeAll, expect, setSystemTime, test } from "bun:test";
import { GetOrganizationById } from "./get_organization_by_id";

//

beforeAll(migrate);
beforeAll(empty_database);

beforeAll(() => {
  setSystemTime(new Date("2222-01-01T00:00:00.000Z"));
});

//

test("get an organization", async () => {
  const organization_id = await create_unicorn_organization(pg);

  const get_organization_by_id = GetOrganizationById({ pg });
  const organization = await get_organization_by_id(organization_id, {
    columns: {
      id: true,
      cached_libelle: true,
    },
  });

  expect(organization).toEqual({
    id: organization_id,
    cached_libelle: "🦄 libelle",
  });
});
