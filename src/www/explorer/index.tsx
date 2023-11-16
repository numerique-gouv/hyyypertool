//

import { prisma } from ":database";
import { Main_Layout } from ":layout/main";
import type { ElysiaWWW } from ":www";
import { t } from "elysia";

//

export default (www: ElysiaWWW) =>
  www
    .get("/", () => (
      <Main_Layout>
        <div class="fr-container--fluid">
          <div class="fr-grid-row ">
            <aside
              class="fr-col-12 fr-col-md-4"
              hx-get="/explorer/_/aside"
              hx-target="this"
              hx-trigger="load"
            />
            <div class="fr-col-12 fr-col-md-8 fr-py-12v"></div>
          </div>
        </div>
      </Main_Layout>
    ))
    .get("/_/aside", async ({ request }) => {
      console.log({ request }); // TODO(douglasduteil): recover the path

      const moderations = await prisma.moderations.findMany({
        include: { organizations: true, users: true },
        take: 10,
      });
      return (
        <nav class="fr-sidemenu  flex-grow">
          <div class="fr-sidemenu__inner flex max-h-full flex-col ">
            <div class="fr-search-bar pt-6" role="search">
              <label class="fr-label" for="search-input">
                Recherche
              </label>
              <input
                class="fr-input"
                hx-post="/explorer/_/aside/search"
                hx-trigger="input changed delay:500ms, search"
                hx-target="#search-results"
                id="search-input"
                name="search-input"
                placeholder="Rechercher"
                type="search"
              />
              <button class="fr-btn" title="Rechercher">
                Rechercher
              </button>
              <span class="htmx-indicator"> ...</span>
            </div>
            <ul
              class="fr-sidemenu__list h-full min-h-0 flex-1 overflow-y-auto"
              id="search-results"
            >
              {moderations.map(function (moderation) {
                return (
                  <AsideItem
                    name={moderation.users.given_name ?? "Unknown user"}
                  />
                );
              })}
            </ul>
          </div>
        </nav>
      );
    })
    .post(
      "/_/aside/search",
      async ({ request, query, body }) => {
        const moderation_id = query["moderation_id"];
        const search = body["search-input"];
        console.log({ query, body, search }); // TODO(douglasduteil): recover the path

        const moderations = await prisma.moderations.findMany({
          include: { organizations: true, users: true },
          where: {
            users: { given_name: { contains: search, mode: "insensitive" } },
          },
          take: 10,
        });

        return (
          <>
            {moderations.map(function (moderation) {
              return (
                <AsideItem
                  name={moderation.users.given_name ?? "Unknown user"}
                />
              );
            })}
          </>
        );
      },
      {
        body: t.Object({
          "search-input": t.String(),
        }),
      },
    );

function AsideItem({ name }: { name?: string }) {
  return (
    <li class="fr-sidemenu__item">
      <button class="fr-sidemenu__btn">
        <i safe>{name ? name : "User"}</i>
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
