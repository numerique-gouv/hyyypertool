//

import { Htmx_Events, hx_trigger_from_body } from "@~/app.core/htmx";
import { button } from "@~/app.ui/button";
import { Loader } from "@~/app.ui/loader/Loader";
import { LocalTime } from "@~/app.ui/time/LocalTime";
import { urls } from "@~/app.urls";
import { MODERATION_EVENTS } from "@~/moderations.lib/event";
import { useContext } from "hono/jsx";
import { ModerationPage_Context } from "./context";

//

export async function _03() {
  const { moderation } = useContext(ModerationPage_Context);

  return (
    <div class="fr-container">
      <h1>✉️ 3. J'ai pris ma décision</h1>

      <hr />

      <h2>Valider la modération : </h2>
      <SendModerationProcessedEmail />
      <MarkModerationProcessed />

      <hr />

      <h2>Échanges entre {moderation.users.given_name} et nous : </h2>

      <div
        hx-get={
          urls.moderations[":id"].email.$url({
            param: { id: moderation.id.toString() },
          }).pathname
        }
        hx-trigger={[
          "load",
          hx_trigger_from_body([
            MODERATION_EVENTS.Enum.MODERATION_EMAIL_UPDATED,
          ]),
        ].join(", ")}
      >
        <div class="my-24 flex flex-col items-center justify-center">
          Chargement des échanges avec {moderation.users.given_name}
          <br />
          <Loader />
        </div>
      </div>

      <MarkModerationProcessed />
    </div>
  );
}

function SendModerationProcessedEmail() {
  const { moderation } = useContext(ModerationPage_Context);
  const disabled =
    moderation.type !== "organization_join_block" &&
    moderation.type !== "ask_for_sponsorship";
  return (
    <form
      class="m-auto my-12 w-fit"
      hx-patch={
        urls.moderations[":id"].$procedures.processed.$url({
          param: { id: moderation.id.toString() },
        }).pathname
      }
      hx-swap="none"
    >
      <button
        _={`
        set :form to the closest parent <form/>
        on ${Htmx_Events.enum.confirm} from :form
          toggle @disabled until ${Htmx_Events.enum.afterOnLoad} from :form
        on click
          wait for ${Htmx_Events.enum.afterOnLoad} from :form
          go to the top of body smoothly
          wait 1s
          go back
        `}
        class={button({ intent: "dark" })}
        disabled={disabled}
      >
        🪄 Action en un click : Envoyer l'email « Votre demande a été traitée »
      </button>
    </form>
  );
}

function MarkModerationProcessed() {
  const { moderation } = useContext(ModerationPage_Context);
  if (moderation.moderated_at)
    return (
      <button class={button({ intent: "dark" })} disabled={true}>
        Cette modération a été marqué comme traitée le{" "}
        <b>
          <LocalTime date={moderation.moderated_at} />
        </b>
        .
      </button>
    );

  return (
    <form
      class="m-auto my-12 w-fit"
      hx-patch={
        urls.moderations[":id"].$procedures.rejected.$url({
          param: { id: moderation.id.toString() },
        }).pathname
      }
      hx-swap="none"
    >
      <button
        _={`
        set :form to the closest parent <form/>
        on ${Htmx_Events.enum.confirm} from :form
          toggle @disabled until ${Htmx_Events.enum.afterOnLoad} from :form
        on click
          wait for ${Htmx_Events.enum.afterOnLoad} from :form
          wait 1s
          go to the top of body smoothly
          wait 1s
          go back
        `}
        class={button({ intent: "dark" })}
      >
        🪄 Marquer comme traité
      </button>
    </form>
  );
}
