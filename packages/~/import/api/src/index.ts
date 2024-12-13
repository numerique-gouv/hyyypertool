//

import { Hono } from "hono";
import coop_router from "./coop";

//

export default new Hono().route("/", coop_router);
