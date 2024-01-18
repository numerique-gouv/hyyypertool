//

import { hono_autoroute } from ":common/autorouter";
import { hyyyyyypertool_session, type Session_Context } from ":common/session";
import { Hono } from "hono";
import { moderations_router } from "./moderations/route";
import { organizations_router } from "./organizations/route";
import { users_router } from "./users/route";

//

const legacy_autoroute = await hono_autoroute({
  basePath: "/legacy",
  dir: "src/legacy/routes",
});
export const legacy_router = new Hono()
  .basePath("/legacy")
  .use(
    "*",
    hyyyyyypertool_session,
    async function guard({ redirect, var: { session } }, next) {
      const userinfo = session.get("userinfo");

      if (!userinfo) {
        return redirect("/");
      }

      return next();
    },
  )
  .route("moderations", moderations_router)
  .route("organizations", organizations_router)
  .route("users", users_router);

//

export default new Hono<Session_Context>()
  .use("*", hyyyyyypertool_session)
  .route("", legacy_autoroute)
  .route("", legacy_router);
