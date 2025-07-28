//

import {
  create_pink_diamond_user,
  create_red_diamond_user,
  create_unicorn_organization,
} from "@~/identite-proconnect.database/seed/unicorn";
import {
  add_user_to_organization,
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect.database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { count_gmail_members } from "./count_gmail_members";

//

beforeAll(migrate);
beforeEach(empty_database);

test("returns pink diamond", async () => {
  const unicorn_organization_id = await create_unicorn_organization(pg);
  const pink_diamond_user_id = await create_pink_diamond_user(pg);
  await add_user_to_organization({
    organization_id: unicorn_organization_id,
    user_id: pink_diamond_user_id,
  });
  const red_diamond_user_id = await create_red_diamond_user(pg);
  await add_user_to_organization({
    organization_id: unicorn_organization_id,
    user_id: red_diamond_user_id,
  });

  const emails = await count_gmail_members(pg, {
    siret: "🦄",
    domain: "@unicorn.xyz",
  });

  expect(emails).toEqual([
    {
      email: "pink.diamond@unicorn.xyz",
      organization: {
        cached_libelle: "🦄 libelle",
        siret: "🦄 siret",
      },
    },
    {
      email: "red.diamond@unicorn.xyz",
      organization: {
        cached_libelle: "🦄 libelle",
        siret: "🦄 siret",
      },
    },
  ]);
});
