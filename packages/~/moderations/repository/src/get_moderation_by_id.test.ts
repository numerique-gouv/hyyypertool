//

import {
  create_adora_pony_moderation,
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/moncomptepro.database/seed/unicorn";
import { empty_database, migrate, pg } from "@~/moncomptepro.database/testing";
import { beforeAll, expect, setSystemTime, test } from "bun:test";
import { GetModerationById } from "./get_moderation_by_id";

//

beforeAll(migrate);
beforeAll(empty_database);

beforeAll(() => {
  setSystemTime(new Date("2222-01-01T00:00:00.000Z"));
});

//

test("get a moderation ", async () => {
  const organization_id = await create_unicorn_organization(pg);
  const user_id = await create_adora_pony_user(pg);
  const moderation_id = await create_adora_pony_moderation(pg, { type: "" });

  const get_moderation_by_id = GetModerationById({ pg });
  const moderation = await get_moderation_by_id(moderation_id, {
    columns: {
      id: true,
      created_at: true,
      moderated_at: true,
      user_id: true,
      organization_id: true,
    },
  });

  expect(moderation).toEqual({
    created_at: "2222-01-01 00:00:00+00",
    id: moderation_id,
    moderated_at: null,
    organization_id,
    user_id,
  });
});
