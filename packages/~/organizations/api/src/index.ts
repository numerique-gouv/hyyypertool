//

import { Main_Layout, userinfo_to_username } from "@~/app.layout";
import type { Csp_Context } from "@~/app.middleware/csp_headers";
import type { UserInfo_Context } from "@~/app.middleware/vip_list.guard";
import { urls } from "@~/app.urls";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import user_page_route from "./:id/index";
import leaders_router from "./leaders";

//

export default new Hono<Csp_Context & UserInfo_Context>()
  .route("/:id", user_page_route)
  .route("/leaders", leaders_router)
  .use("/", jsxRenderer(Main_Layout))
  .get("/", function GET({ render, var: { nonce, userinfo } }) {
    return render("Hello Users !" + urls.users.$url().pathname, {
      nonce,
      username: userinfo_to_username(userinfo),
    });
  });
