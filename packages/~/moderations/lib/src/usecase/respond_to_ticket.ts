//

import { NotFoundError } from "@~/app.core/error";
import { userinfo_to_username } from "@~/app.layout";
import { get_user, is_crisp_ticket, send_message } from "@~/crisp.lib";
import { get_full_ticket, send_zammad_response } from "@~/zammad.lib";
import {
  ARTICLE_TYPE,
  GROUP_MONCOMPTEPRO,
  GROUP_MONCOMPTEPRO_SENDER_ID,
} from "@~/zammad.lib/const";
import { is_zammad_ticket } from "@~/zammad.lib/is_zammad_ticket";
import { to as await_to } from "await-to-js";
import { match } from "ts-pattern";
import type {
  RejectedFullMessage,
  RejectedModeration_Context,
} from "../context/rejected";

//

export async function respond_to_ticket(
  context: RejectedModeration_Context,
  full_message: RejectedFullMessage,
) {
  return match(context.moderation.ticket_id)
    .with(null, () => {
      throw new NotFoundError("No existing ticket.");
    })
    .when(is_crisp_ticket, () => respond_in_conversation(context, full_message))
    .when(is_zammad_ticket, () =>
      respond_to_zammad_ticket(context, full_message),
    )
    .otherwise(() => {
      throw new NotFoundError(
        `Unknown provider for "${context.moderation.id}"`,
      );
    });
}

async function respond_in_conversation(
  { crisp_config, moderation, userinfo }: RejectedModeration_Context,
  { message }: RejectedFullMessage,
) {
  if (!moderation.ticket_id) throw new NotFoundError("Ticket not found.");

  const [, found_user] = await await_to(
    get_user(crisp_config, { email: userinfo.email }),
  );
  const user = found_user ?? {
    nickname: userinfo_to_username(userinfo),
    email: userinfo.email,
  };

  await send_message(crisp_config, {
    content: message,
    user,
    session_id: moderation.ticket_id,
  });
}

async function respond_to_zammad_ticket(
  { moderation, userinfo }: RejectedModeration_Context,
  { message, subject, to }: RejectedFullMessage,
) {
  if (!moderation.ticket_id) throw new NotFoundError("Ticket not found.");

  const ticket_id = Number(moderation.ticket_id);

  const result = await get_full_ticket({
    ticket_id,
  });

  const user = Object.values(result.assets.User || {}).find((user) => {
    return user.email === userinfo.email;
  });

  const body = message.replace(/\n/g, "<br />");

  await send_zammad_response(ticket_id, {
    article: {
      body,
      content_type: "text/html",
      sender_id: GROUP_MONCOMPTEPRO_SENDER_ID,
      subject,
      subtype: "reply",
      to,
      type_id: ARTICLE_TYPE.enum.EMAIL,
    },
    group: GROUP_MONCOMPTEPRO,
    owner_id: user?.id,
    state: "closed",
  });
}
