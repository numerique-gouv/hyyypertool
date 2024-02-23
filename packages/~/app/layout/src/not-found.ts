//

import config from "@~/app.core/config";
import { html } from "hono/html";
import { Root_Layout } from "./root";

//

export function NotFound({ nonce }: { nonce?: string }) {
  return Root_Layout({
    children: html`
      <main class="min-h-full bg-[--blue-france-975-75] ">
        <div class="fr-container grid h-full grid-cols-2 items-center gap-6">
          <section>
            <h1>Oups, nous n'avons pas trouvé la page que vous recherchez.</h1>
            <p class="fr-text--sm fr-mb-3w">Erreur 404</p>

            <p class="fr-text--lead fr-mb-3w">
              La page que vous cherchez est introuvable.
              <br />
              Excusez-nous pour la gène occasionnée.
            </p>
            <a href="/" class="fr-btn"> Retour à l’accueil </a>
          </section>
          <figure>
            <img src="${config.ASSETS_PATH}/public/assets/404.svg" alt="" />
          </figure>
        </div>
      </main>
    `,
    nonce,
  });
}
