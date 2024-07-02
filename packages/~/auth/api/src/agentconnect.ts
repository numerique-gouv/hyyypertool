//

import env from "@~/app.core/config";
import type { Env, MiddlewareHandler } from "hono";
import { BaseClient, Issuer } from "openid-client";

//

export function agentconnect(): MiddlewareHandler<Oidc_Context> {
  return async function agentconnect_middleware({ set }, next) {
    const agentconnect_oidc_issuer = await Issuer.discover(
      env.AGENTCONNECT_OIDC_ISSUER,
    );

    const client = new agentconnect_oidc_issuer.Client({
      client_id: env.AGENTCONNECT_OIDC_CLIENT_ID,
      client_secret: env.AGENTCONNECT_OIDC_SECRET_ID,
      id_token_signed_response_alg: "ES256",
      // redirect_uris: [urls.auth.login.callback.$url().href],
      response_types: ["code"],
      userinfo_signed_response_alg: "ES256",
    });

    //

    set("oidc", client);

    return next();
  };
}

//

export interface Oidc_Context extends Env {
  Variables: {
    oidc: BaseClient;
  };
}
