//

import { UserInfo_Context } from ":auth/userinfo.context";
import type { Child } from "hono/jsx";
import type { AgentConnect_UserInfo } from "./session";

//

export function Root_Provider({
  children,
  userinfo,
}: {
  children: Child;
  userinfo: AgentConnect_UserInfo;
}) {
  return (
    <UserInfo_Context.Provider value={userinfo}>
      {children}
    </UserInfo_Context.Provider>
  );
}
