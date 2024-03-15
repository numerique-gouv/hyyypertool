//

import config from "@~/app.core/config";
import { html } from "hono/html";
import { Root_Layout } from "./root";

//

export function Error_Page({ error, nonce }: { error: Error; nonce?: string }) {
  return Root_Layout({
    children: html`
      <main class="flex h-full flex-grow flex-col items-center justify-center">
        <div class="card-container not-found-error">
          <img src="${config.PUBLIC_ASSETS_PATH}/404.svg" alt="" />
          <h3>Oups, une error c'est produit.</h3>
          <pre>${error.message}</pre>
          <a href="/" class="fr-btn"> Retour à l’accueil </a>
        </div>
      </main>
    `,
    nonce,
  });
}
