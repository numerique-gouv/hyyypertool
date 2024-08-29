//

import { create_conversation } from "@~/crisp.lib";
import { update_moderation_by_id } from "@~/moderations.repository/update_moderation_by_id";
import type {
  RejectedFullMessage,
  RejectedModeration_Context,
} from "../context/rejected";
import { respond_to_ticket } from "./respond_to_ticket";

//

export async function create_and_send_email_to_user(
  context: RejectedModeration_Context,
  { message, subject, to }: RejectedFullMessage,
) {
  const { crisp_config, moderation, pg } = context;
  const { session_id } = await create_conversation(crisp_config, {
    email: to,
    subject,
  });

  await respond_to_ticket(context, { message, subject, to: session_id });

  await update_moderation_by_id(pg, {
    moderation_id: moderation.id,
    ticket_id: session_id,
  });
}
