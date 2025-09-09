//

import {
  create_adora_pony_user,
} from "@~/identite-proconnect.database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect.database/testing";
import { beforeAll, beforeEach, expect, setSystemTime, test } from "bun:test";
import { get_user_by_id } from "./get_user_by_id";

//

beforeAll(migrate);
beforeEach(empty_database);

beforeAll(() => {
  setSystemTime(new Date("2222-01-01T00:00:00.000Z"));
});

//

test("get user by id", async () => {
  const user_id = await create_adora_pony_user(pg);

  const user = await get_user_by_id(pg, { id: user_id });

  expect(user).toMatchObject({
    id: user_id,
    email: "adora@princesses-of-power.etheria",
    given_name: "Adora",
    family_name: "Grayskull",
    job: expect.any(String),
    phone_number: expect.any(String),
    email_verified: expect.any(Boolean),
    sign_in_count: expect.any(Number),
    created_at: "2222-01-01 00:00:00+00",
  });

  // Verify all expected columns are present
  expect(user).toHaveProperty("updated_at");
  expect(user).toHaveProperty("last_sign_in_at");
  expect(user).toHaveProperty("reset_password_sent_at");
  expect(user).toHaveProperty("verify_email_sent_at");
  expect(user).toHaveProperty("totp_key_verified_at");
});

test("returns null for non-existent user", async () => {
  const user = await get_user_by_id(pg, { id: 999999 });

  expect(user).toBeNull();
});