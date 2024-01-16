//

import { hono_autoroute } from ":common/autorouter";
import { hyyyyyypertool_session, type Session_Context } from ":common/session";
import { Hono } from "hono";
import { moderations_router } from "./moderations/route";

//

const legacy_autoroute = await hono_autoroute({
  basePath: "/legacy",
  dir: "src/legacy/routes",
});
export default new Hono<Session_Context>()
  .use("*", hyyyyyypertool_session)
  .use("*", async function guard({ redirect, var: { session } }, next) {
    const userinfo = session.get("userinfo");

    if (!userinfo) {
      return redirect("/");
    }

    return next();
  })
  .route("", legacy_autoroute)
  .route("/legacy/moderations", moderations_router);
