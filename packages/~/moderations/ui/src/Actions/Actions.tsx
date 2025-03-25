//

import { hyper_ref } from "@~/app.core/html";
import { hx_include } from "@~/app.core/htmx";
import { z_email_domain } from "@~/app.core/schema/z_email_domain";
import { button } from "@~/app.ui/button";
import { fieldset } from "@~/app.ui/form";
import { hx_urls } from "@~/app.urls";
import { MessageInfo } from "@~/moderations.ui/MessageInfo";
import { useContext } from "hono/jsx";
import { AddAsMemberExternal } from "./AddAsMemberExternal";
import { AddAsMemberInternal } from "./AddAsMemberInternal";
import { context, valid_context, type Values } from "./context";
import { Desicison } from "./Desicison";
import { MemberInvalid } from "./MemberInvalid";
import { MemberValid } from "./MemberValid";

//

type ActionProps = {
  value: Omit<Values, "$accept" | "$decision_form" | "$reject" | "domain">;
};

export async function Actions({ value }: ActionProps) {
  const { moderation } = value;

  const { user } = moderation;

  const hx_moderation_reprocess_props = await hx_urls.moderations[
    ":id"
  ].$procedures.reprocess.$patch({
    param: { id: moderation.id.toString() },
  });

  const domain = z_email_domain.parse(moderation.user.email, {
    path: ["user.email"],
  });
  const context_value = useContext(valid_context);
  const { $add_domain } = context_value;
  const { element } = fieldset();

  const hx_path_validate_moderation = await hx_urls.moderations[
    ":id"
  ].$procedures.validate.$patch({
    param: { id: moderation.id.toString() },
  });

  return (
    <context.Provider
      value={{
        $accept: hyper_ref(),
        $decision_form: hyper_ref(),
        $reject: hyper_ref(),
        domain,
        ...value,
      }}
    >
      <div class="bg-[var(--background-alt-blue-france)] p-8">
        <h2>Actions de modération</h2>

        <MessageInfo moderation={moderation} />

        <hr class="bg-none" />
        {moderation.moderated_at ? (
          <button
            class={button({ size: "sm", type: "tertiary" })}
            {...hx_moderation_reprocess_props}
            hx-swap="none"
          >
            Retraiter
          </button>
        ) : (
          <>
            <Desicison />
            <MemberValid />
            <MemberInvalid />
          </>
        )}
      </div>
      {/* <>
      toolbar
      Accepte
      dcline
      </> */}

      <div class="fixed bottom-0 left-0 right-0 w-full shadow-lg">
        <form
          {...hx_path_validate_moderation}
          hx-include={hx_include([$add_domain])}
          hx-swap="none"
        >
          {/* <fieldset> */}
          <div
            class="m-2 justify-self-end border-solid border-[--text-action-high-blue-france] bg-[--blue-france-975-75] p-6 md:w-1/2"
            id="modal"
          >
            <div class="mb-4 flex items-center justify-between">
              <p class="mb-0 text-lg font-bold">✅ Accepter</p>
              <button
                class="fr-btn fr-icon-subtract-line  fr-btn--tertiary-no-outline"
                _={`
                    on click
                      add .hidden to #modal
                  `}
              >
                Label bouton
              </button>
            </div>
            <p>
              A propos de{" "}
              <span class="font-bold text-[--text-action-high-blue-france]">
                {user.email}
              </span>
              , je valide :
            </p>
            <div class={element()}>
              <AddAsMemberInternal />
            </div>
            <div class={element()}>
              <AddAsMemberExternal />
            </div>
            <div class={element({ class: "mt-8" })}>
              <button
                _={`
                    on click
                      add .hidden to #modal
                  `}
                class={button()}
                type="submit"
              >
                Terminer
              </button>
            </div>
          </div>
          {/* </fieldset> */}
        </form>
        <div class="fr-p-1w flex justify-end bg-[--blue-france-975-75]">
          <button
            class="fr-btn fr-mr-2w fr-btn--secondary bg-white"
            _={`
              on click
                remove .hidden from #modal
            `}
          >
            ✅ Accepter
          </button>

          <button class="fr-btn fr-mr-2w fr-btn--secondary bg-white">
            ❌ Refuser
          </button>
          <a
            href="#exchange_moderation"
            class="fr-btn fr-btn--secondary bg-white"
            onclick="document.getElementById('exchange_details').setAttribute('open', ''); return true;"
          >
            💬 Voir les échanges
          </a>
        </div>
      </div>
    </context.Provider>
  );
}
