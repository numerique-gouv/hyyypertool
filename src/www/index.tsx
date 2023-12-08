//

import env from ":env";
import { Root_Layout } from ":layout/root";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";

export default new Hono()
  .use("*", jsxRenderer(Root_Layout, { docType: true, stream: true }))
  .get("/", ({ render }) =>
    render(
      <main class="flex h-full flex-grow flex-col items-center justify-center">
        <h1 class="fr-display--xl drop-shadow-lg ">
          <hyyyper-title />
          <script
            type="module"
            src={`/assets/${env.VERSION}/_client/hyyypertitle.js`}
          ></script>
        </h1>

        <div class="animated delay-2s fadeInLeftBig flex flex-col items-center">
          <button class="agentconnect-button"></button>
          <form method="post" action="/login">
            <div class="fr-connect-group">
              <button class="fr-connect">
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
    ),
  )
  .get(`/assets/${env.VERSION}/_client/hyyypertitle.js`, async () => {
    const {
      outputs: [output],
    } = await Bun.build({
      entrypoints: ["src/www/_client/hyyypertitle.ts"],
      external: ["lit", ":env"],
      minify: env.NODE_ENV === "production",
    });
    return new Response(output);
  });
