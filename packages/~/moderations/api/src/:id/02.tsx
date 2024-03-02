//

import { button } from "@~/app.ui/button";
import { hx_urls } from "@~/app.urls";
import { ORGANISATION_EVENTS } from "@~/organizations.lib/event";
import { useContext } from "hono/jsx";
import { ModerationPage_Context } from "./context";

//

export async function _02() {
  const { moderation } = useContext(ModerationPage_Context);

  return (
    <div class="mx-auto mt-6 !max-w-6xl" id="02">
      <br />
      <h3>Membres enregistrés dans cette organisation :</h3>
      <div
        {...hx_urls.organizations[":id"].members.$get({
          param: {
            id: moderation.organization_id.toString(),
          },
          query: {},
        })}
        hx-target="this"
        hx-trigger={`load, ${ORGANISATION_EVENTS.Enum.MEMBERS_UPDATED} from:body`}
        class="fr-table"
        id="table-organisation-members"
      ></div>
      <div class="grid grid-cols-2 gap-1">
        <button
          class={button({ className: "block", intent: "warning" })}
          {...hx_urls.organizations[":id"].members[":user_id"].$post({
            param: {
              id: moderation.organization_id.toString(),
              user_id: moderation.user_id.toString(),
            },
          })}
          hx-swap="none"
          hx-vals={JSON.stringify({ is_external: "false" })}
        >
          🪄 Action en un click :<br />- ajouter {moderation.users.given_name} à
          l'organisation EN TANT QU'INTERNE (si pas déjà dans l'orga)
          <br />
          - lui envoyer un mail avec la liste des personnes présente dans
          l'organisation (le cas échéant et si pas déjà envoyé)
          <br />- envoyer un mail au membre existant de l'organisation pour les
          prévenir de l'arrivée de {moderation.users.given_name} (le cas échéant
          et si pas déjà envoyé)
        </button>
        <button
          class={button({ className: "block", intent: "warning" })}
          {...hx_urls.organizations[":id"].members[":user_id"].$post({
            param: {
              id: moderation.organization_id.toString(),
              user_id: moderation.user_id.toString(),
            },
          })}
          hx-swap="none"
          hx-vals={JSON.stringify({
            is_external: true,
          })}
        >
          🪄 Action en un click :<br />- ajouter {moderation.users.given_name} à
          l'organisation EN TANT QUE EXTERNE (si pas déjà dans l'orga)
          <br />- envoyer un mail au membre existant de l'organisation pour les
          prévenir de l'arrivée de {moderation.users.given_name} (le cas échéant
          et si pas déjà envoyé)
        </button>
      </div>
    </div>
  );
}
