//

import config from "@~/app.core/config";
import { createMiddleware } from "hono/factory";

//

export const cache_immutable = createMiddleware(
  async function immutable_middleware({ finalized, header }, next) {
    await next();
    if (finalized) return;
    if (config.NODE_ENV === "development") return;
    header("cache-control", "public,max-age=31536000,immutable");
  },
);
