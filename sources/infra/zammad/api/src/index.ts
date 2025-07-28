//

import { zValidator } from "@hono/zod-validator";
import { HTTPError } from "@~/app.core/error";
import { Id_Schema } from "@~/app.core/schema";
import { get_zammad_attachment } from "@~/zammad.lib/get_zammad_attachment";
import { Hono } from "hono";
import { P, match } from "ts-pattern";
import { z } from "zod";

//

export default new Hono()
  .get(
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

      return new Response(image.body);
    },
  )
  .onError((err, { notFound }) => {
    return match(err)
      .with(P.instanceOf(TypeError), P.instanceOf(SyntaxError), () => {
        return notFound();
      })
      .otherwise(() => {
        throw new HTTPError("Invalid Zammad attachment", { cause: err });
      });
  });
