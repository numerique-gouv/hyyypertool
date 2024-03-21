//

import { Htmx_Events, hx_include } from "@~/app.core/htmx";
import { button } from "@~/app.ui/button";
import { fieldset } from "@~/app.ui/form";
import { hx_urls } from "@~/app.urls";
import { useContext } from "hono/jsx";
import { FORM_SCHEMA } from "./$procedures/validate";
import { Desicison_Context } from "./Desicison_Context";
import { ModerationPage_Context } from "./context";

//

export function Member_Valid() {
  const { $accept, $add_domain, $form } = useContext(Desicison_Context);
  const { moderation } = useContext(ModerationPage_Context);
  const { base, element } = fieldset();

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
      hx-include={hx_include([$add_domain])}
    >
      <fieldset class={base()}>
        <div class={element()}>
          <AddDomain />
        </div>
        <div class={element()}>
          <DoNotAddMember />
        </div>
        <div class={element()}>
          <AddAsMemberInternal />
        </div>
        <div class={element()}>
          <AddAsMemberExternal />
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

function AddDomain() {
  const { $add_domain } = useContext(Desicison_Context);
  const { domain } = useContext(ModerationPage_Context);

  return (
    <div class="fr-checkbox-group">
      <input
        id={$add_domain}
        name={FORM_SCHEMA.keyof().Enum.add_domain}
        type="checkbox"
        value="true"
      />
      <label class="fr-label !flex-row" for={$add_domain}>
        J’autorise le domaine <b class="mx-1">{domain}</b> pour toute
        l’organisation
      </label>
    </div>
  );
}

function DoNotAddMember() {
  const { $do_not_add_member } = useContext(Desicison_Context);
  const {
    moderation: {
      users: { given_name },
    },
  } = useContext(ModerationPage_Context);

  return (
    <div class="fr-radio-group">
      <input
        id={$do_not_add_member}
        name={FORM_SCHEMA.keyof().Enum.add_member}
        type="radio"
        value={FORM_SCHEMA.shape.add_member.Enum.NOPE}
      />
      <label class="fr-label !flex-row" for={$do_not_add_member}>
        Ne pas ajouter <b class="mx-1">{given_name}</b> à l'organisation
      </label>
    </div>
  );
}

function AddAsMemberInternal() {
  const { $add_as_internal_member } = useContext(Desicison_Context);
  const {
    moderation: {
      users: { given_name },
    },
  } = useContext(ModerationPage_Context);

  return (
    <div class="fr-radio-group">
      <input
        id={$add_as_internal_member}
        name={FORM_SCHEMA.keyof().Enum.add_member}
        type="radio"
        value={FORM_SCHEMA.shape.add_member.Enum.AS_INTERNAL}
      />
      <label class="fr-label !flex-row" for={$add_as_internal_member}>
        Ajouter <b class="mx-1">{given_name}</b> à l'organisation EN TANT
        QU'INTERNE
      </label>
    </div>
  );
}

function AddAsMemberExternal() {
  const { $add_as_external_member } = useContext(Desicison_Context);
  const {
    moderation: {
      users: { given_name },
    },
  } = useContext(ModerationPage_Context);

  return (
    <div class="fr-radio-group">
      <input
        id={$add_as_external_member}
        name={FORM_SCHEMA.keyof().Enum.add_member}
        type="radio"
        value={FORM_SCHEMA.shape.add_member.Enum.AS_EXTERNAL}
      />
      <label class="fr-label !flex-row" for={$add_as_external_member}>
        Ajouter <b class="mx-1">{given_name}</b> à l'organisation EN TANT
        QU'EXTERNE
      </label>
    </div>
  );
}
