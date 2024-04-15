//

import { Htmx_Events } from "@~/app.core/htmx";
import { button } from "@~/app.ui/button";
import { copy_to_clipboard } from "@~/app.ui/button/scripts";
import { fieldset } from "@~/app.ui/form";
import { hx_urls, urls } from "@~/app.urls";
import type { InferRequestType } from "hono";
import { useContext } from "hono/jsx";
import { Desicison_Context } from "./Desicison_Context";
import { ModerationPage_Context } from "./context";
import * as accountant from "./responses/accountant";
import * as already_signed from "./responses/already_signed";
import * as chorus_pro from "./responses/chorus_pro";
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
  chorus_pro,
];

//

export function Member_Invalid() {
  const { moderation } = useContext(ModerationPage_Context);
  const {
    $destination,
    $reject,
    $message,
    $object,
    $decision_form: $form,
  } = useContext(Desicison_Context);
  const { base, element } = fieldset();
  const $patch = urls.moderations[":id"].$procedures.rejected.$patch;
  type FormNames = keyof InferRequestType<typeof $patch>["form"];

  return (
    <form
      _={`
      on load if #${$reject}.checked then remove @hidden end
      on change from #${$form}
        if #${$reject}.checked then remove @hidden else add @hidden end
      on submit
        wait for ${Htmx_Events.enum.afterOnLoad}
        go to the top of .last-message smoothly
        wait 2s
        go back
      `}
      hidden
      {...hx_urls.moderations[":id"].$procedures.rejected.$patch({
        param: { id: moderation.id.toString() },
      })}
      hx-swap="none"
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
              name={"message" as FormNames}
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
              name={"subject" as FormNames}
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
