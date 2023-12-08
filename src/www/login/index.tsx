//

import env from ":env";
import { Hono, type Env, type MiddlewareHandler } from "hono";
import { CookieStore, Session, sessionMiddleware } from "hono-sessions";
import { join } from "node:path";
import { BaseClient, Issuer, generators } from "openid-client";

//

const CALLBACK = "/oidc-callback";
const redirectUri = join(env.HOST, CALLBACK);

//

interface Session_Context extends Env {
  Variables: {
    session: Session;
  };
}

//

interface Oidc_Context extends Env {
  Variables: {
    oidc: BaseClient;
  };
}

function agentconnect(): MiddlewareHandler<Oidc_Context> {
  return async function agentconnect_middleware(c, next) {
    const agent_connect_oidc_issuer = await Issuer.discover(
      env.AGENT_CONNECT_OIDC_ISSUER,
    );

    const client = new agent_connect_oidc_issuer.Client({
      client_id: env.AGENT_CONNECT_OIDC_CLIENT_ID,
      client_secret: env.AGENT_CONNECT_OIDC_SECRET_ID,
      id_token_signed_response_alg:
        env.AGENT_CONNECT_OIDC_ID_TOKEN_SIGNED_RESPONSE_ALG,
      redirect_uris: [redirectUri],
      response_types: ["code"],
      userinfo_signed_response_alg:
        env.AGENT_CONNECT_OIDC_USERINFO_SIGNED_RESPONSE_ALG,
    });

    //
    c.set("oidc", client);

    return next();
  };
}

//

export default new Hono<Oidc_Context & Session_Context>()
  .use(
    sessionMiddleware({
      store: new CookieStore(),
      encryptionKey: env.COOKIE_ENCRYPTION_KEY,
      sessionCookieName: "hyyyyyypertool",
    }),
  )
  .use(agentconnect())
  .get(CALLBACK, async function oidc_callback(c) {
    const session = c.get("session");
    const { redirect, req, get } = c;

    const client = get("oidc");
    const params = client.callbackParams(req.url);

    const code_verifier = session.get("code_verifier") as string;
    const tokenSet = await client.callback(redirectUri, params, {
      code_verifier,
    });

    session.set("userinfo", await client.userinfo(tokenSet.access_token ?? ""));
    session.set("idtoken", tokenSet.claims());
    session.set("oauth2token", tokenSet);

    return redirect("/");
  })
  .post("/", async (c) => {
    const session = c.get("session");
    const { req, redirect, get } = c;

    if (env.DEPLOY_ENV === "preview") {
      return redirect("/legacy");
    }

    const client = await get("oidc");
    const code_verifier = generators.codeVerifier();
    session.set("code_verifier", code_verifier);

    const code_challenge = generators.codeChallenge(code_verifier);
    const redirect_url = client.authorizationUrl({
      scope: env.AGENT_CONNECT_OIDC_SCOPES,
      acr_values: "eidas1",
      claims: `{"id_token":{"amr":{"essential":true}}}`,
      prompt: "login consent",
      state: "",
      nonce: "",
      code_challenge,
      code_challenge_method: "S256",
    });

    return redirect(redirect_url);
  });
