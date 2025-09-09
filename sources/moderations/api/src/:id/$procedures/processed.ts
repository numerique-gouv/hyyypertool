//

import { zValidator } from "@hono/zod-validator";
import type { Htmx_Header } from "@~/app.core/htmx";
import { Entity_Schema } from "@~/app.core/schema";
import type { IdentiteProconnect_Pg_Context } from "@~/app.middleware/set_identite_pg";
import type { UserInfoVariables_Context } from "@~/app.middleware/set_userinfo";
import { MODERATION_EVENTS } from "@~/moderations.lib/event";
import { mark_moderatio_as_rejected } from "@~/moderations.lib/usecase/mark_moderatio_as_rejected";
import { GetModeration } from "@~/moderations.repository";
import { Hono } from "hono";

//

export default new Hono<
  IdentiteProconnect_Pg_Context & UserInfoVariables_Context
>().patch(
  "/",
  zValidator("param", Entity_Schema),
  async ({ text, req, notFound, var: { identite_pg, userinfo } }) => {
    const { id } = req.valid("param");

    const get_moderation = await GetModeration(identite_pg);
    const moderation = await get_moderation(id);

    if (!moderation) return notFound();

    await mark_moderatio_as_rejected({
      pg: identite_pg,
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
