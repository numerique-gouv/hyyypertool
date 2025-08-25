//

import { is_htmx_request, type Htmx_Header } from "@~/app.core/htmx";
import { createMiddleware } from "hono/factory";
import { NotAuthorized } from "./NotAuthorized";
import type { UserInfoVariables_Context } from "./set_userinfo";

//

export function vip_list_guard({ vip_list }: { vip_list: string[] }) {
  return createMiddleware<UserInfoVariables_Context>(
    async function vip_list_guard_middleware(
      { redirect, render, req, text, var: { userinfo } },
      next,
    ) {
      if (!userinfo) {
        if (is_htmx_request(req.raw)) {
          return text("Unauthorized", 401, {
            "HX-Location": "/",
          } as Htmx_Header);
        }

        return redirect("/");
      }
      const is_allowed = vip_list.includes(userinfo.email);
      if (!is_allowed) {
        return render(<NotAuthorized />);
      }
      return next();
    },
  );
}
