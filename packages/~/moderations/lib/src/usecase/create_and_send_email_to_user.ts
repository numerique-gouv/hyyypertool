//

import { NotFoundError } from "@~/app.core/error";
import { userinfo_to_username } from "@~/app.layout";
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
  const user = await pg.query.users.findFirst({
    columns: { given_name: true, family_name: true },
    where: (table, { eq }) => eq(table.id, moderation.user_id),
  });
  if (!user) throw new NotFoundError(`User not found`);
  const nickname = userinfo_to_username({
    given_name: user.given_name ?? "",
    usual_name: user.family_name ?? "",
  });
  const { session_id } = await create_conversation(crisp_config, {
    email: to,
    subject,
    nickname,
  });

  await update_moderation_by_id(pg, {
    moderation_id: moderation.id,
    ticket_id: session_id,
  });

  await respond_to_ticket(
    {
      ...context,
      moderation: { ...context.moderation, ticket_id: session_id },
    },
    { message, subject, to: session_id },
  );
}
