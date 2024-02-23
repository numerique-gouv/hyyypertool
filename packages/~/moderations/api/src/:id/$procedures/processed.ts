//

import { zValidator } from "@hono/zod-validator";
import type { Htmx_Header } from "@~/app.core/htmx";
import { Entity_Schema } from "@~/app.core/schema";
import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import type { UserInfo_Context } from "@~/app.middleware/vip_list.guard";
import { MODERATION_EVENTS } from "@~/moderations.lib/event";
import { schema } from "@~/moncomptepro.database";
import { send_moderation_processed_email } from "@~/moncomptepro.lib/index";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

//

export default new Hono<MonComptePro_Pg_Context & UserInfo_Context>().patch(
  "/",
  zValidator("param", Entity_Schema),
  async ({ text, req, notFound, var: { moncomptepro_pg, userinfo } }) => {
    const { id } = req.valid("param");

    const moderation = await moncomptepro_pg.query.moderations.findFirst({
      where: eq(schema.moderations.id, id),
    });

    if (!moderation) return notFound();

    const { organization_id, user_id } = moderation;

    await send_moderation_processed_email({ organization_id, user_id });
    await moncomptepro_pg
      .update(schema.moderations)
      .set({
        moderated_at: new Date(),
        moderated_by: userinfo.email,
      })
      .where(eq(schema.moderations.id, id));

    return text("OK", 200, {
      "HX-Trigger": [
        MODERATION_EVENTS.Enum.MODERATION_EMAIL_UPDATED,
        MODERATION_EVENTS.Enum.MODERATION_UPDATED,
      ].join(", "),
    } as Htmx_Header);
  },
);
