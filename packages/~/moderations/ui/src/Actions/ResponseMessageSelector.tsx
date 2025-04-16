//

import { useContext } from "hono/jsx";
import { reject_context } from "./context";
import { reponse_templates } from "./responses";

//

export function ResponseMessageSelector() {
  const { $message } = useContext(reject_context);
  return (
    <div>
      <input
        _={`
        on change
          set :key to my value
          set :option to <option[value="${"${:key}"}"]/> in #responses-type
          set #${$message}.value to :option@message
        `}
        class="fr-select"
        list="responses-type"
        placeholder="Recherche d'une réponse type"
        autocomplete="off"
      />
      <datalist id="responses-type">
        {reponse_templates.map(async ({ label, default: template }, index) => (
          <option
            key={index}
            value={label}
            message={await Promise.resolve(template())}
          ></option>
        ))}
      </datalist>
    </div>
  );
}
