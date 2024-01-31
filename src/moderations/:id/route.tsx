//

import type { UserInfo_Context } from ":auth/vip_list.guard";
import type { Csp_Context } from ":common/csp_headers";
import type { Htmx_Header } from ":common/htmx";
import { Entity_Schema } from ":common/schema";
import { moncomptepro_pg, schema } from ":database:moncomptepro";
import { send_moderation_processed_email } from ":legacy/services/mcp_admin_api";
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
import { moderation_comment_router } from "./comment/route";
import { moderation_email_router } from "./email/route";
import { Moderation_Page } from "./page";

//

export const moderation_page_route = new Hono<UserInfo_Context & Csp_Context>()
  .use("/", jsxRenderer(Main_Layout, { docType: true }))
  .get(
    "/",
    zValidator("param", Entity_Schema),
    function GET({ render, req, var: { nonce, userinfo } }) {
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
  .route("/email", moderation_email_router)
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
