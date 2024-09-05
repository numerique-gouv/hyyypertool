//

import { zValidator } from "@hono/zod-validator";
import type { Htmx_Header } from "@~/app.core/htmx";
import { Entity_Schema } from "@~/app.core/schema";
import { create_conversation_shell } from "@~/crisp.lib/create_conversation";
import { get_user_shell } from "@~/crisp.lib/get_user";
import { send_message_shell } from "@~/crisp.lib/send_message";
import { set_crisp_config } from "@~/crisp.middleware";
import {
  RejectedMessage_Schema,
  type RejectedModeration_Context,
} from "@~/moderations.lib/context/rejected";
import { MODERATION_EVENTS } from "@~/moderations.lib/event";
import { create_and_send_email_to_user_usecase } from "@~/moderations.lib/usecase/create_and_send_email_to_user";
import { mark_moderation_as } from "@~/moderations.lib/usecase/mark_moderation_as";
import { respond_in_conversation_usecase } from "@~/moderations.lib/usecase/respond_in_conversation";
import { respond_to_ticket_usecase } from "@~/moderations.lib/usecase/respond_to_ticket";
import { respond_to_zammad_ticket_usecase } from "@~/moderations.lib/usecase/respond_to_zammad_ticket";
import { send_rejected_message_to_user_usecase } from "@~/moderations.lib/usecase/send_rejected_message_to_user";
import { get_moderation } from "@~/moderations.repository/get_moderation";
import { Hono } from "hono";
import type { ContextType } from "./context";

//

export default new Hono<ContextType>().patch(
  "/",
  set_crisp_config(),
  zValidator("param", Entity_Schema),
  zValidator("form", RejectedMessage_Schema),
  async function PATH({
    text,
    req,
    var: { moncomptepro_pg, userinfo, crisp_config },
  }) {
    const { id: moderation_id } = req.valid("param");
    const { message, subject } = req.valid("form");

    const moderation = await get_moderation(moncomptepro_pg, { moderation_id });
    const context: RejectedModeration_Context = {
      crisp_config,
      moderation,
      pg: moncomptepro_pg,
      userinfo,
    };

    const respond_in_conversation = respond_in_conversation_usecase(
      get_user_shell(crisp_config),
      send_message_shell(crisp_config),
      String(moderation.ticket_id),
      userinfo,
    );
    const respond_to_zammad_ticket = respond_to_zammad_ticket_usecase(
      Number(moderation.ticket_id),
      userinfo,
    );
    const respond_to_ticket = respond_to_ticket_usecase(
      respond_in_conversation,
      respond_to_zammad_ticket,
      moderation.ticket_id,
    );
    const create_and_send_email_to_user = create_and_send_email_to_user_usecase(
      create_conversation_shell(crisp_config),
      moderation,
      moncomptepro_pg,
      respond_to_ticket,
    );
    const send_rejected_message_to_user = send_rejected_message_to_user_usecase(
      create_and_send_email_to_user,
      moderation.user.email,
      respond_to_ticket,
      userinfo,
    );

    await send_rejected_message_to_user({ message, subject });

    await mark_moderation_as(context, "REJECTED");

    return text("OK", 200, {
      "HX-Trigger": MODERATION_EVENTS.Enum.MODERATION_UPDATED,
    } as Htmx_Header);
  },
);
