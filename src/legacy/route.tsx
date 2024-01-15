//

import { hono_autoroute } from ":common/autorouter";
import { Hono } from "hono";
import { moderations_router } from "./moderations/route";

//

const legacy_autoroute = await hono_autoroute({
  basePath: "/legacy",
  dir: "src/legacy/routes",
});
export default new Hono()
  .route("", legacy_autoroute)
  .route("/legacy/moderations", moderations_router);
