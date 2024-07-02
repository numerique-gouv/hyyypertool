import type { Env } from "hono";
import { Session } from "hono-sessions";
import { BaseClient, TokenSet } from "openid-client";
import type { AgentConnect_UserInfo } from "./AgentConnect_UserInfo";

//

interface Session_KeyMapping {
  verifier: string;
  oidc: BaseClient;
  userinfo?: AgentConnect_UserInfo;
  idtoken: string;
  oauth2token: TokenSet;
  state: string;
  nonce: string;
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
