//

import type { ConfigVariables_Context } from "@~/app.middleware/set_config";
import { basicAuth } from "hono/basic-auth";
import { createMiddleware } from "hono/factory";

//

export function coop_authorized() {
  return createMiddleware<ConfigVariables_Context>(
    function authorized_middleware(c, next) {
      const {
        var: { config },
      } = c;
      const middleware = basicAuth({
        username: config.API_COOP_USERNAME,
        password: config.API_COOP_PASSWORD,
      });
      return middleware(c as any, next);
    },
  );
}
