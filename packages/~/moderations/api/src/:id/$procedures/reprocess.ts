//

import { zValidator } from "@hono/zod-validator";
import type { Htmx_Header } from "@~/app.core/htmx";
import { Entity_Schema } from "@~/app.core/schema";
import type { App_Context } from "@~/app.middleware/context";
import { MODERATION_EVENTS } from "@~/moderations.lib/event";
import { schema } from "@~/moncomptepro.database";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { comment_message } from "./comment_message";

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
    await moncomptepro_pg
      .update(schema.moderations)
      .set({
        comment: [
          ...(comment ? [comment] : []),
          comment_message({
            type: "REPROCESSED",
            created_by: userinfo.email,
          }),
        ].join("\n"),
        moderated_at: null,
        moderated_by: null,
      })
      .where(eq(schema.moderations.id, id));

    return text("OK", 200, {
      "HX-Trigger": MODERATION_EVENTS.Enum.MODERATION_UPDATED,
    } as Htmx_Header);
  },
);
