//

import config from "@~/app.core/config";
import { Root_Layout } from "@~/app.layout/root";
import type { Csp_Context } from "@~/app.middleware/csp_headers";
import { type Session_Context } from "@~/app.middleware/session";
import { urls } from "@~/app.urls";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";

//

export default new Hono<Session_Context & Csp_Context>()
  .use("/", jsxRenderer(Root_Layout))
  .get("/", function GET({ render, redirect, var: { nonce, session } }) {
    if (session.get("userinfo")) {
      return redirect(urls.moderations.$url().pathname);
    }

    return render(
      <main class="flex h-full flex-grow flex-col items-center justify-center">
        <h1 class="fr-display--xl drop-shadow-lg ">
          <hyyyper-title>Bonjour Hyyypertool !</hyyyper-title>
          <script
            nonce={nonce}
            src={`${config.PUBLIC_ASSETS_PATH}/welcome/api/src/_client/hyyypertitle.js`}
            type="module"
          ></script>
        </h1>

        <div class="animated delay-2s fadeInLeftBig flex flex-col items-center">
          <button class="agentconnect-button"></button>
          <form method="post" action={urls.auth.login.$url().pathname}>
            <div class="fr-connect-group">
              <button class="fr-connect" type="submit">
                <span class="fr-connect__login">S’identifier avec</span>
                <span class="fr-connect__brand">AgentConnect</span>
              </button>
              <p>
                <a
                  href="https://agentconnect.gouv.fr/"
                  rel="noopener noreferrer"
                  target="_blank"
                  title="Qu’est-ce que AgentConnect ? - nouvelle fenêtre"
                >
                  Qu’est-ce que AgentConnect ?
                </a>
              </p>
            </div>
          </form>
        </div>
      </main>,
      { nonce },
    );
  });
