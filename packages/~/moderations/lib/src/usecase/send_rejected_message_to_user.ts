import { NotFoundError } from "@~/app.core/error";
import { z_username } from "@~/app.core/schema/z_username";
import { to as await_to } from "await-to-js";
import consola from "consola";
import type { RejectedModeration_Context } from "../context/rejected";
import type { RejectedMessage } from "../schema/rejected.form";
import { create_and_send_email_to_user } from "./create_and_send_email_to_user";
import { respond_to_ticket } from "./respond_to_ticket";

//

export async function send_rejected_message_to_user(
  context: RejectedModeration_Context,
  { message: text_body, reason, subject }: RejectedMessage,
) {
  const { moderation, userinfo } = context;
  const username = z_username.parse(userinfo);
  const body = text_body.concat(`  \n\n${username}`);
  const to = moderation.user.email;

  const [error] = await await_to(
    respond_to_ticket(context, { message: body, reason, subject, to }),
  );
  if (error instanceof NotFoundError) {
    consola.info(error);
    await create_and_send_email_to_user(context, {
      message: body,
      reason,
      subject,
      to,
    });
  }
}
