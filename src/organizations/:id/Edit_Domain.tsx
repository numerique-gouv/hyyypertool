//

import type { Organization_DTO } from ":organizations/repositories/get_by_id";
import { ORGANISATION_EVENTS } from ":organizations/services/event";
import { urls } from "@~/app.urls";

//

export async function Edit_Domain({
  organization,
}: {
  organization: Organization_DTO;
}) {
  return (
    <div class="grid grid-cols-2">
      <div
        class="fr-table"
        hx-get={
          urls.legacy.organizations[":id"].domains.internal.$url({
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
          urls.legacy.organizations[":id"].domains.external.$url({
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
