//

import { Root_Provider } from ":common/root.provider";
import { Entity_Schema } from ":common/schema";
import { type Session_Context } from ":common/session";
import { ModerationPage } from ":legacy/moderations/page";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { renderToReadableStream } from "hono/jsx/streaming";

//

export default new Hono<Session_Context>().get(
  "/",
  zValidator("param", Entity_Schema),
  async ({ body, req, get, var: { session } }) => {
    const { id } = req.valid("param");
    const userinfo = session.get("userinfo")!;
    return body(
      renderToReadableStream(
        <Root_Provider userinfo={userinfo}>
          <ModerationPage active_id={id} />
        </Root_Provider>,
      ),
    );
  },
);
