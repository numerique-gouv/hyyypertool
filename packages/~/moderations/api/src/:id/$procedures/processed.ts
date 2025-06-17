//

import { zValidator } from "@hono/zod-validator";
import type { Htmx_Header } from "@~/app.core/htmx";
import { Entity_Schema } from "@~/app.core/schema";
import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import type { UserInfoVariables_Context } from "@~/app.middleware/set_userinfo";
import { MODERATION_EVENTS } from "@~/moderations.lib/event";
import { mark_moderatio_as_rejected } from "@~/moderations.lib/usecase/mark_moderatio_as_rejected";
import { get_moderation } from "@~/moderations.repository/get_moderation";
import { Hono } from "hono";

//

export default new Hono<
  MonComptePro_Pg_Context & UserInfoVariables_Context
>().patch(
  "/",
  zValidator("param", Entity_Schema),
  async ({ text, req, notFound, var: { moncomptepro_pg, userinfo } }) => {
    const { id } = req.valid("param");

    const moderation = await get_moderation(moncomptepro_pg, {
      moderation_id: id,
    });

    if (!moderation) return notFound();

    await mark_moderatio_as_rejected({
      pg: moncomptepro_pg,
      moderation,
      userinfo,
      reason: "DUPLICATE",
    });

    return text("OK", 200, {
      "HX-Trigger": [
        MODERATION_EVENTS.Enum.MODERATION_EMAIL_UPDATED,
        MODERATION_EVENTS.Enum.MODERATION_UPDATED,
      ].join(", "),
    } as Htmx_Header);
  },
);
