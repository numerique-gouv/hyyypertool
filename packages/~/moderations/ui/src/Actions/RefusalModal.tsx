import {
  Htmx_Events,
  hx_disabled_form_elements,
  hx_include,
} from "@~/app.core/htmx";
import { button } from "@~/app.ui/button";
import { hx_urls } from "@~/app.urls";
import { reject_form_schema } from "@~/moderations.lib/schema/rejected.form";
import { useContext } from "hono/jsx";
import { context, reject_context } from "./context";
import { ResponseMessageSelector } from "./ResponseMessageSelector";

export async function RefusalModal({ userEmail }: { userEmail: string }) {
  const { moderation } = useContext(context);
  const { $modal_message, $object, $destination } = useContext(reject_context);

  return (
    <div
      class="fixed bottom-14 right-0 z-50 m-2 hidden w-1/2 justify-self-end border-solid border-[--text-action-high-blue-france] bg-[--blue-france-975-75] p-6"
      id="refusalModal"
      aria-label="la modale de refus"
    >
      <form
        {...await hx_urls.moderations[":id"].$procedures.rejected.$patch({
          param: { id: moderation.id.toString() },
        })}
        {...hx_disabled_form_elements}
        hx-include={hx_include([$object, $destination])}
        hx-swap="none"
        _={`
          on submit
            add .hidden to #refusalModal
            wait for ${Htmx_Events.enum.afterOnLoad}
            go to the top of body smoothly
            wait 2s
            go back
          `}
      >
        <div class="mb-4 flex items-center justify-between">
          <input
            class="fr-input hidden"
            type="text"
            id={$object}
            name={reject_form_schema.keyof().Enum.subject}
            value={`[ProConnect] Demande pour rejoindre « ${moderation.organization.cached_libelle} »`}
          />
          <p class="mb-0 text-lg font-bold">❌ Refuser</p>
          <button
            class="fr-btn fr-icon-subtract-line fr-btn--tertiary-no-outline"
            type="button"
            _={`
              on click
                add .hidden to #refusalModal
            `}
          >
            Label bouton
          </button>
        </div>
        <p>Vous refusez la demande de {userEmail}</p>
        <p class="my-2">Motif de refus</p>
        <ResponseMessageSelector $message={$modal_message} />
        <div class="my-2">
          <label class="fr-label" for={$modal_message}>
            Message
          </label>
          <textarea
            class="fr-input"
            rows={5}
            id={$modal_message}
            name={reject_form_schema.keyof().Enum.message}
            _={`
                on change set ${$modal_message} to my value
              `}
          />
        </div>
        <button class={`${button()} w-full justify-center`} type="submit">
          Notifier le membre et terminer
        </button>
      </form>
    </div>
  );
}
