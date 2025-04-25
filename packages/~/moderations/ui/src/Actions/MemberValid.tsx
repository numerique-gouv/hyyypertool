//

import { Htmx_Events } from "@~/app.core/htmx";
import { button } from "@~/app.ui/button";
import { fieldset } from "@~/app.ui/form";
import { hx_urls } from "@~/app.urls";
import { useContext } from "hono/jsx";
import { AddAsMemberExternal } from "./AddAsMemberExternal";
import { AddAsMemberInternal } from "./AddAsMemberInternal";
import { AddDomain } from "./AddDomain";
import { context, valid_context } from "./context";
import { SendNotification } from "./SendNotification";
import { TagInput } from "./TagInput";

//

export async function MemberValid() {
  const { moderation, $decision_form, $accept, query_is_user_external_member } =
    useContext(context);
  const context_value = useContext(valid_context);
  const { base, element } = fieldset();
  const hx_path_validate_moderation = await hx_urls.moderations[
    ":id"
  ].$procedures.validate.$patch({
    param: { id: moderation.id.toString() },
  });

  const is_already_external_member = await query_is_user_external_member({
    organization_id: moderation.organization.id,
    user_id: moderation.user.id,
  });

  return (
    <valid_context.Provider
      value={{ ...context_value, is_already_external_member }}
    >
      <form
        _={`
      on load if #${$accept}.checked then remove @hidden end
      on change from #${$decision_form}
        if #${$accept}.checked then remove @hidden else add @hidden end
      on submit
        wait for ${Htmx_Events.enum.afterOnLoad}
        go to the top of body smoothly
        wait 2s
        go back
      `}
        hidden
        {...hx_path_validate_moderation}
        hx-swap="none"
      >
        <fieldset class={base({ class: "m-0" })}>
          <div class={element()}>
            <AddDomain />
          </div>
          <div class={element()}>
            <AddAsMemberInternal />
          </div>
          <div class={element()}>
            <AddAsMemberExternal />
          </div>
          <div class={element()}>
            <SendNotification />
          </div>
          <div class={element()}>
            <TagInput />
          </div>
          <div class={element({ class: "m-0" })}>
            <button class={button()} type="submit">
              Terminer
            </button>
          </div>
        </fieldset>
      </form>
    </valid_context.Provider>
  );
}
