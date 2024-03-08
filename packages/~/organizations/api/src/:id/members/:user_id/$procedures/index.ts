//

import { Hono } from "hono";
import join_router from "./join";

//

export default new Hono().route("/join", join_router);
