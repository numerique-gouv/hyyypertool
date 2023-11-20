//

import env from ":env";
import { Root_Layout } from ":layout/root";
import type { ElysiaWWW } from ":www";

export default (www: ElysiaWWW) =>
  www
    .get("/", () => (
      <Root_Layout>
        <main class="flex h-full flex-grow flex-col items-center justify-center">
          <h1 class="fr-display--xl drop-shadow-lg ">
            <tag of="hyyyper-title" />
            <script type="module" src="/_client/hyyypertitle.js"></script>
          </h1>
          <div class="animated delay-2s fadeInLeftBig flex flex-col items-center">
            <form hx-post="/login">
              <button class="moncomptepro-button"></button>
            </form>
            <p>
              <a
                href="https://moncomptepro.beta.gouv.fr/"
                target="_blank"
                rel="noopener noreferrer"
                title="Qu'est-ce que MonComptePro ? - nouvelle fenêtre"
              >
                Qu'est-ce que MonComptePro ?
              </a>
            </p>
          </div>
        </main>
      </Root_Layout>
    ))
    .get("/_client/hyyypertitle.js", async () => {
      const {
        outputs: [output],
      } = await Bun.build({
        entrypoints: ["src/www/_client/hyyypertitle.ts"],
        external: ["lit"],
        minify: env.NODE_ENV === "production",
      });
      return new Response(output);
    });
