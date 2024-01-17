//

import { api_ref } from ":api_ref";
import env from ":common/env.ts";
import {
  hyyyyyypertool_session,
  type Session_Context,
} from ":common/session.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { generators } from "openid-client";
import { z } from "zod";
import { agentconnect, type Oidc_Context } from "./agentconnect";

//

const auth_router = new Hono<Oidc_Context & Session_Context>()
  .use("*", hyyyyyypertool_session)
  .use("*", agentconnect())
  .post("/login", async (c) => {
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

    return redirect(redirectUrl);
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

      const tokenSet = await client.grant({
        grant_type: "authorization_code",
        code: params.code,
        redirect_uri,
        scope: env.AGENTCONNECT_OIDC_SCOPE,
      });

      const userinfo = await client.userinfo(tokenSet.access_token ?? "");
      session.set("userinfo", userinfo);
      session.set("idtoken", tokenSet.id_token);

      return redirect(api_ref("/legacy", {}));
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
  const redirect_uri = `${env.HOST ? env.HOST : _url.origin}${api_ref(
    "/auth/login/callback",
    {},
  )}`;
  return redirect_uri;
}

function get_logout_redirect_uri(url: string) {
  const _url = new URL(url);
  const redirect_uri = `${env.HOST ? env.HOST : _url.origin}`;
  return redirect_uri;
}
