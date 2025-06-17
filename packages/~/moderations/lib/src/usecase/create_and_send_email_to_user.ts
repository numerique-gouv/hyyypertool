//

import { NotFoundError } from "@~/app.core/error";
import { z_username } from "@~/app.core/schema/z_username";
import { create_conversation } from "@~/crisp.lib";
import { UpdateModerationById } from "@~/moderations.repository";
import type {
  RejectedFullMessage,
  RejectedModeration_Context,
} from "../context/rejected";
import { respond_to_ticket } from "./respond_to_ticket";

//

export async function create_and_send_email_to_user(
  context: RejectedModeration_Context,
  { message, reason, subject, to }: RejectedFullMessage,
) {
  const { crisp_config, moderation, pg } = context;
  const user = await pg.query.users.findFirst({
    columns: { given_name: true, family_name: true },
    where: (table, { eq }) => eq(table.id, moderation.user_id),
  });
  if (!user) throw new NotFoundError(`User not found`);
  const nickname = z_username.parse({
    given_name: user.given_name,
    usual_name: user.family_name,
  });
  const { session_id } = await create_conversation(crisp_config, {
    email: to,
    subject,
    nickname,
  });

  const update_moderation_by_id = UpdateModerationById({ pg });
  await update_moderation_by_id(moderation.id, {
    ticket_id: session_id,
  });

  await respond_to_ticket(
    {
      ...context,
      moderation: { ...context.moderation, ticket_id: session_id },
    },
    { message, reason, subject, to: session_id },
  );
}
