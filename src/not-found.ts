//

import env from ":common/env";
import { Root_Layout } from ":ui/layout/root";
import { html } from "hono/html";

//

export function NotFound({ nonce }: { nonce?: string }) {
  return Root_Layout({
    children: html`
      <main class="flex h-full flex-grow flex-col items-center justify-center">
        <div class="card-container not-found-error">
          <img
            src="/assets/${env.VERSION}/public/assets/404_error_page_not_found_with_people_connecting_a_plug_rafiki_1.svg"
            alt=""
          />
          <h3>Oups, nous n'avons pas trouvé la page que vous recherchez.</h3>
          <a href="/" class="fr-btn"> Retour à l’accueil </a>
        </div>
      </main>
    `,
    nonce,
  });
}
