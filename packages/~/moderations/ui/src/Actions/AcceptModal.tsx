import { hx_include } from "@~/app.core/htmx";
import { button } from "@~/app.ui/button";
import { hx_urls } from "@~/app.urls";
import { useContext } from "hono/jsx";
import { AddDomain } from "./AddDomain";
import { valid_context } from "./context";

export async function AcceptModal({
  userEmail,
  moderation,
}: {
  userEmail: string;
  moderation: any;
}) {
  const context_value = useContext(valid_context);
  const { $add_domain } = context_value;
  const hx_path_validate_moderation = await hx_urls.moderations[
    ":id"
  ].$procedures.validate.$patch({
    param: { id: moderation.id.toString() },
  });
  return (
    <div
      class="fixed bottom-14 right-0 z-50 m-2 hidden w-1/2 justify-self-end border-solid border-[--text-action-high-blue-france] bg-[--blue-france-975-75] p-6"
      id="acceptModal"
    >
      <div class="mb-4 flex items-center justify-between">
        <p class="mb-0 text-lg font-bold">✅ Accepter</p>
        <button
          class="fr-btn fr-icon-subtract-line  fr-btn--tertiary-no-outline"
          _={`
              on click
                add .hidden to #acceptModal
            `}
        >
          Label bouton
        </button>
      </div>
      <p>
        A propos de{" "}
        <span class="font-bold text-[--text-action-high-blue-france]">
          {userEmail}
        </span>
        , je valide :
      </p>
      <form
        {...hx_path_validate_moderation}
        hx-include={hx_include([$add_domain])}
        hx-swap="none"
      >
        <div class="mb-5">
          <AddDomain />
        </div>
        <div>
          <button
            _={`
              on click
                add .hidden to #acceptModal
            `}
            class={button()}
            type="submit"
          >
            Terminer
          </button>
        </div>
      </form>
    </div>
  );
}
