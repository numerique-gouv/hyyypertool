//

import { useContext } from "hono/jsx";
import { reject_context } from "./context";
import { reponse_templates } from "./responses";

//

export function ResponseMessageSelector() {
  const { $message, $select } = useContext(reject_context);
  return (
    <select
      _={`
      on change
        set #${$message}.value to my value
      `}
      class="fr-select"
      id={$select}
    >
      <option value="" selected disabled hidden>
        Sélectionner une response
      </option>
      {reponse_templates.map(async ({ label, default: template }) => (
        <option key={label} value={await Promise.resolve(template())}>
          {label}
        </option>
      ))}
    </select>
  );
}
