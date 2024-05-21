//

import { zValidator } from "@hono/zod-validator";
import { NotFoundError } from "@~/app.core/error";
import type { Htmx_Header } from "@~/app.core/htmx";
import { Entity_Schema } from "@~/app.core/schema";
import { userinfo_to_username } from "@~/app.layout";
import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import type { AgentConnect_UserInfo } from "@~/app.middleware/session";
import type { UserInfo_Context } from "@~/app.middleware/vip_list.guard";
import { MODERATION_EVENTS } from "@~/moderations.lib/event";
import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import {
  get_full_ticket,
  send_zammad_new_email,
  send_zammad_response,
} from "@~/zammad.lib";
import {
  ARTICLE_TYPE,
  GROUP_MONCOMPTEPRO,
  GROUP_MONCOMPTEPRO_SENDER_ID,
  PRIORITY_TYPE,
} from "@~/zammad.lib/const";
import { to as await_to } from "await-to-js";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { comment_message } from "./comment_message";

//

const RejectedMessage_Schema = z.object({
  message: z.string().trim(),
  subject: z.string().trim(),
});

type RejectedMessage = z.TypeOf<typeof RejectedMessage_Schema>;

//

export default new Hono<MonComptePro_Pg_Context & UserInfo_Context>().patch(
  "/",
  zValidator("param", Entity_Schema),
  zValidator("form", RejectedMessage_Schema),
  async function PATH({ text, req, var: { moncomptepro_pg, userinfo } }) {
    const { id: moderation_id } = req.valid("param");
    const { message, subject } = req.valid("form");

    const moderation = await get_moderation(moncomptepro_pg, { moderation_id });

    await send_rejected_message_to_user(
      { moderation, pg: moncomptepro_pg, userinfo },
      { message, subject },
    );
    await mark_moderatio_as_rejected(moncomptepro_pg, {
      comment: moderation.comment,
      moderation_id,
      moderated_by: userinfo_to_username(userinfo),
    });

    return text("OK", 200, {
      "HX-Trigger": MODERATION_EVENTS.Enum.MODERATION_UPDATED,
    } as Htmx_Header);
  },
);

type RejectedModeration_Context = {
  moderation: get_moderation_dto;
  userinfo: AgentConnect_UserInfo;
  pg: MonComptePro_PgDatabase;
};

async function send_rejected_message_to_user(
  context: RejectedModeration_Context,
  { message: text_body, subject }: RejectedMessage,
) {
  const { moderation, userinfo } = context;
  const username = userinfo_to_username(userinfo);
  const body = text_body.concat(`\n${username}`).replace(/\n/g, "<br />");
  const to = moderation.user.email;
  const message = { message: body, subject, to };

  const [error] = await await_to(respond_to_ticket(context, message));
  if (error instanceof NotFoundError) {
    await create_and_send_email_to_user(context, message);
  }
}

type RejectedFullMessage = RejectedMessage & { to: string };

async function create_and_send_email_to_user(
  { moderation, pg }: RejectedModeration_Context,
  { message, subject, to }: RejectedFullMessage,
) {
  const ticket = await send_zammad_new_email({
    article: {
      body: message,
      sender_id: GROUP_MONCOMPTEPRO_SENDER_ID,
      to: moderation.user.email,
      content_type: "text/html",
      subject,
      type_id: ARTICLE_TYPE.enum.EMAIL,
      from: GROUP_MONCOMPTEPRO,
    },
    customer_id: `guess:${to}`,
    group: GROUP_MONCOMPTEPRO,
    owner_id: undefined,
    priority_id: PRIORITY_TYPE.enum.NORMAL,
    state: "closed",
    title: subject,
  });

  await pg
    .update(schema.moderations)
    .set({ ticket_id: ticket.id })
    .where(eq(schema.moderations.id, moderation.id));
}

async function respond_to_ticket(
  { moderation, userinfo }: RejectedModeration_Context,
  { message, subject, to }: RejectedFullMessage,
) {
  if (!moderation.ticket_id) throw new NotFoundError("Ticket not found.");

  const result = await get_full_ticket({
    ticket_id: moderation.ticket_id,
  });

  const user = Object.values(result.assets.User || {}).find((user) => {
    return user.email === userinfo.email;
  });

  await send_zammad_response(moderation.ticket_id, {
    article: {
      body: message,
      content_type: "text/html",
      sender_id: GROUP_MONCOMPTEPRO_SENDER_ID,
      subject,
      subtype: "reply",
      to,
      type_id: ARTICLE_TYPE.enum.EMAIL,
    },
    group: GROUP_MONCOMPTEPRO,
    owner_id: user?.id,
    state: "closed",
  });
}

async function get_moderation(
  pg: MonComptePro_PgDatabase,
  { moderation_id }: { moderation_id: number },
) {
  const moderation = await pg.query.moderations.findFirst({
    columns: {
      id: true,
      comment: true,
      organization_id: true,
      user_id: true,
      ticket_id: true,
    },
    with: { user: { columns: { email: true } } },
    where: eq(schema.moderations.id, moderation_id),
  });

  if (!moderation) throw new NotFoundError("Moderation not found.");

  return moderation;
}
type get_moderation_dto = Awaited<ReturnType<typeof get_moderation>>;

function mark_moderatio_as_rejected(
  pg: MonComptePro_PgDatabase,
  {
    comment,
    moderation_id,
    moderated_by,
  }: { comment: string | null; moderation_id: number; moderated_by: string },
) {
  return pg
    .update(schema.moderations)
    .set({
      comment: [
        ...(comment ? [comment] : []),
        comment_message({
          type: "REJECTED",
          created_by: moderated_by,
        }),
      ].join("\n"),
      moderated_at: new Date().toISOString(),
      moderated_by,
    })
    .where(eq(schema.moderations.id, moderation_id));
}
