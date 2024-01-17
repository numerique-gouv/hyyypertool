//

import { api_ref } from ":api_ref";
import type { Csp_Context } from ":common/csp_headers";
import env from ":common/env";
import { type Session_Context } from ":common/session";
import { Root_Layout } from ":ui/layout/root";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";

//

const router = new Hono<Session_Context & Csp_Context>()
  .use("*", jsxRenderer(Root_Layout, { docType: true, stream: true }))
  .get("/", ({ render, var: { nonce } }) =>
    render(
      <main class="flex h-full flex-grow flex-col items-center justify-center">
        <h1 class="fr-display--xl drop-shadow-lg ">
          <hyyyper-title />
          <script
            nonce={nonce}
            src={`/assets/${env.VERSION}/_client/hyyypertitle.js`}
            type="module"
          ></script>
        </h1>

        <div class="animated delay-2s fadeInLeftBig flex flex-col items-center">
          <button class="agentconnect-button"></button>
          <form method="post" action={api_ref("/auth/login", {})}>
            <div class="fr-connect-group">
              <button class="fr-connect" type="submit">
                <span class="fr-connect__login">S’identifier avec</span>
                <span class="fr-connect__brand">AgentConnect</span>
              </button>
              <p>
                <a
                  href="https://agentconnect.gouv.fr/"
                  target="_blank"
                  rel="noopener"
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
    ),
  )
  .get(`/assets/${env.VERSION}/_client/hyyypertitle.js`, async () => {
    const {
      outputs: [output],
    } = await Bun.build({
      entrypoints: ["src/welcome/_client/hyyypertitle.ts"],
      external: ["lit", ":common/env.ts"],
      minify: env.NODE_ENV === "production",
    });
    return new Response(output);
  });

export default router;
