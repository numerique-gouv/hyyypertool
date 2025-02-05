//

import { anais_tailhade } from "@~/app.middleware/set_userinfo#fixture";
import { crisp } from "@~/crisp.lib/api#mock";
import { schema } from "@~/moncomptepro.database";
import { create_pink_diamond_user } from "@~/moncomptepro.database/seed/unicorn";
import { empty_database, migrate, pg } from "@~/moncomptepro.database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { eq } from "drizzle-orm";
import { ResetPassword } from "./ResetPassword";

//

beforeAll(migrate);
beforeEach(empty_database);

const reset_password = ResetPassword({ crisp, pg, resolve_delay: 0 });

//

test("reset user password", async () => {
  const pink_diamond_user_id = await create_pink_diamond_user(pg);
  await pg
    .update(schema.users)
    .set({ email_verified: true, encrypted_password: "🔑", force_2fa: true })
    .where(eq(schema.users.id, pink_diamond_user_id));

  await reset_password({
    moderator: anais_tailhade,
    user_id: pink_diamond_user_id,
  });

  const result = await pg.query.users.findFirst({
    columns: {
      email_verified: true,
      id: true,
      totp_key_verified_at: true,
    },
    where: eq(schema.users.id, pink_diamond_user_id),
  });

  expect(result).toEqual({
    email_verified: true,
    id: pink_diamond_user_id,
    totp_key_verified_at: null,
  });

  expect(crisp.create_conversation).toHaveBeenCalledWith({
    email: "pink.diamond@unicorn.xyz",
    subject:
      "[ProConnect] - Instructions pour la réinitialisation du mot de passe",
    nickname: "Pink Diamond",
  });
  expect(crisp.get_user).toHaveBeenCalledWith({
    email: "anais.tailhade@omage.gouv.fr",
  });
  expect(crisp.send_message).toHaveBeenCalledWith({
    content: expect.stringContaining(
      "Nous avons réinitialisé votre mot de passe",
    ),
    session_id: "🗨️",
    user: {
      nickname: "👩‍🚀",
    },
  });
  expect(crisp.mark_conversation_as_resolved).toHaveBeenCalledWith({
    session_id: "🗨️",
  });
});
