//

import { button } from "@~/app.ui/button";
import { copy_to_clipboard } from "@~/app.ui/button/scripts";
import { fieldset } from "@~/app.ui/form";
import { hx_urls } from "@~/app.urls";
import { useContext } from "hono/jsx";
import { Desicison_Context } from "./Desicison_Context";
import {
  EMAIL_TO_INPUT_ID,
  ModerationPage_Context,
  RESPONSE_MESSAGE_SELECT_ID,
  RESPONSE_TEXTAREA_ID,
} from "./context";
import * as accountant from "./responses/accountant";
import * as already_signed from "./responses/already_signed";
import * as contractors from "./responses/contractors";
import * as first_last_name from "./responses/first_last_name";
import * as invalid_name_job from "./responses/invalid_name_job";
import * as link_with_eduction_gouv_fr from "./responses/link_with_eduction_gouv_fr";
import * as link_with_organization from "./responses/link_with_organization";
import * as mobilic from "./responses/mobilic";
import * as use_official_email from "./responses/use_official_email";
import * as use_pro_email from "./responses/use_pro_email";

//

const reponse_templates = [
  first_last_name,
  link_with_organization,
  use_pro_email,
  use_official_email,
  already_signed,
  link_with_eduction_gouv_fr,
  mobilic,
  contractors,
  accountant,
  invalid_name_job,
];

//

export function Member_Invalid() {
  const { moderation } = useContext(ModerationPage_Context);
  const { $destination, $reject, $message, $object, $form } =
    useContext(Desicison_Context);
  const { base, element } = fieldset();

  return (
    <form
      _={`
      on load if #${$reject}.checked then remove @hidden end
      on change from #${$form}
        if #${$reject}.checked then remove @hidden else add @hidden end
      `}
      action="javascript:void(0);"
      hidden
      {...hx_urls.moderations[":id"].$procedures.rejected.$patch({
        param: { id: moderation.id.toString() },
      })}
    >
      <fieldset class={base()}>
        <div class={element()}>
          <label class="fr-label">
            <h6>Motif de refus : </h6>
          </label>
          <ResponseMessageSelector />
        </div>
        <div class={element()}>
          <div class="fr-input-group">
            <label
              class="fr-label flex flex-row items-center justify-between"
              for={$message}
            >
              Message
              <button
                _={copy_to_clipboard(`#${$message}`)}
                class={button()}
                type="button"
              >
                📋 Copier
              </button>
            </label>
            <textarea
              class="fr-input"
              rows={20}
              id={$message}
              name={RESPONSE_TEXTAREA_ID}
            ></textarea>
          </div>
        </div>

        <div class={element()}>
          <div class="fr-input-group">
            <label
              class="fr-label flex flex-row items-center justify-between"
              for={$object}
            >
              Object
              <button
                _={`
                on click
                  set text to #${$object}.value
                  js(me, text)
                    if ('clipboard' in window.navigator) {
                      navigator.clipboard.writeText(text)
                    }
                  end
                `}
                class={button()}
                type="button"
              >
                📋 Copier
              </button>
            </label>
            <input
              class="fr-input"
              type="text"
              id={$object}
              name={$object}
              value={`[MonComptePro] Demande pour rejoindre « ${moderation.organizations.cached_libelle} »`}
            />
          </div>
        </div>

        <div class={element()}>
          <div class="fr-input-group">
            <label
              class="fr-label flex flex-row items-center justify-between"
              for={$destination}
            >
              Destinataire
              <button
                _={`
            on click
              set text to #${$destination}.value
              js(me, text)
                if ('clipboard' in window.navigator) {
                  navigator.clipboard.writeText(text)
                }
              end
            `}
                class={button()}
                type="button"
              >
                📋 Copier
              </button>
            </label>
            <input
              class="fr-input"
              type="text"
              readonly={true}
              id={$destination}
              name={EMAIL_TO_INPUT_ID}
              value={moderation.users.email}
            />
          </div>
        </div>
        <div class={element({ class: "mt-8" })}>
          <button class={button()} type="submit">
            Notifier le membre et terminer
          </button>
        </div>
      </fieldset>
    </form>
  );
}

function ResponseMessageSelector() {
  const { $message, $select } = useContext(Desicison_Context);
  return (
    <select
      _={`
      on change
        set #${$message}.value to my value
      `}
      class="fr-select"
      id={$select}
      name={RESPONSE_MESSAGE_SELECT_ID}
    >
      <option value="" selected disabled hidden>
        Sélectionner une response
      </option>
      {reponse_templates.map(async ({ label, default: template }) => (
        <option key={label} value={await Promise.resolve(template())}>
          {label}
        </option>
      ))}
    </select>
  );
}
