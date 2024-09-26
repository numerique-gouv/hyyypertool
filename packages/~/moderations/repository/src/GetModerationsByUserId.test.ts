//

import {
  create_adora_pony_moderation,
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/moncomptepro.database/seed/unicorn";
import { empty_database, migrate, pg } from "@~/moncomptepro.database/testing";
import { beforeAll, beforeEach, expect, setSystemTime, test } from "bun:test";
import { GetModerationsByUserId } from "./GetModerationsByUserId";

//

beforeAll(migrate);
beforeEach(empty_database);

beforeAll(() => {
  setSystemTime(new Date("2222-01-01T00:00:00.000Z"));
});

//

test("get adora's moderations", async () => {
  const organization_id = await create_unicorn_organization(pg);
  const adora_pony_user_id = await create_adora_pony_user(pg);
  const moderation_id = await create_adora_pony_moderation(pg, { type: "🦷" });

  const get_moderations_by_user_id = GetModerationsByUserId({ pg });
  const moderations = await get_moderations_by_user_id(adora_pony_user_id);

  expect(moderations).toEqual([
    {
      comment: null,
      created_at: "2222-01-01 00:00:00+00",
      id: moderation_id,
      moderated_at: null,
      moderated_by: null,
      organization_id,
      ticket_id: null,
      type: "🦷",
      user_id: adora_pony_user_id,
    },
  ]);
});
