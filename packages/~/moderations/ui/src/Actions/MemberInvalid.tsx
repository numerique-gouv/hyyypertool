//

import { Htmx_Events, hx_disabled_form_elements } from "@~/app.core/htmx";
import { button } from "@~/app.ui/button";
import { copy_value_to_clipboard } from "@~/app.ui/button/scripts";
import { fieldset } from "@~/app.ui/form";
import { hx_urls } from "@~/app.urls";
import { reject_form_schema } from "@~/moderations.lib/schema/rejected.form";
import { useContext } from "hono/jsx";
import { ResponseMessageSelector } from "./ResponseMessageSelector";
import { context, reject_context } from "./context";

//

export async function MemberInvalid() {
  const { moderation, $reject, $decision_form } = useContext(context);
  const { $destination, $message, $object } = useContext(reject_context);
  const { base, element } = fieldset();

  return (
    <form
      _={`
      on load if #${$reject}.checked then remove @hidden end
      on change from #${$decision_form}
        if #${$reject}.checked then remove @hidden else add @hidden end
      on submit
        wait for ${Htmx_Events.enum.afterOnLoad}
        go to the top of .last-message smoothly
        wait 2s
        go back
      `}
      hidden
      {...await hx_urls.moderations[":id"].$procedures.rejected.$patch({
        param: { id: moderation.id.toString() },
      })}
      {...hx_disabled_form_elements}
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
                _={copy_value_to_clipboard(`#${$message}`)}
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
              name={reject_form_schema.keyof().Enum.message}
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
              name={reject_form_schema.keyof().Enum.subject}
              value={`[ProConnect] Demande pour rejoindre « ${moderation.organization.cached_libelle} »`}
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
              value={moderation.user.email}
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
