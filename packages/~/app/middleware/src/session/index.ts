//

import config from "@~/app.core/config";
import { CookieStore, sessionMiddleware } from "hono-sessions";

//

export * from "./AgentConnect_UserInfo";
export * from "./Session_Context";

//

export const hyyyyyypertool_session = sessionMiddleware({
  store: new CookieStore(),
  encryptionKey: config.COOKIE_ENCRYPTION_KEY,
  sessionCookieName: "hyyyyyypertool",
});
