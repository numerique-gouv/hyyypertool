//

import { Main_Layout, userinfo_to_username } from "@~/app.layout";
import type { Csp_Context } from "@~/app.middleware/csp_headers";
import type { UserInfo_Context } from "@~/app.middleware/vip_list.guard";
import { urls } from "@~/app.urls";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import ModerationPage_Context from "./id/context";
import user_page_route from "./id/index";

//

export { ModerationPage_Context };

export default new Hono<Csp_Context & UserInfo_Context>()
  .route("/:id", user_page_route)
  .use("/", jsxRenderer(Main_Layout))
  .get("/", function GET({ render, var: { nonce, userinfo } }) {
    return render("Hello moderations !" + urls.users.$url().pathname, {
      nonce,
      username: userinfo_to_username(userinfo),
    });
  });
