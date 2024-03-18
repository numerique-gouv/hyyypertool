//

import { Htmx_Events, hx_include } from "@~/app.core/htmx";
import { button } from "@~/app.ui/button";
import { fieldset } from "@~/app.ui/form";
import { hx_urls, urls } from "@~/app.urls";
import type { InferRequestType } from "hono";
import { useContext } from "hono/jsx";
import { Desicison_Context } from "./Desicison_Context";
import { ModerationPage_Context } from "./context";

//

export function Member_Valid() {
  const { $accept, $allow, $form } = useContext(Desicison_Context);
  const { domain, moderation } = useContext(ModerationPage_Context);
  const { base, element } = fieldset();
  const $patch = urls.moderations[":id"].$procedures.validate.$patch;
  type FormNames = keyof InferRequestType<typeof $patch>["form"];
  return (
    <form
      _={`
      on load if #${$accept}.checked then remove @hidden end
      on change from #${$form}
        if #${$accept}.checked then remove @hidden else add @hidden end
      on submit
        wait for ${Htmx_Events.enum.afterOnLoad}
        go to the top of body smoothly
        wait 2s
        go back
      `}
      hidden
      {...hx_urls.moderations[":id"].$procedures.validate.$patch({
        param: { id: moderation.id.toString() },
      })}
      hx-include={hx_include([$allow])}
    >
      <fieldset class={base()}>
        <div class={element()}>
          <div class="fr-checkbox-group">
            <input
              _="
              on click set @value to my checked
              "
              id={$allow}
              name={"add_domain" as FormNames}
              type="checkbox"
              value="true"
            />
            <label class="fr-label" for={$allow}>
              J’autorise le domaine <b class="mx-1">{domain}</b> pour toute
              l’organisation
            </label>
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
