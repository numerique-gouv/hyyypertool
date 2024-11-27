//

import { schema } from "@~/moncomptepro.database";
import { create_pink_diamond_user } from "@~/moncomptepro.database/seed/unicorn";
import { empty_database, migrate, pg } from "@~/moncomptepro.database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { eq } from "drizzle-orm";
import { ResetMFA } from "./ResetMFA";

//

beforeAll(migrate);
beforeEach(empty_database);

const reset_mfa = ResetMFA({ pg });

//

test("reset user MFA", async () => {
  const pink_diamond_user_id = await create_pink_diamond_user(pg);
  await pg
    .update(schema.users)
    .set({ email_verified: true, encrypted_password: "🔑", force_2fa: true })
    .where(eq(schema.users.id, pink_diamond_user_id));

  await reset_mfa(pink_diamond_user_id);

  const result = await pg.query.users.findFirst({
    columns: {
      email_verified: true,
      encrypted_password: true,
      encrypted_totp_key: true,
      force_2fa: true,
      id: true,
      totp_key_verified_at: true,
    },
    where: eq(schema.users.id, pink_diamond_user_id),
  });

  expect(result).toEqual({
    email_verified: false,
    encrypted_password: null,
    encrypted_totp_key: null,
    force_2fa: false,
    id: pink_diamond_user_id,
    totp_key_verified_at: null,
  });
});
