//

import { urls } from "@~/app.urls";
import { ORGANISATION_EVENTS } from "@~/organizations.lib/event";
import { usePageRequestContext } from "./context";

//

export async function Edit_Domain() {
  const {
    var: { organization },
  } = usePageRequestContext();

  return (
    <div class="grid grid-cols-2">
      <div
        class="fr-table"
        hx-get={
          urls.organizations[":id"].domains.internal.$url({
            param: {
              id: organization.id.toString(),
            },
          }).pathname
        }
        hx-trigger={[
          "load",
          `${ORGANISATION_EVENTS.Enum.INTERNAL_DOMAIN_UPDATED} from:body`,
        ].join(", ")}
      ></div>
      <div
        class="fr-table"
        hx-get={
          urls.organizations[":id"].domains.external.$url({
            param: {
              id: organization.id.toString(),
            },
          }).pathname
        }
        hx-trigger={[
          "load",
          `${ORGANISATION_EVENTS.Enum.EXTERNAL_DOMAIN_UPDATED} from:body`,
        ].join(", ")}
      ></div>
    </div>
  );
}
