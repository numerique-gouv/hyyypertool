//

import env from ":env";
import { zValidator } from "@hono/zod-validator";
import { Hono, type Env, type MiddlewareHandler } from "hono";
import { BaseClient, Issuer, generators } from "openid-client";
import { z } from "zod";
import { hyyyyyypertool_session, type Session_Context } from "../session";

//

const OIDC_CALLBACK = "oidc-callback";

const callback_url = "oidc-callback";

//

interface Oidc_Context extends Env {
  Variables: {
    oidc: BaseClient;
  };
}
function agentconnect(): MiddlewareHandler<Oidc_Context> {
  return async function agentconnect_middleware(c, next) {
    const agentconnect_oidc_issuer = await Issuer.discover(
      env.AGENTCONNECT_OIDC_ISSUER,
    );

    const client = new agentconnect_oidc_issuer.Client({
      client_id: env.AGENTCONNECT_OIDC_CLIENT_ID,
      client_secret: env.AGENTCONNECT_OIDC_SECRET_ID,
      id_token_signed_response_alg: "ES256",
      redirect_uris: [`${env.HOST}${callback_url}`],
      response_types: ["code"],
      userinfo_signed_response_alg: "ES256",
    });

    //
    c.set("oidc", client);

    return next();
  };
}

export default new Hono<Oidc_Context & Session_Context>()
  .use("*", hyyyyyypertool_session)
  .use("*", agentconnect())
  .get(
    `/${OIDC_CALLBACK}`,
    zValidator(
      "query",
      z.object({
        code: z.string().trim(),
        state: z.string(),
      }),
    ),
    async function oidc_callback(c) {
      const session = c.get("session");
      const { redirect, req, get } = c;

      req.valid("query"); // secure request query

      const client = get("oidc");
      const params = client.callbackParams(req.url);

      const redirect_uri = get_redirect_uri(req.url);

      const tokenSet = await client.grant({
        grant_type: "authorization_code",
        code: params.code,
        redirect_uri,
        scope:
          "openid uid given_name usual_name email siren siret organizational_unit belonging_population phone chorusdt idp_id idp_acr",
      });

      const userinfo = await client.userinfo(tokenSet.access_token ?? "");
      session.set("userinfo", userinfo);
      session.set("idtoken", tokenSet.id_token);

      return redirect("/legacy");
    },
  )
  .post("/login", async (c) => {
    const session = c.get("session");
    const { req, redirect, get } = c;

    const client = get("oidc");

    const code_verifier = generators.codeVerifier();
    const state = generators.state();
    const nonce = generators.nonce();

    const redirect_uri = get_redirect_uri(req.url);
    console.log({ url: req.url, redirect_uri });

    session.set("verifier", code_verifier);
    session.set("state", state);
    session.set("nonce", nonce);

    const redirectUrl = client.authorizationUrl({
      acr_values: "eidas1",
      nonce,
      redirect_uri,
      scope:
        "openid uid given_name usual_name email siren siret organizational_unit belonging_population phone chorusdt idp_id idp_acr",
      state,
    });

    return redirect(redirectUrl);
  })
  .get("/logout", async ({ req, get, redirect }) => {
    const session = get("session");
    const client = get("oidc");

    const post_logout_redirect_uri = get_logout_redirect_uri(req.url);
    console.log({ url: req.url, post_logout_redirect_uri });

    const logoutUrl = client.endSessionUrl({
      id_token_hint: session.get("idtoken"),
      post_logout_redirect_uri,
    });

    session.deleteSession();

    return redirect(logoutUrl);
  });

function get_redirect_uri(url: string) {
  const _url = new URL(url);
  const redirect_uri = `${
    env.HOST ? env.HOST : _url.origin
  }/client/${OIDC_CALLBACK}`;
  return redirect_uri;
}
function get_logout_redirect_uri(url: string) {
  const _url = new URL(url);
  const redirect_uri = `${env.HOST ? env.HOST : _url.origin}`;
  return redirect_uri;
}
