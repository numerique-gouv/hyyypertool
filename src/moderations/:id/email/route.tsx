//

import type { UserInfo_Context } from ":auth/vip_list.guard";
import type { Htmx_Header } from ":common/htmx";
import { Entity_Schema } from ":common/schema";
import { schema } from ":database:moncomptepro";
import type { moncomptepro_pg_Context } from ":database:moncomptepro/middleware";
import {
  GROUP_MONCOMPTEPRO_SENDER_ID,
  get_full_ticket,
  send_zammad_mail,
} from ":legacy/services/zammad_api";
import { MODERATION_EVENTS } from ":moderations/event";
import { userinfo_to_username } from ":ui/layout/main";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { EMAIL_SUBJECT_INPUT_ID, RESPONSE_TEXTAREA_ID } from "../03";
import { ListZammadArticles } from "./ListZammadArticles";

//

export const moderation_email_router = new Hono<
  UserInfo_Context & moncomptepro_pg_Context
>()
  .get(
    "/",
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
    "/",
    zValidator("param", Entity_Schema),
    zValidator(
      "form",
      z.object({
        [EMAIL_SUBJECT_INPUT_ID]: z.string().trim(),
        [RESPONSE_TEXTAREA_ID]: z.string().trim(),
      }),
    ),
    async ({ text, req, notFound, var: { userinfo, moncomptepro_pg } }) => {
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
  );
