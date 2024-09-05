//

import { NotFoundError } from "@~/app.core/error";
import { z_username } from "@~/app.core/schema/z_username";
import type { AgentConnect_UserInfo } from "@~/app.middleware/session";
import { to as await_to } from "await-to-js";
import consola from "consola";
import type { RejectedMessage } from "../context/rejected";
import type { create_and_send_email_to_user_fn } from "./create_and_send_email_to_user";
import type { respond_to_ticket_fn } from "./respond_to_ticket";

//

export function send_rejected_message_to_user_usecase(
  create_and_send_email_to_user: create_and_send_email_to_user_fn,
  email: string,
  respond_to_ticket: respond_to_ticket_fn,
  userinfo: AgentConnect_UserInfo,
) {
  return async function send_rejected_message_to_user({
    message: text_body,
    subject,
  }: RejectedMessage) {
    const username = z_username.parse(userinfo);
    const body = text_body.concat(`  \n\n${username}`);
    const to = email;

    const [error] = await await_to(
      respond_to_ticket({ message: body, subject, to }),
    );
    if (error instanceof NotFoundError) {
      consola.info(error);
      await create_and_send_email_to_user({
        message: body,
        subject,
        to,
      });
    }
  };
}
