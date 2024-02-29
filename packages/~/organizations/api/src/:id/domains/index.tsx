//

import { Hono } from "hono";
import external_router from "./external";
import internal_router from "./internal";

//

export default new Hono()
  .route("/external", external_router)
  .route("/internal", internal_router);
