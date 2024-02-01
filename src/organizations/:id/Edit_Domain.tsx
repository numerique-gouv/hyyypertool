//

import { api_ref } from ":api_ref";
import type { Organization_DTO } from ":organizations/repositories/get_by_id";
import { ORGANISATION_EVENTS } from ":organizations/services/event";

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
        hx-get={api_ref(`/legacy/organizations/:id/domains/internal`, {
          id: String(organization.id),
        })}
        // hx-get={api_ref(`/legacy/organizations/:id/domains/internal`, {
        //   id: String(organization.id),
        // })}
        hx-trigger={`load, ${ORGANISATION_EVENTS.Enum.INTERNAL_DOMAIN_UPDATED} from:body`}
      ></div>
      <div
        class="fr-table"
        hx-get={api_ref(`/legacy/organizations/:id/domains/external`, {
          id: String(organization.id),
        })}
        hx-trigger={`load, ${ORGANISATION_EVENTS.Enum.EXTERNAL_DOMAIN_UPDATED} from:body`}
      ></div>
    </div>
  );
}
