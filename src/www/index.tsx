//

import { Root_Layout } from ":layout/root";
import type { ElysiaWWW } from ":www";

export default (www: ElysiaWWW) =>
  www.get("/", () => (
    <Root_Layout>
      <main class="flex h-full flex-grow flex-col items-center justify-center">
        <h1 class="fr-display--xl drop-shadow-lg ">
          <span class="text-[--text-active-blue-france]">H</span>
          <span
            _="
              on load
                measure my left then
                  log `My width is ${Math.floor(left  / 50)}`
                  repeat Math.floor(left / 50 ) times
                    put 'y' at the end of me
                    wait (left / 50)ms
                  end
              "
            class="text-[--text-active-blue-france]"
          ></span>
          <div
            _="
              on load
                hide me
                wait 1s
                show me
              "
            style="text-shadow: 0 0 4px #000;"
            class="animated fast flash inline-block text-white  "
          >
            per
          </div>
          <div class="animated slower delay-1s zoomInDown inline-block text-[--text-active-red-marianne]">
            tool
          </div>
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
  ));
