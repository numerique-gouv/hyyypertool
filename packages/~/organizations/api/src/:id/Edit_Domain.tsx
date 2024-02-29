//

import { urls } from "@~/app.urls";
import type { Organization } from "@~/moncomptepro.database";
import { ORGANISATION_EVENTS } from "@~/organizations.lib/event";

//

export async function Edit_Domain({
  organization,
}: {
  organization: Organization;
}) {
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
