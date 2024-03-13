//

import { button } from "@~/app.ui/button";
import { fieldset } from "@~/app.ui/form";
import { useContext } from "hono/jsx";
import { Desicison_Context } from "./Desicison_Context";
import { ModerationPage_Context } from "./context";

//

export function Member_Valid() {
  const { $accept, $form } = useContext(Desicison_Context);
  const { domain } = useContext(ModerationPage_Context);
  const { base, element } = fieldset();

  return (
    <form
      _={`
      on load if #${$accept}.checked then remove @hidden end
      on change from #${$form}
        if #${$accept}.checked then remove @hidden else add @hidden end
      `}
      action="javascript:void(0);"
      hidden
    >
      <fieldset class={base()} id="radio-inline">
        <div class={element()}>
          <div class="fr-checkbox-group">
            <input type="checkbox" id="allow" name="radio-inline" />
            <label class="fr-label" for="allow">
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
