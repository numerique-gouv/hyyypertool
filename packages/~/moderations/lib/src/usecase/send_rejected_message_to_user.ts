import { NotFoundError } from "@~/app.core/error";
import { userinfo_to_username } from "@~/app.layout";
import { to as await_to } from "await-to-js";
import consola from "consola";
import type {
  RejectedMessage,
  RejectedModeration_Context,
} from "../context/rejected";
import { create_and_send_email_to_user } from "./create_and_send_email_to_user";
import { respond_to_ticket } from "./respond_to_ticket";

//

export async function send_rejected_message_to_user(
  context: RejectedModeration_Context,
  { message: text_body, subject }: RejectedMessage,
) {
  const { moderation, userinfo } = context;
  const username = userinfo_to_username(userinfo);
  const body = text_body.concat(`  \n\n${username}`);
  const to = moderation.user.email;

  const [error] = await await_to(
    respond_to_ticket(context, { message: body, subject, to }),
  );
  if (error instanceof NotFoundError) {
    consola.info(error);
    await create_and_send_email_to_user(context, {
      message: body,
      subject,
      to,
    });
  }
}
