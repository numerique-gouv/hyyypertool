//

import { Hono } from "hono";
import moderation_processed_router from "./processed";
import moderation_rejected_router from "./rejected";
import moderation_reprocess_router from "./reprocess";
import moderation_validate_router from "./validate";

//

export default new Hono()
  .route("/processed", moderation_processed_router)
  .route("/rejected", moderation_rejected_router)
  .route("/reprocess", moderation_reprocess_router)
  .route("/validate", moderation_validate_router);
