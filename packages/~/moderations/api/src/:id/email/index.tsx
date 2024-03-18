//

import { zValidator } from "@hono/zod-validator";
import { Entity_Schema } from "@~/app.core/schema";
import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import type { UserInfo_Context } from "@~/app.middleware/vip_list.guard";
import { schema } from "@~/moncomptepro.database";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { ListZammadArticles } from "./ListZammadArticles";

//

export const moderation_email_router = new Hono<
  UserInfo_Context & MonComptePro_Pg_Context
>().get(
  "/",
  zValidator("param", Entity_Schema),
  async function GET({ html, notFound, req, var: { moncomptepro_pg } }) {
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
);
