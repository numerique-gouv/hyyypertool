//

import { hyper_ref } from "@~/app.core/html";
import { hx_trigger_from_body } from "@~/app.core/htmx";
import { button } from "@~/app.ui/button";
import { Loader } from "@~/app.ui/loader/Loader";
import { hx_urls } from "@~/app.urls";
import { ORGANISATION_EVENTS } from "@~/organizations.lib/event";
import { useContext } from "hono/jsx";
import { ModerationPage_Context } from "./context";

//

export function Members_Of_Organization_Table() {
  const uuid = hyper_ref();
  const { moderation } = useContext(ModerationPage_Context);

  return (
    <section>
      <h3 id={uuid}>👥 Membres connus dans l’organisation</h3>

      <div
        class="fr-table"
        {...hx_urls.organizations[":id"].members.$get({
          param: {
            id: moderation.organization_id.toString(),
          },
          query: { describedby: uuid },
        })}
        hx-target="this"
        hx-trigger={[
          "load",
          hx_trigger_from_body([ORGANISATION_EVENTS.Enum.MEMBERS_UPDATED]),
        ].join(", ")}
        id="table-organisation-members"
      >
        <center>
          <Loader />
        </center>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <Button_Add_As_Internal />
        <Button_Add_As_External />
      </div>
    </section>
  );
}

function Button_Add_As_Internal() {
  const { moderation } = useContext(ModerationPage_Context);
  return (
    <button
      class={button({ className: "block", intent: "warning" })}
      {...hx_urls.organizations[":id"].members[
        ":user_id"
      ].$procedures.join.$post({
        param: {
          id: moderation.organization_id.toString(),
          user_id: moderation.user_id.toString(),
        },
      })}
      hx-swap="none"
      hx-vals={JSON.stringify({ is_external: false })}
    >
      🪄 Action en un click : <b>{moderation.users.given_name}</b> est un membre
      interne de l'organization.
      <ul class="text-left">
        <li>
          ajouter {moderation.users.given_name} à l'organisation EN TANT
          QU'INTERNE
          <small> (si pas déjà dans l'orga)</small>
        </li>
        <li>
          lui envoyer un mail avec la liste des personnes présente dans
          l'organisation
          <small> (le cas échéant et si pas déjà envoyé)</small>
        </li>
        <li>
          envoyer un mail au membre existant de l'organisation pour les prévenir
          de l'arrivée de {moderation.users.given_name}{" "}
          <small> (le cas échéant et si pas déjà envoyé) </small>
        </li>
      </ul>
    </button>
  );
}

function Button_Add_As_External() {
  const { moderation } = useContext(ModerationPage_Context);
  return (
    <button
      class={button({ className: "block", intent: "warning" })}
      {...hx_urls.organizations[":id"].members[
        ":user_id"
      ].$procedures.join.$post({
        param: {
          id: moderation.organization_id.toString(),
          user_id: moderation.user_id.toString(),
        },
      })}
      hx-swap="none"
      hx-vals={JSON.stringify({ is_external: true })}
    >
      🪄 Action en un click : <b>{moderation.users.given_name}</b> est un membre
      externe de l'organization.
      <ul class="text-left">
        <li>
          ajouter {moderation.users.given_name} à l'organisation EN TANT QUE
          EXTERNE
          <small> (si pas déjà dans l'orga)</small>
        </li>
        <li>
          envoyer un mail au membre existant de l'organisation pour les prévenir
          de l'arrivée de {moderation.users.given_name}
          <small> (le cas échéant et si pas déjà envoyé)</small>
        </li>
      </ul>
    </button>
  );
}
