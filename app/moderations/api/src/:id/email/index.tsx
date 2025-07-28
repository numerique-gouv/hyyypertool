//

import { zValidator } from "@hono/zod-validator";
import { DescribedBy_Schema, Entity_Schema } from "@~/app.core/schema";
import { get_crisp_mail } from "@~/crisp.lib";
import { set_crisp_config } from "@~/crisp.middleware";
import { GetCripsFromSessionId } from "@~/moderations.lib/usecase/GetCripsFromSessionId";
import { GetZammadFromTicketId } from "@~/moderations.lib/usecase/GetZammadFromTicketId";
import { get_zammad_mail } from "@~/zammad.lib/get_zammad_mail";
import { to } from "await-to-js";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import Page from "./page";
import { get_moderation, type ContextType } from "./page/context";

//

export default new Hono<ContextType>().get(
  "/",
  jsxRenderer(),
  zValidator("param", Entity_Schema),
  zValidator("query", DescribedBy_Schema),
  set_crisp_config(),
  function set_constants({ set }, next) {
    set("MAX_ARTICLE_COUNT", 3);
    return next();
  },
  async function set_moderation({ req, set, var: { identite_pg } }, next) {
    const { id: moderation_id } = req.valid("param");
    const moderation = await get_moderation(identite_pg, {
      moderation_id,
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

    const get_zammad_from_ticket_id = GetZammadFromTicketId({
      fetch_zammad_mail: get_zammad_mail,
    });
    const [zammad_err, zammad] = await to(
      get_zammad_from_ticket_id({
        ticket_id,
        limit: MAX_ARTICLE_COUNT,
      }),
    );
    if (zammad_err) return next();

    set("zammad", zammad);
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
    const get_crisp_from_session_id = GetCripsFromSessionId({
      crisp_config,
      fetch_crisp_mail: get_crisp_mail,
    });
    const [crip_err, crip] = await to(
      get_crisp_from_session_id({ session_id, limit: MAX_ARTICLE_COUNT }),
    );
    if (crip_err) return next();
    set("crisp", crip);
    return next();
  },

  async function GET({ render }) {
    return render(<Page />);
  },
);
