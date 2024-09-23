//

import { zValidator } from "@hono/zod-validator";
import { Entity_Schema } from "@~/app.core/schema";
import { get_crisp_mail, is_crisp_ticket } from "@~/crisp.lib";
import { set_crisp_config } from "@~/crisp.middleware";
import { GetModerationById } from "@~/moderations.repository";
import { get_zammad_mail } from "@~/zammad.lib/get_zammad_mail";
import { is_zammad_ticket } from "@~/zammad.lib/is_zammad_ticket";
import { to } from "await-to-js";
import consola from "consola";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import Page from "./_page";
import { type ContextType } from "./_page/context";

//

export default new Hono<ContextType>().get(
  "/",
  jsxRenderer(),
  zValidator("param", Entity_Schema),
  set_crisp_config(),
  function set_constants({ set }, next) {
    set("MAX_ARTICLE_COUNT", 3);
    return next();
  },
  async function set_moderation({ req, set, var: { moncomptepro_pg } }, next) {
    const { id: moderation_id } = req.valid("param");
    const get_moderation_by_id = GetModerationById({ pg: moncomptepro_pg });
    const moderation = await get_moderation_by_id(moderation_id, {
      columns: { ticket_id: true },
      with: { user: { columns: { email: true } } },
    });
    set("moderation", moderation);
    return next();
  },
  async function set_query_zammad_mail(
    {
      set,
      var: {
        MAX_ARTICLE_COUNT,
        moderation: { ticket_id },
      },
    },
    next,
  ) {
    if (!ticket_id) return next();
    if (!is_zammad_ticket(ticket_id)) return next();

    const [get_zammad_mail_err, articles] = await to(
      get_zammad_mail({ ticket_id: Number(ticket_id) }),
    );
    if (get_zammad_mail_err) {
      consola.error(get_zammad_mail_err);
      return next();
    }
    if (!articles) return next();

    set("zammad", {
      articles,
      show_more: articles.length > MAX_ARTICLE_COUNT,
      subject: articles.at(0)?.subject ?? "",
      ticket_id,
    });
    return next();
  },
  async function set_query_crisp_mail(
    {
      set,
      var: {
        crisp_config,
        MAX_ARTICLE_COUNT,
        moderation: { ticket_id: session_id },
      },
    },
    next,
  ) {
    if (!session_id) return next();
    if (!is_crisp_ticket(session_id)) return next();

    const [crisp_err, crisp] = await to(
      get_crisp_mail(crisp_config, { session_id }),
    );

    if (crisp_err) {
      consola.error(crisp_err);
      return next();
    }
    const { conversation, messages } = crisp;

    set("crisp", {
      conversation,
      messages: messages.slice(-MAX_ARTICLE_COUNT),
      session_id,
      show_more: messages.length > MAX_ARTICLE_COUNT,
      subject: conversation.meta.subject ?? "",
    });
    return next();
  },
  async function GET({ render }) {
    return render(<Page />);
  },
);
