//

import {
  schema,
  type IdentiteProconnect_PgDatabase,
} from "@~/identite-proconnect.database";
import { eq } from "drizzle-orm";

//

export function GetUserById(pg: IdentiteProconnect_PgDatabase) {
  return async function get_user_by_id(id: number) {
    return pg.query.users.findFirst({
      columns: {
        created_at: true,
        email_verified: true,
        email: true,
        family_name: true,
        given_name: true,
        id: true,
        job: true,
        last_sign_in_at: true,
        phone_number: true,
        reset_password_sent_at: true,
        sign_in_count: true,
        updated_at: true,
        verify_email_sent_at: true,
        totp_key_verified_at: true,
      },
      where: eq(schema.users.id, id),
    });
  };
}

export type GetUserByIdHandler = ReturnType<typeof GetUserById>;
export type GetUserByIdDto = Awaited<ReturnType<GetUserByIdHandler>>;