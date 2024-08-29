//

import {
  create_adora_pony_moderation,
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/moncomptepro.database/seed/unicorn";
import { empty_database, migrate, pg } from "@~/moncomptepro.database/testing";
import { beforeAll, expect, setSystemTime, test } from "bun:test";
import { update_moderation_by_id } from "./update_moderation_by_id";

//

beforeAll(migrate);
beforeAll(empty_database);

beforeAll(() => {
  setSystemTime(new Date("2222-01-01T00:00:00.000Z"));
});

//

test("update a moderation", async () => {
  const organization_id = await create_unicorn_organization(pg);
  const user_id = await create_adora_pony_user(pg);
  const moderation_id = await create_adora_pony_moderation(pg, { type: "" });

  setSystemTime(new Date("2222-01-02T00:00:00.000Z"));
  await update_moderation_by_id(pg, {
    moderation_id,
    comment: "Adora is a good pony",
    moderated_by: "Captain Midnight",
    moderated_at: new Date().toISOString(),
  });

  expect(
    await pg.query.moderations.findFirst({
      where: (table, { eq }) => eq(table.id, moderation_id),
    }),
  ).toEqual({
    comment: "Adora is a good pony",
    created_at: "2222-01-01 00:00:00+00",
    id: expect.any(Number),
    moderated_at: "2222-01-02 00:00:00+00",
    moderated_by: "Captain Midnight",
    organization_id,
    ticket_id: null,
    type: "",
    user_id,
  });
});
