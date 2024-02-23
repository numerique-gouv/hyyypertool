//

import { Main_Layout, userinfo_to_username } from "@~/app.layout";
import type { Csp_Context } from "@~/app.middleware/csp_headers";
import type { UserInfo_Context } from "@~/app.middleware/vip_list.guard";
import { urls } from "@~/app.urls";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import ModerationPage_Context from "./context";

//

export { ModerationPage_Context };

export default new Hono<Csp_Context & UserInfo_Context>()
  .use("/", jsxRenderer(Main_Layout))
  .get("/", function GET({ render, var: { nonce, userinfo } }) {
    return render("Hello moderation !" + urls.users.$url().pathname, {
      nonce,
      username: userinfo_to_username(userinfo),
    });
  });
