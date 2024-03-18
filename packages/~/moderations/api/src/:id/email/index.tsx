//

import { zValidator } from "@hono/zod-validator";
import { Entity_Schema } from "@~/app.core/schema";
import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import type { UserInfo_Context } from "@~/app.middleware/vip_list.guard";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { Moderation_Context, get_moderation } from "./context";
import Page from "./page";

//

export const moderation_email_router = new Hono<
  UserInfo_Context & MonComptePro_Pg_Context
>()
  .use(jsxRenderer())
  .get(
    "/",
    zValidator("param", Entity_Schema),
    async function GET({ render, req, var: { moncomptepro_pg } }) {
      const { id: moderation_id } = req.valid("param");
      const moderation = await get_moderation(moncomptepro_pg, {
        moderation_id,
      });
      return render(
        <Moderation_Context.Provider value={{ moderation }}>
          <Page />
        </Moderation_Context.Provider>,
      );
    },
  );
