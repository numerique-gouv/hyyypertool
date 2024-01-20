//

import { Entity_Schema } from ":common/schema";
import { ModerationPage } from ":legacy/moderations/page";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { renderToReadableStream } from "hono/jsx/streaming";

//

export default new Hono().get(
  "/",
  zValidator("param", Entity_Schema),
  async ({ body, req }) => {
    const { id } = req.valid("param");

    return body(renderToReadableStream(<ModerationPage active_id={id} />));
  },
);
