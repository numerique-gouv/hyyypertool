//

import { create_pink_diamond_user } from "@~/moncomptepro.database/seed/unicorn";
import { empty_database, migrate, pg } from "@~/moncomptepro.database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { ImportCoopAccount } from "./ImportCoopAccount";

//

beforeAll(migrate);
beforeEach(empty_database);

const import_coop_account = ImportCoopAccount({ pg });

//

test("returns no new account", async () => {
  const pink_diamond_user_id = await create_pink_diamond_user(pg);

  const resutlt = await import_coop_account(pink_diamond_user_id);

  expect(resutlt).toBe(0);
});
