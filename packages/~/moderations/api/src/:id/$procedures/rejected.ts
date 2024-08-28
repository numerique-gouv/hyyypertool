//

import { zValidator } from "@hono/zod-validator";
import type { Htmx_Header } from "@~/app.core/htmx";
import { Entity_Schema } from "@~/app.core/schema";
import { set_crisp_config } from "@~/crisp.middleware";
import {
  RejectedMessage_Schema,
  type RejectedModeration_Context,
} from "@~/moderations.lib/context/rejected";
import { MODERATION_EVENTS } from "@~/moderations.lib/event";
import { mark_moderation_as } from "@~/moderations.lib/usecase/mark_moderation_as";
import { send_rejected_message_to_user } from "@~/moderations.lib/usecase/send_rejected_message_to_user";
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
    await send_rejected_message_to_user(context, { message, subject });

    await mark_moderation_as(context, "REJECTED");

    return text("OK", 200, {
      "HX-Trigger": MODERATION_EVENTS.Enum.MODERATION_UPDATED,
    } as Htmx_Header);
  },
);
