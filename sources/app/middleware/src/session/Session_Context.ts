import type { Env } from "hono";
import type { Session } from "hono-sessions";
import type { AgentConnect_UserInfo } from "./AgentConnect_UserInfo";

//

interface Session_KeyMapping {
  userinfo?: AgentConnect_UserInfo;
  idtoken: string;
  state: string;
  nonce: string;
  post_login_redirect?: string;
}

export interface Session_Context extends Env {
  Variables: {
    session: Omit<Session, "get" | "set"> & {
      get<K extends keyof Session_KeyMapping>(key: K): Session_KeyMapping[K];
      set<K extends keyof Session_KeyMapping>(
        key: K,
        value: Session_KeyMapping[K],
      ): void;
    };
  };
}
