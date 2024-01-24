//

import type { AgentConnect_UserInfo } from ":common/session";
import { createContext } from "hono/jsx";

//

export const UserInfo_Context = createContext<AgentConnect_UserInfo>({} as any);
