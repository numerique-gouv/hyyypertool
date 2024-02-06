//

import { Hono } from "hono";
import external_router from "./external/route";
import internal_router from "./internal/route";

//

export default new Hono()
  .route("/external", external_router)
  .route("/internal", internal_router);
