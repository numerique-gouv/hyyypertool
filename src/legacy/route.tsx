//

import organizations_router from ":organizations/route";
import env from "@~/app.core/config";
import {
  hyyyyyypertool_session,
  type Session_Context,
} from "@~/app.middleware/session";
import { vip_list_guard } from "@~/app.middleware/vip_list.guard";
import moderations_router from "@~/moderations.api";
import { Hono } from "hono";
import { users_router } from "./users/route";

//

export const legacy_router = new Hono()
  .basePath("/legacy")
  .route("moderations", moderations_router)
  .route("organizations", organizations_router)
  .route("users", users_router);

//

export default new Hono<Session_Context>()
  .use("*", hyyyyyypertool_session)
  .use("/legacy/*", vip_list_guard({ vip_list: env.ALLOWED_USERS.split(",") }))
  .route("", legacy_router);
