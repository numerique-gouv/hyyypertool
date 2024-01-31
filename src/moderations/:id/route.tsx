//

import type { UserInfo_Context } from ":auth/vip_list.guard";
import type { Csp_Context } from ":common/csp_headers";
import env from ":common/env";
import type { Htmx_Header } from ":common/htmx";
import { Entity_Schema } from ":common/schema";
import type { Session_Context } from ":common/session";
import { moncomptepro_pg, schema } from ":database:moncomptepro";
import { moncomptepro_pg_database } from ":database:moncomptepro/middleware";
import { send_moderation_processed_email } from ":legacy/services/mcp_admin_api";
import {
  GROUP_MONCOMPTEPRO_SENDER_ID,
  get_full_ticket,
  send_zammad_mail,
} from ":legacy/services/zammad_api";
import { MODERATION_EVENTS } from ":moderations/event";
import {
  Main_Layout,
  userinfo_to_username,
  type Main_Layout_Props,
} from ":ui/layout/main";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { z } from "zod";
import {
  EMAIL_SUBJECT_INPUT_ID,
  ListZammadArticles,
  RESPONSE_TEXTAREA_ID,
} from "./03";
import { moderation_comment_router } from "./comment/route";
import { Moderation_Page } from "./page";

//

export const moderation_page_route = new Hono<Session_Context & Csp_Context>()
  .use("/", jsxRenderer(Main_Layout, { docType: true }))
  .get(
    "/",
    zValidator("param", Entity_Schema),
    function GET({ redirect, render, req, var: { nonce, session } }) {
      const userinfo = session.get("userinfo");
      if (!userinfo) return redirect("/");
      const username = userinfo_to_username(userinfo);
      const { id } = req.valid("param");
      return render(<Moderation_Page active_id={id} />, {
        nonce,
        username,
      } as Main_Layout_Props);
    },
  );

export const moderation_router = new Hono<UserInfo_Context>()
  .route("", moderation_page_route)
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
    async ({ text, req, notFound, var: { userinfo } }) => {
      const { id: moderation_id } = req.valid("param");
      const username = userinfo_to_username(userinfo);
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

      const result = await get_full_ticket({
        ticket_id: moderation.ticket_id,
      });
      const user = Object.values(result.assets.User || {}).find((user) => {
        return user.email === userinfo.email;
      });

      await send_zammad_mail({
        body: body.concat(`\n${username}`).replace(/\n/g, "<br />"),
        sender_id: GROUP_MONCOMPTEPRO_SENDER_ID,
        state: "closed",
        subject,
        ticket_id: moderation.ticket_id,
        to: moderation.users.email,
        owner_id: user?.id,
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
