//

import { Hono } from "hono";

//

export const moderation_comment_router = new Hono().post(
  "/",
  async ({ text }) => {
    return text("OK");
  },
);
