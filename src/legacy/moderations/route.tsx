//

import { Hono } from "hono";
import { moderation_router } from "./:id/route";

//

export const moderations_router = new Hono().route("/:id", moderation_router);
