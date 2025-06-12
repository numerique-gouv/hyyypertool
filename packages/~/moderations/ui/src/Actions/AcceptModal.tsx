import { Htmx_Events } from "@~/app.core/htmx";
import { button } from "@~/app.ui/button";
import { hx_urls } from "@~/app.urls";
import { AddAsMemberExternal } from "./AddAsMemberExternal";
import { AddAsMemberInternal } from "./AddAsMemberInternal";
import { AddDomain } from "./AddDomain";
import { SendNotification } from "./SendNotification";
import { TagInput } from "./TagInput";

export async function AcceptModal({
  userEmail,
  moderation,
}: {
  userEmail: string;
  moderation: any;
}) {
  const hx_path_validate_moderation = await hx_urls.moderations[
    ":id"
  ].$procedures.validate.$patch({
    param: { id: moderation.id.toString() },
  });
  return (
    <div
      class="fixed bottom-14 right-0 z-50 m-2 hidden w-1/2 justify-self-end border-solid border-(--text-action-high-blue-france) bg-(--blue-france-975-75) px-4 py-2"
      id="acceptModal"
      aria-label="la modale de validation"
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
          Fermer la modale
        </button>
      </div>
      <p>
        A propos de{" "}
        <span class="font-bold text-(--text-action-high-blue-france)">
          {userEmail}{" "}
        </span>
        pour l'organisation <b>{moderation.organization.cached_libelle}</b>, je
        valide :
      </p>
      <form
        {...hx_path_validate_moderation}
        hx-swap="none"
        _={`
            on submit
              wait for ${Htmx_Events.enum.afterSettle}
              add .hidden to #acceptModal
              go to the top of body smoothly
              wait 2s
              go back
          `}
      >
        <div class="mb-5">
          <AddDomain />
        </div>
        <div class="mb-5">
          <AddAsMemberInternal />
        </div>
        <div class="mb-5">
          <AddAsMemberExternal />
        </div>
        <div class="mb-5">
          <TagInput />
        </div>
        <div class="mb-5">
          <SendNotification />
        </div>
        <div>
          <button class={`${button()} justify-center`} type="submit">
            Terminer
          </button>
        </div>
      </form>
    </div>
  );
}
