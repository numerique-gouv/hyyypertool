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

export interface Session_Context extends Env {
  Variables: {
    session: Session & {
      get(key: "verifier"): string;
      set(key: "verifier", value: string): void;
    } & {
      get(key: "oidc"): BaseClient;
      set(key: "oidc", value: BaseClient): void;
    } & {
      get(key: "userinfo"): AgentConnect_UserInfo | undefined;
      set(key: "userinfo", value: AgentConnect_UserInfo): void;
    } & {
      get(key: "idtoken"): string;
      set(key: "idtoken", value: string): void;
    } & {
      get(key: "oauth2token"): TokenSet;
      set(key: "oauth2token", value: TokenSet): void;
    } & {
      get(key: "state"): string;
      set(key: "state", value: string): void;
    } & {
      get(key: "nonce"): string;
      set(key: "nonce", value: string): void;
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
