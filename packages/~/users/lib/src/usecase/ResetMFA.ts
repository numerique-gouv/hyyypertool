//

import {
  schema,
  type MonCompteProDatabaseCradle,
} from "@~/moncomptepro.database";
import { eq } from "drizzle-orm";

//

export function ResetMFA({ pg }: MonCompteProDatabaseCradle) {
  return async function reset_mfa(user_id: number) {
    await pg
      .delete(schema.authenticators)
      .where(eq(schema.authenticators.user_id, user_id));

    await pg
      .update(schema.users)
      .set({
        email_verified: false,
        encrypted_password: null,
        encrypted_totp_key: null,
        force_2fa: false,
        totp_key_verified_at: null,
      })
      .where(eq(schema.users.id, user_id));
  };
}

export type ResetMFAHandler = ReturnType<typeof ResetMFA>;

export type reset_mfa_dto = Awaited<ReturnType<ResetMFAHandler>>;
