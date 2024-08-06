//

import { createMiddleware } from "hono/factory";
import { vip_list_guard } from "./vip_list.guard";
import type { App_Context } from "./context";

//

export function authorized() {
  return createMiddleware<App_Context>(function authorized_middleware(c, next) {
    const {
      var: { config },
    } = c;
    return vip_list_guard({ vip_list: config.ALLOWED_USERS.split(",") })(
      c,
      next,
    );
  });
}
