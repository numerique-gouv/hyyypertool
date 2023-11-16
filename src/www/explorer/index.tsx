//

import { Main_Layout } from ":layout/main";
import type { ElysiaWWW } from ":www";

//

export default (www: ElysiaWWW) =>
  www.get("/", () => (
    <Main_Layout>
      <div class="fr-container--fluid min-h-full">
        <div class="fr-grid-row">
          <div class="fr-col-12 fr-col-md-4">
            <Aside />
          </div>
          <div class="fr-col-12 fr-col-md-8 fr-py-12v"></div>
        </div>
      </div>
    </Main_Layout>
  ));

function Aside() {
  return (
    <nav class="fr-sidemenu">
      <div class="fr-sidemenu__inner ">
        <div class="fr-search-bar pt-6" role="search">
          <label class="fr-label" for="search-input">
            Recherche
          </label>
          <input
            class="fr-input"
            placeholder="Rechercher"
            type="search"
            id="search-input"
            name="search-input"
          />
          <button class="fr-btn" title="Rechercher">
            Rechercher
          </button>
        </div>
        <ul class="fr-sidemenu__list">
          <AsideItem />
          <AsideItem />
          <AsideItem />
        </ul>
      </div>
    </nav>
  );
}

function AsideItem() {
  return (
    <li class="fr-sidemenu__item">
      <button class="fr-sidemenu__btn">
        <i>User</i>
      </button>
      <div
        id="elements-d-interface-modeles"
        class="fr-collapse fr-colapse fr-collapse--expanded"
        style="--collapse: -160px; --collapse-max-height: none;"
      >
        <ul class="fr-sidemenu__list" hidden>
          <li class="fr-sidemenu__item fr-sidemenu__item--active">
            <a
              href="/elements-d-interface/modeles/page-de-creation-de-compte"
              aria-current="page"
              class="fr-sidemenu__link router-link-exact-active router-link-active"
              id="sidemenu__link-page-de-creation-de-compte"
              target="_self"
            >
              Page de création de compte
            </a>
          </li>
          <li class="fr-sidemenu__item">
            <a
              href="/elements-d-interface/modeles/page-de-connexion"
              class="fr-sidemenu__link"
              id="sidemenu__link-page-de-connexion"
              target="_self"
            >
              Page de connexion
            </a>
          </li>
          <li class="fr-sidemenu__item">
            <a
              href="/elements-d-interface/modeles/page-d-erreurs"
              class="fr-sidemenu__link"
              id="sidemenu__link-page-d-erreurs"
              target="_self"
            >
              Page d'erreurs
            </a>
          </li>
        </ul>
      </div>
    </li>
  );
}
