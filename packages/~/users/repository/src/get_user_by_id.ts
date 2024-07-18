//

import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { eq } from "drizzle-orm";

//

export async function get_user_by_id(
  pg: MonComptePro_PgDatabase,
  { id }: { id: number },
) {
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
    },
    where: eq(schema.users.id, id),
  });
}

export type get_user_by_id_dto = Awaited<ReturnType<typeof get_user_by_id>>;
