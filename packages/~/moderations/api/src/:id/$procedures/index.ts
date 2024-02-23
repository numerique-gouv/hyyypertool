//

import type { App_Context } from "@~/app.middleware/context";
import { Hono } from "hono";
import moderation_processed_router from "./processed";
import moderation_rejected_router from "./rejected";
import moderation_reprocess_router from "./reprocess";

//

export default new Hono<App_Context>()
  .route("/processed", moderation_processed_router)
  .route("/rejected", moderation_rejected_router)
  .route("/reprocess", moderation_reprocess_router);
