//

import config from "@~/app.core/config";
import { Root_Layout } from "@~/app.layout/root";
import type { App_Context } from "@~/app.middleware/context";
import { urls } from "@~/app.urls";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";

//

export default new Hono<App_Context>().get(
  "/",
  jsxRenderer(Root_Layout),
  function GET({ render, redirect, req, set, var: { nonce, userinfo } }) {
    const redirect_to = new URL(req.url).searchParams.get("redirect_to");
    if (userinfo)
      return redirect(redirect_to ?? urls.moderations.$url().pathname);

    const login_uri = redirect_to
      ? `${urls.auth.login.$url().pathname}?redirect_to=${redirect_to}`
      : urls.auth.login.$url().pathname;

    set("page_title", "Accueil");
    return render(
      <main class="flex h-full grow flex-col items-center justify-center">
        <h1 class="fr-display--xl drop-shadow-lg">
          <hyyyper-title>Bonjour Hyyypertool !</hyyyper-title>
          <script
            nonce={nonce}
            src={`${config.PUBLIC_ASSETS_PATH}/welcome/api/src/_client/hyyypertitle.js`}
            type="module"
          ></script>
        </h1>

        <div class="animated delay-2s fadeInLeftBig flex flex-col items-center">
          <button class="agentconnect-button"></button>
          <form method="post" action={login_uri}>
            <div class="fr-connect-group">
              <button class="fr-connect" type="submit">
                <span class="fr-connect__login">S’identifier avec</span>
                <span class="fr-connect__brand">ProConnect</span>
              </button>
              <p>
                <a
                  href="https://www.proconnect.gouv.fr/"
                  rel="noopener noreferrer"
                  target="_blank"
                  title="Qu’est-ce que ProConnect ? - nouvelle fenêtre"
                >
                  Qu’est-ce que ProConnect ?
                </a>
              </p>
            </div>
          </form>
        </div>
      </main>,
    );
  },
);
