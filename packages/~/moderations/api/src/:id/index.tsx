//

import { zValidator } from "@hono/zod-validator";
import { Entity_Schema } from "@~/app.core/schema";
import {
  Main_Layout,
  userinfo_to_username,
  type Main_Layout_Props,
} from "@~/app.layout/index";
import type { App_Context } from "@~/app.middleware/context";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import moderation_procedures_router from "./$procedures";
import duplicate_warning_router from "./duplicate_warning/index";
import { moderation_email_router } from "./email/index";
import Moderation_Page, { ModerationPage_Provider } from "./page";

//

export default new Hono<App_Context>()
  .use("/", jsxRenderer(Main_Layout))
  .get(
    "/",
    zValidator("param", Entity_Schema),
    function GET({ render, req, var: { nonce, userinfo } }) {
      const username = userinfo_to_username(userinfo);
      const { id } = req.valid("param");
      return render(
        <ModerationPage_Provider moderation_id={id}>
          <Moderation_Page />
        </ModerationPage_Provider>,
        {
          nonce,
          username,
        } as Main_Layout_Props,
      );
    },
  )
  .route("/email", moderation_email_router)
  .route("/duplicate_warning", duplicate_warning_router)
  .route("/$procedures", moderation_procedures_router);
