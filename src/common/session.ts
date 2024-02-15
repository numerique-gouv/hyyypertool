//

import env from ":common/env.ts";
import type { Env } from "hono";
import { CookieStore, Session, sessionMiddleware } from "hono-sessions";
import type { BaseClient, TokenSet } from "openid-client";

//

export const hyyyyyypertool_session = sessionMiddleware({
  store: new CookieStore(),
  encryptionKey: env.COOKIE_ENCRYPTION_KEY,
  sessionCookieName: "hyyyyyypertool",
});

interface Session_KeyMapping {
  verifier: string;
  oidc: BaseClient;
  userinfo: AgentConnect_UserInfo;
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

//

export interface AgentConnect_UserInfo {
  sub: string;
  uid: string;
  given_name: string;
  usual_name: string;
  email: string;
  siret: string;
  phone_number: string;
  idp_id: string;
  idp_acr: string;
  aud: string;
  exp: number;
  iat: number;
  iss: string;
}
