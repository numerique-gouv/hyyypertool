//

import { send_moderation_processed_email } from ":legacy/services/mcp_admin_api";
import { MODERATION_EVENTS } from ":moderations/event";
import {
  Main_Layout,
  userinfo_to_username,
  type Main_Layout_Props,
} from ":ui/layout/main";
import { zValidator } from "@hono/zod-validator";
import type { Htmx_Header } from "@~/app.core/htmx";
import { Entity_Schema } from "@~/app.core/schema";
import type { Csp_Context } from "@~/app.middleware/csp_headers";
import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import type { UserInfo_Context } from "@~/app.middleware/vip_list.guard";
import { schema } from "@~/moncomptepro.database";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
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

export const moderation_router = new Hono<
  UserInfo_Context & MonComptePro_Pg_Context
>()
  .route("", moderation_page_route)
  .route("/email", moderation_email_router)
  .patch(
    "/rejected",
    zValidator("param", Entity_Schema),
    async ({ text, req, var: { moncomptepro_pg, userinfo } }) => {
      const { id } = req.valid("param");

      await moncomptepro_pg
        .update(schema.moderations)
        .set({
          moderated_at: new Date(),
          moderated_by: userinfo.email,
        })
        .where(eq(schema.moderations.id, id));

      return text("OK", 200, {
        "HX-Trigger": MODERATION_EVENTS.Enum.MODERATION_UPDATED,
      } as Htmx_Header);
    },
  )
  .patch(
    "/processed",
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
  )
  .patch(
    "/reprocess",
    zValidator("param", Entity_Schema),
    async ({ text, req, var: { moncomptepro_pg } }) => {
      const { id } = req.valid("param");

      await moncomptepro_pg
        .update(schema.moderations)
        .set({ moderated_at: null, moderated_by: null })
        .where(eq(schema.moderations.id, id));

      return text("OK", 200, {
        "HX-Trigger": MODERATION_EVENTS.Enum.MODERATION_UPDATED,
      } as Htmx_Header);
    },
  );
