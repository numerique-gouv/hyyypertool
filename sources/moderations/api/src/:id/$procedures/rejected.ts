//

import { zValidator } from "@hono/zod-validator";
import type { Htmx_Header } from "@~/app.core/htmx";
import { Entity_Schema } from "@~/app.core/schema";
import { set_crisp_config } from "@~/crisp.middleware";
import { type RejectedModeration_Context } from "@~/moderations.lib/context/rejected";
import { MODERATION_EVENTS } from "@~/moderations.lib/event";
import { reject_form_schema } from "@~/moderations.lib/schema/rejected.form";
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
  zValidator("form", reject_form_schema),
  async function PATH({
    text,
    req,
    var: { identite_pg, userinfo, crisp_config, config },
  }) {
    const { id: moderation_id } = req.valid("param");
    const { message, reason, subject } = req.valid("form");

    const moderation = await get_moderation(identite_pg, { moderation_id });
    const context: RejectedModeration_Context = {
      crisp_config,
      moderation,
      pg: identite_pg,
      resolve_delay: config.CRISP_RESOLVE_DELAY,
      reason,
      subject,
      userinfo,
    };
    await send_rejected_message_to_user(context, {
      message,
      reason,
      subject,
    });

    await mark_moderation_as(context, "REJECTED");

    return text("OK", 200, {
      "HX-Trigger": MODERATION_EVENTS.Enum.MODERATION_UPDATED,
    } as Htmx_Header);
  },
);
