//

import { zValidator } from "@hono/zod-validator";
import type { Htmx_Header } from "@~/app.core/htmx";
import { Entity_Schema } from "@~/app.core/schema";
import type { App_Context } from "@~/app.middleware/context";
import { append_comment } from "@~/moderations.lib/comment_message";
import { MODERATION_EVENTS } from "@~/moderations.lib/event";
import { update_moderation_by_id } from "@~/moderations.repository/update_moderation_by_id";
import { schema } from "@~/moncomptepro.database";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

//

export default new Hono<App_Context>().patch(
  "/",
  zValidator("param", Entity_Schema),
  async ({ text, req, notFound, var: { moncomptepro_pg, userinfo } }) => {
    const { id } = req.valid("param");
    const moderation = await moncomptepro_pg.query.moderations.findFirst({
      columns: { comment: true },
      where: eq(schema.moderations.id, id),
    });
    if (!moderation) return notFound();
    const { comment } = moderation;

    await update_moderation_by_id(moncomptepro_pg, {
      comment: append_comment(comment, {
        type: "REPROCESSED",
        created_by: userinfo.email,
      }),
      moderation_id: id,
      moderated_by: null,
      moderated_at: null,
    });

    return text("OK", 200, {
      "HX-Trigger": MODERATION_EVENTS.Enum.MODERATION_UPDATED,
    } as Htmx_Header);
  },
);
