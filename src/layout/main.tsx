//

import type { Child } from "hono/jsx";
import { Root_Layout } from "./root";

//

export function Main_Layout({ children }: { children?: Child }) {
  return (
    <Root_Layout>
      <div class="flex flex-grow flex-col">
        <header role="banner" class="fr-header">
          <div class="fr-header__body">
            <div class="fr-container">
              <div class="fr-header__body-row">
                <Brand />
                <Tools />
              </div>
            </div>
            {/*  */}
          </div>
        </header>
        <div class="relative flex flex-1 flex-col">{children}</div>
      </div>
    </Root_Layout>
  );
}

function Brand() {
  return (
    <div class="fr-header__brand fr-enlarge-link">
      <div class="fr-header__brand-top">
        <div class="fr-header__logo">
          <p class="fr-logo">
            République
            <br />
            Française
          </p>
        </div>
      </div>
      <div class="fr-header__service">
        <a href="/" title="Accueil ">
          <p class="fr-header__service-title">Hypertool</p>
        </a>
        <p class="fr-header__service-tagline">hyyyyyyyypertool</p>
      </div>
    </div>
  );
}

function Tools() {
  return (
    <div class="fr-header__tools">
      <div class="fr-header__tools-links">
        <ul class="fr-btns-group">
          {/* <li>
            <a class="fr-btn fr-icon-add-circle-line" href="[url - à modifier]">
              Créer un espace
            </a>
          </li>
          <li>
            <a class="fr-btn fr-icon-account-line" href="[url - à modifier]">
              S’enregistrer
            </a>
          </li> */}
        </ul>
      </div>
    </div>
  );
}
