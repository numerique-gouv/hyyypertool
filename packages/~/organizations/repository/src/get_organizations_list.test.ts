//

import { create_cactus_organization } from "@~/moncomptepro.database/seed/captus";
import { create_unicorn_organization } from "@~/moncomptepro.database/seed/unicorn";
import { create_zombie_organization } from "@~/moncomptepro.database/seed/zombie";
import { empty_database, migrate, pg } from "@~/moncomptepro.database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { get_organizations_list } from "./get_organizations_list";

//

beforeAll(migrate);
beforeEach(empty_database);

//

test("returns no organizations", async () => {
  const result = await get_organizations_list(pg, {});
  expect(result).toMatchSnapshot();
});

test("returns 1 organization", async () => {
  await create_unicorn_organization(pg);
  const result = await get_organizations_list(pg, {});
  expect(result).toMatchSnapshot();
});

test("returns 3 organizations", async () => {
  await create_cactus_organization(pg);
  await create_unicorn_organization(pg);
  await create_zombie_organization(pg);

  const result = await get_organizations_list(pg, {});

  expect(result).toMatchSnapshot();
});

test("search 🦄 libelle", async () => {
  await create_cactus_organization(pg);
  await create_unicorn_organization(pg);
  await create_zombie_organization(pg);

  const result = await get_organizations_list(pg, {
    search: "🦄 libelle",
  });

  expect(result).toMatchSnapshot();
});

test("search 🦄 siret", async () => {
  await create_cactus_organization(pg);
  await create_unicorn_organization(pg);
  await create_zombie_organization(pg);

  const result = await get_organizations_list(pg, {
    search: "🦄 siret",
  });

  expect(result).toMatchSnapshot();
});
