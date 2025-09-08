//

import type { Context, Env } from "hono";
import { createMiddleware } from "hono/factory";
import type { App_Context } from "./context";
import type { AgentConnect_UserInfo } from "./session";

//

export function set_userinfo(value?: Partial<AgentConnect_UserInfo>) {
  if (value)
    return createMiddleware<UserInfoVariables_Context>(({ set }, next) => {
      set("userinfo", value as AgentConnect_UserInfo);
      return next();
    });

  return createMiddleware<UserInfoVariables_Context>(
    async function set_userinfo_middleware(c, next) {
      const { req, set } = c;

      const {
        var: { session, sentry },
      } = c as Context as Context<App_Context>;
      const userinfo = session.get("userinfo");

      if (userinfo) {
        sentry.setUser({
          email: userinfo.email,
          id: userinfo.sub,
          username: userinfo.given_name,
          ip_address: req.header("x-forwarded-for") ?? "",
        });
        set("userinfo", userinfo);
      }

      await next();

      sentry.setUser(null);
      return Promise.resolve();
    },
  );
}

export interface UserInfoVariables_Context extends Env {
  Variables: {
    userinfo: AgentConnect_UserInfo;
  };
}
