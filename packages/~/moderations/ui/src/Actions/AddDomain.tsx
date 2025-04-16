import { validate_form_schema } from "@~/moderations.lib/schema/validate.form";
import { useContext } from "hono/jsx";
import { context, valid_context } from "./context";

export function AddDomain() {
  const { $add_domain } = useContext(valid_context);
  const { domain } = useContext(context);

  return (
    <div class="fr-checkbox-group">
      <input
        id={$add_domain}
        name={validate_form_schema.keyof().Enum.add_domain}
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
