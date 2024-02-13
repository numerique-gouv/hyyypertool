//

import env from ":common/env.ts";
import {
  hyyyyyypertool_session,
  type AgentConnect_UserInfo,
  type Session_Context,
} from ":common/session.ts";
import { app_hc } from ":hc";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { generators } from "openid-client";
import { z } from "zod";
import { agentconnect, type Oidc_Context } from "./agentconnect";

//

const auth_router = new Hono<Oidc_Context & Session_Context>()
  .use("*", hyyyyyypertool_session)
  .use("*", agentconnect())
  .post("/login", async function POST(c) {
    const session = c.get("session");
    const { req, redirect, get } = c;

    const client = get("oidc");

    const code_verifier = generators.codeVerifier();
    const state = generators.state();
    const nonce = generators.nonce();

    const redirect_uri = get_redirect_uri(req.url);

    session.set("verifier", code_verifier);
    session.set("state", state);
    session.set("nonce", nonce);

    const redirectUrl = client.authorizationUrl({
      acr_values: "eidas1",
      nonce,
      redirect_uri,
      scope: env.AGENTCONNECT_OIDC_SCOPE,
      state,
    });

    console.log(req.url, {
      code_verifier,
      nonce,
      redirect_uri,
      scope: env.AGENTCONNECT_OIDC_SCOPE,
      state,
    });

    return redirect(redirectUrl);
  })
  .get(`/fake/login/callback`, ({ redirect, var: { session } }) => {
    session.set("userinfo", {
      sub: "f52c691e7cc33e3116172d1115eee5e6016f0036095e9a514c86d741f364e88f",
      uid: "1",
      given_name: "Jean",
      usual_name: "User",
      email: "user@yopmail.com",
      siret: "21440109300015",
      phone_number: "0123456789",
      idp_id: "71144ab3-ee1a-4401-b7b3-79b44f7daeeb",
      idp_acr: "eidas1",
      aud: "6925fb8143c76eded44d32b40c0cb1006065f7f003de52712b78985704f39950",
      exp: 1707821864,
      iat: 1707821804,
      iss: "https://fca.integ01.dev-agentconnect.fr/api/v2",
    });
    session.set("idtoken", "");

    return redirect(app_hc.moderations.$url().pathname);
  })
  .get(
    `/login/callback`,
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

      console.log({
        grant_type: "authorization_code",
        code: params.code,
        redirect_uri,
        scope: env.AGENTCONNECT_OIDC_SCOPE,
      });

      const tokenSet = await client.grant({
        grant_type: "authorization_code",
        code: params.code,
        redirect_uri,
        scope: env.AGENTCONNECT_OIDC_SCOPE,
      });
      console.log({ tokenSet });

      const userinfo = await client.userinfo<AgentConnect_UserInfo>(
        tokenSet.access_token ?? "",
      );
      session.set("userinfo", userinfo);
      session.set("idtoken", tokenSet.id_token ?? "");

      return redirect(app_hc.moderations.$url().pathname);
    },
  )
  .get("/logout", async ({ req, get, redirect }) => {
    const session = get("session");
    const client = get("oidc");

    const post_logout_redirect_uri = get_logout_redirect_uri(req.url);

    const logoutUrl = client.endSessionUrl({
      id_token_hint: session.get("idtoken"),
      post_logout_redirect_uri,
    });

    session.deleteSession();

    return redirect(logoutUrl);
  });

const router = new Hono().route("/auth/", auth_router);
export default router;
export type AuthRouter_Schema = typeof router;

//

function get_redirect_uri(url: string) {
  const _url = new URL(url);
  const redirect_uri = `${env.HOST ? env.HOST : _url.origin}${app_hc.auth.login.callback.$url().pathname}`;
  return redirect_uri;
}

function get_logout_redirect_uri(url: string) {
  const _url = new URL(url);
  const redirect_uri = `${env.HOST ? env.HOST : _url.origin}`;
  return redirect_uri;
}
