import { hyper_ref } from "@~/app.core/html";
import { validate_form_schema } from "@~/moderations.lib/schema/validate.form";
import { useContext } from "hono/jsx";
import { context } from "./context";

export function AddDomain() {
  const { domain } = useContext(context);
  const id = hyper_ref();
  return (
    <div class="fr-checkbox-group">
      <input
        id={id}
        name={validate_form_schema.keyof().Enum.add_domain}
        type="checkbox"
        value="true"
      />
      <label class="fr-label flex-row!" for={id}>
        J’autorise le domaine <b class="mx-1">{domain}</b> pour toute
        l’organisation
      </label>
    </div>
  );
}
