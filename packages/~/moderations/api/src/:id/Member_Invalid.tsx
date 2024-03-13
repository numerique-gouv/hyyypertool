//

import { button } from "@~/app.ui/button";
import { fieldset } from "@~/app.ui/form";
import { useContext } from "hono/jsx";
import { Desicison_Context } from "./Desicison_Context";
import { RESPONSE_MESSAGE_SELECT_ID, RESPONSE_TEXTAREA_ID } from "./context";
import * as already_signed from "./responses/already_signed";
import * as first_last_name from "./responses/first_last_name";

//

const reponse_templates = [first_last_name, already_signed];

//

export function Member_Invalid() {
  const { $reject, $message, $form } = useContext(Desicison_Context);
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
              class="fr-label flex flex-row justify-between"
              for={$message}
            >
              Message
            </label>
            <textarea
              class="fr-input"
              rows={20}
              id={$message}
              name={RESPONSE_TEXTAREA_ID}
            ></textarea>
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
