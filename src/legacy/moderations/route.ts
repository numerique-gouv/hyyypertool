//

import type { Htmx_Header } from ":common/htmx";
import { Id_Schema } from ":common/schema";
import { moncomptepro_pg, schema } from ":database:moncomptepro";
import { sendModerationProcessedEmail } from ":legacy/services/mcp_admin_api";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

//

const moderation_router = new Hono()
  .basePath("/:id")
  .patch(
    "/processed",
    zValidator("param", Id_Schema),
    async ({ text, req, notFound }) => {
      const { id } = req.valid("param");

      const moderation = await moncomptepro_pg.query.moderations.findFirst({
        where: eq(schema.moderations.id, id),
        with: {
          organizations: true,
          users: true,
        },
      });

      if (!moderation) return notFound();

      const { organization_id, user_id } = moderation;

      await sendModerationProcessedEmail({ organization_id, user_id });
      await moncomptepro_pg
        .update(schema.moderations)
        .set({
          moderated_at: new Date(),
        })
        .where(eq(schema.moderations.id, id));

      return text("OK", 200, {
        "HX-Location": "/legacy",
      } as Htmx_Header);
    },
  );

export const moderations_router = new Hono().route("", moderation_router);
