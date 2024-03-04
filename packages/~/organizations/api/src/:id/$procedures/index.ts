//

import { Hono } from "hono";
import verify_domain_router from "./verify_domain";

//

export default new Hono().route("/verify", verify_domain_router);
