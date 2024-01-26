//

import { Hono } from "hono";
import organization_router from "./:id/route";

//

export default new Hono().route("/:id", organization_router);
