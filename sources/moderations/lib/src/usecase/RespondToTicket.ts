//

import { NotFoundError } from "@~/app.core/error";
import { z_username } from "@~/app.core/schema/z_username";
import { is_crisp_ticket } from "@~/crisp.lib";
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

export function RespondToTicket() {
  return async function respond_to_ticket(
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
  };
}

export type RespondToTicketHandler = ReturnType<typeof RespondToTicket>;

async function respond_in_conversation(
  {
    crisp,
    moderation,
    userinfo,
    resolve_delay,
  }: RejectedModeration_Context,
  { message }: { message: string },
) {
  if (!moderation.ticket_id) throw new NotFoundError("Ticket not found.");

  const [, found_user] = await await_to(
    crisp.get_user({ email: userinfo.email }),
  );
  const user = found_user ?? {
    nickname: z_username.parse(userinfo),
    email: userinfo.email,
  };

  await crisp.send_message({
    content: message,
    user,
    session_id: moderation.ticket_id,
  });

  // HACK(douglasduteil): Wait for the message to be sent
  // Crisp seems to have a delay between the message being sent and the state being updated
  await new Promise((resolve) => setTimeout(resolve, resolve_delay));

  await crisp.mark_conversation_as_resolved({ session_id: moderation.ticket_id });
}

async function respond_to_zammad_ticket(
  { moderation, userinfo }: RejectedModeration_Context,
  { message, subject, to }: { message: string; subject: string; to: string },
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
