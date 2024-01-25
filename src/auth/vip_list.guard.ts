//

import type { MiddlewareHandler } from "hono";

//

//  const UserInfo_Context = createContext<AgentConnect_UserInfo>({} as any);
export function vip_list_guard({
  vip_list,
}: {
  vip_list: string[];
}): MiddlewareHandler {
  return async function vip_list_guard_middleware(
    { redirect, req, var: { sentry, session } },
    next,
  ) {
    const userinfo = session.get("userinfo");

    if (!userinfo) {
      return redirect("/");
    }

    sentry.setUser({
      email: userinfo.email,
      id: userinfo.sub,
      username: userinfo.given_name,
      ip_address: req.header("x-forwarded-for"),
    });

    const is_allowed = vip_list.includes(userinfo.email);
    if (!is_allowed) {
      return redirect("/");
    }

    await next();

    sentry.setUser(null);
  };
}
