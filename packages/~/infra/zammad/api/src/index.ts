//

import { zValidator } from "@hono/zod-validator";
import { Id_Schema } from "@~/app.core/schema";
import { get_zammad_attachment } from "@~/zammad.lib";
import { Hono } from "hono";
import { z } from "zod";

//

export default new Hono().get(
  "/attachment/:ticket_id/:article_id/:attachment_id",
  zValidator(
    "param",
    z.object({
      article_id: Id_Schema,
      attachment_id: Id_Schema,
      ticket_id: Id_Schema,
    }),
  ),
  async ({ req }) => {
    const { article_id, attachment_id, ticket_id } = req.valid("param");
    const image = await get_zammad_attachment({
      article_id,
      attachment_id,
      ticket_id,
    });

    return image;
  },
);
