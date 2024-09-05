//

import { NotFoundError } from "@~/app.core/error";
import type { AgentConnect_UserInfo } from "@~/app.middleware/session";
import { get_full_ticket, send_zammad_response } from "@~/zammad.lib";
import {
  ARTICLE_TYPE,
  GROUP_MONCOMPTEPRO,
  GROUP_MONCOMPTEPRO_SENDER_ID,
} from "@~/zammad.lib/const";
import type { RejectedFullMessage } from "../context/rejected";

//

export function respond_to_zammad_ticket_usecase(
  ticket_id: number,
  userinfo: AgentConnect_UserInfo,
) {
  return async function respond_to_zammad_ticket({
    message,
    subject,
    to,
  }: RejectedFullMessage) {
    if (!Number.isNaN(ticket_id)) throw new NotFoundError("Ticket not found.");

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
  };
}

export type respond_to_zammad_ticket_fn = ReturnType<
  typeof respond_to_zammad_ticket_usecase
>;
