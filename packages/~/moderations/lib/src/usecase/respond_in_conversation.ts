//

import { NotFoundError } from "@~/app.core/error";
import { z_username } from "@~/app.core/schema/z_username";
import type { AgentConnect_UserInfo } from "@~/app.middleware/session";
import type { get_user_by_email_fn } from "@~/crisp.lib/get_user";
import type { send_message_fn } from "@~/crisp.lib/send_message";
import await_to from "await-to-js";
import type { RejectedFullMessage } from "../context/rejected";

//

export function respond_in_conversation_usecase(
  get_user: get_user_by_email_fn,
  send_message: send_message_fn,
  session_id: string,
  userinfo: AgentConnect_UserInfo,
) {
  return async function respond_in_conversation({
    message,
  }: RejectedFullMessage) {
    if (!session_id) throw new NotFoundError("Ticket not found.");

    const [, found_user] = await await_to(get_user(userinfo.email));
    const user = found_user ?? {
      nickname: z_username.parse(userinfo),
      email: userinfo.email,
    };

    await send_message({
      content: message,
      user,
      session_id,
    });
  };
}

export type respond_in_conversation_fn = ReturnType<
  typeof respond_in_conversation_usecase
>;
