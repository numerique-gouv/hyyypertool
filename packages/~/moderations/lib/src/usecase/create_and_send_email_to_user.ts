//

import { NotFoundError } from "@~/app.core/error";
import { z_username } from "@~/app.core/schema/z_username";
import { type create_conversation_fn } from "@~/crisp.lib/create_conversation";
import { update_moderation_by_id } from "@~/moderations.repository/update_moderation_by_id";
import type { MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import type { RejectedFullMessage } from "../context/rejected";
import { type respond_to_ticket_fn } from "./respond_to_ticket";

//

export function create_and_send_email_to_user_usecase(
  create_conversation: create_conversation_fn,
  moderation: { id: number; user_id: number },
  pg: MonComptePro_PgDatabase,
  respond_to_ticket: respond_to_ticket_fn,
) {
  return async function create_and_send_email_to_user({
    message,
    subject,
    to,
  }: RejectedFullMessage) {
    const user = await pg.query.users.findFirst({
      columns: { given_name: true, family_name: true },
      where: (table, { eq }) => eq(table.id, moderation.user_id),
    });
    if (!user) throw new NotFoundError(`User not found`);
    const nickname = z_username.parse({
      given_name: user.given_name,
      usual_name: user.family_name,
    });
    const { session_id } = await create_conversation({
      email: to,
      subject,
      nickname,
    });

    await update_moderation_by_id(pg, {
      moderation_id: moderation.id,
      ticket_id: session_id,
    });

    await respond_to_ticket({ message, subject, to: session_id });
  };
}

export type create_and_send_email_to_user_fn = ReturnType<
  typeof create_and_send_email_to_user_usecase
>;
