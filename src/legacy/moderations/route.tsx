//

import env from ":common/env";
import type { Htmx_Header } from ":common/htmx";
import { Entity_Schema } from ":common/schema";
import { moncomptepro_pg, schema } from ":database:moncomptepro";
import { moncomptepro_pg_database } from ":database:moncomptepro/middleware";
import { send_moderation_processed_email } from ":legacy/services/mcp_admin_api";
import { send_zammad_mail } from ":legacy/services/zammad_api";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import {
  EMAIL_SUBJECT_INPUT_ID,
  ListZammadArticles,
  RESPONSE_TEXTAREA_ID,
} from "./03";
import { moderation_comment_router } from "./comment/route";
import { MODERATION_EVENTS } from "./event";

//

const moderation_router = new Hono()
  .basePath("/:id")
  .route("/comment", moderation_comment_router)
  .get(
    "/email",
    moncomptepro_pg_database({ connectionString: env.DATABASE_URL }),
    zValidator("param", Entity_Schema),
    async ({ html, notFound, req, var: { moncomptepro_pg } }) => {
      const { id: moderation_id } = req.valid("param");
      const moderation = await moncomptepro_pg.query.moderations.findFirst({
        where: eq(schema.moderations.id, moderation_id),
        with: {
          organizations: true,
          users: true,
        },
      });

      if (!moderation) return notFound();
      return html(<ListZammadArticles moderation={moderation} />);
    },
  )
  .put(
    "/email",
    zValidator("param", Entity_Schema),
    zValidator(
      "form",
      z.object({
        [EMAIL_SUBJECT_INPUT_ID]: z.string().trim(),
        [RESPONSE_TEXTAREA_ID]: z.string().trim(),
      }),
    ),
    async ({ text, req, notFound }) => {
      const { id: moderation_id } = req.valid("param");
      const {
        [EMAIL_SUBJECT_INPUT_ID]: subject,
        [RESPONSE_TEXTAREA_ID]: body,
      } = req.valid("form");

      const moderation = await moncomptepro_pg.query.moderations.findFirst({
        where: eq(schema.moderations.id, moderation_id),
        with: {
          organizations: true,
          users: true,
        },
      });

      if (!moderation) return notFound();
      if (!moderation.ticket_id) return notFound();

      await send_zammad_mail({
        body: body.replace(/\n/g, "<br />"),
        subject,
        ticket_id: moderation.ticket_id,
        state: "closed",
      });

      return text("OK", 200, {
        "HX-Trigger": MODERATION_EVENTS.Enum.MODERATION_EMAIL_UPDATED,
      } as Htmx_Header);
    },
  )
  .patch(
    "/rejected",
    zValidator("param", Entity_Schema),
    async ({ text, req }) => {
      const { id } = req.valid("param");

      await moncomptepro_pg
        .update(schema.moderations)
        .set({
          moderated_at: new Date(),
        })
        .where(eq(schema.moderations.id, id));

      return text("OK", 200, {
        "HX-Trigger": MODERATION_EVENTS.Enum.MODERATION_EMAIL_UPDATED,
      } as Htmx_Header);
    },
  )
  .patch(
    "/processed",
    zValidator("param", Entity_Schema),
    async ({ text, req, notFound }) => {
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
        })
        .where(eq(schema.moderations.id, id));

      return text("OK", 200, {
        "HX-Trigger": MODERATION_EVENTS.Enum.MODERATION_EMAIL_UPDATED,
      } as Htmx_Header);
    },
  );

export const moderations_router = new Hono().route("", moderation_router);
