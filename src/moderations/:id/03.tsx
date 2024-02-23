//

import {
  Htmx_Events,
  hx_include,
  hx_trigger_from_body,
} from "@~/app.core/htmx";
import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import { button } from "@~/app.ui/button";
import { Loader } from "@~/app.ui/loader/Loader";
import { LocalTime } from "@~/app.ui/time/LocalTime";
import { urls } from "@~/app.urls";
import { ModerationPage_Context } from "@~/moderations.api/id/index";
import { MODERATION_EVENTS } from "@~/moderations.lib/event";
import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { eq } from "drizzle-orm";
import { useContext } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import { reponse_templates } from "./reponse_templates";

//

export const RESPONSE_MESSAGE_SELECT_ID = "response-message";
export const RESPONSE_TEXTAREA_ID = "response";
export const EMAIL_SUBJECT_INPUT_ID = "mail-subject";
export const EMAIL_TO_INPUT_ID = "mail-to";

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

      <h2>Rejeter la modération : </h2>

      <div
        hx-get={
          urls.legacy.moderations[":id"].email.$url({
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

      <hr />

      <div class="fr-select-group">
        <label class="fr-label" for={RESPONSE_MESSAGE_SELECT_ID}>
          <h6>Motif de rejet : </h6>
        </label>
        <ResponseMessageSelector />
      </div>

      <div class="fr-input-group">
        <label
          class="fr-label flex flex-row justify-between"
          for={RESPONSE_TEXTAREA_ID}
        >
          Texte
          <button
            _={`
            on click
              set text to #${RESPONSE_TEXTAREA_ID}.value
              js(me, text)
                if ('clipboard' in window.navigator) {
                  navigator.clipboard.writeText(text)
                }
              end
            `}
            class={button()}
          >
            📋 Copier
          </button>
        </label>
        <textarea
          class="fr-input"
          rows={20}
          id={RESPONSE_TEXTAREA_ID}
          name={RESPONSE_TEXTAREA_ID}
        ></textarea>
      </div>

      <div class="fr-input-group">
        <label
          class="fr-label flex flex-row justify-between"
          for={EMAIL_SUBJECT_INPUT_ID}
        >
          Object
          <button
            _={`
            on click
              set text to #${EMAIL_SUBJECT_INPUT_ID}.value
              js(me, text)
                if ('clipboard' in window.navigator) {
                  navigator.clipboard.writeText(text)
                }
              end
            `}
            class={button()}
          >
            📋 Copier
          </button>
        </label>
        <input
          class="fr-input"
          type="text"
          id={EMAIL_SUBJECT_INPUT_ID}
          name={EMAIL_SUBJECT_INPUT_ID}
          value={`[MonComptePro] Demande pour rejoindre « ${moderation.organizations.cached_libelle} »`}
        />
      </div>

      <div class="fr-input-group">
        <label
          class="fr-label flex flex-row justify-between"
          for={EMAIL_TO_INPUT_ID}
        >
          Destinataire
          <button
            _={`
            on click
              set text to #${EMAIL_TO_INPUT_ID}.value
              js(me, text)
                if ('clipboard' in window.navigator) {
                  navigator.clipboard.writeText(text)
                }
              end
            `}
            class={button()}
          >
            📋 Copier
          </button>
        </label>
        <input
          class="fr-input"
          type="text"
          readonly={true}
          id={EMAIL_TO_INPUT_ID}
          name={EMAIL_TO_INPUT_ID}
          value={moderation.users.email}
        />
      </div>
      <form
        class="text-right"
        hx-put={
          urls.legacy.moderations[":id"].email.$url({
            param: { id: moderation.id.toString() },
          }).pathname
        }
        hx-include={hx_include([EMAIL_SUBJECT_INPUT_ID, RESPONSE_TEXTAREA_ID])}
        hx-swap="none"
      >
        <button
          _={`
          on click
            wait for ${Htmx_Events.Enum["htmx:afterSwap"]} from body
            go to the top of .last-message smoothly
          `}
          type="submit"
          class={button()}
        >
          <span>Envoyer une réponse via Zammad</span>
        </button>
        <div></div>
        <div>
          <Loader htmx_indicator={true} />
        </div>
      </form>

      <hr />
    </div>
  );
}

function get_organization_members(
  pg: MonComptePro_PgDatabase,
  {
    organization_id,
  }: {
    organization_id: number;
  },
) {
  return pg
    .select()
    .from(schema.users)
    .innerJoin(
      schema.users_organizations,
      eq(schema.users.id, schema.users_organizations.user_id),
    )
    .where(eq(schema.users_organizations.organization_id, organization_id));
}
async function ResponseMessageSelector() {
  const { moderation } = useContext(ModerationPage_Context);
  const {
    var: { moncomptepro_pg },
  } = useRequestContext<MonComptePro_Pg_Context>();
  const users_and_organizations = await get_organization_members(
    moncomptepro_pg,
    {
      organization_id: moderation.organizations.id,
    },
  );

  const members_email = users_and_organizations
    .map(({ users }) => users.email)
    .toSorted();

  return (
    <select
      _={`
      on change
        set #${RESPONSE_TEXTAREA_ID}.value to my value
      `}
      class="fr-select"
      id={RESPONSE_MESSAGE_SELECT_ID}
      name={RESPONSE_MESSAGE_SELECT_ID}
    >
      <option value="" selected disabled hidden>
        Sélectionner une response
      </option>
      {reponse_templates.map(({ label, template }) => (
        <option key={label} value={template({ moderation, members_email })}>
          {label}
        </option>
      ))}
    </select>
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
        urls.legacy.moderations[":id"].processed.$url({
          param: { id: moderation.id.toString() },
        }).pathname
      }
      hx-swap="none"
    >
      <button
        _={`
        on click
          wait for ${Htmx_Events.Enum["htmx:afterOnLoad"]} from body
          go to the top of body smoothly
          wait 1s
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
        urls.legacy.moderations[":id"].rejected.$url({
          param: { id: moderation.id.toString() },
        }).pathname
      }
      hx-swap="none"
    >
      <button
        _={`
        on click
          wait for ${Htmx_Events.Enum["htmx:afterOnLoad"]} from body
          go to the top of body smoothly
          wait 1s
        `}
        class={button({ intent: "dark" })}
      >
        🪄 Marquer comme traité
      </button>
    </form>
  );
}
