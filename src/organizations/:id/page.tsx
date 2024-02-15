//

import type { moncomptepro_pg_Context } from ":database:moncomptepro/middleware";
import { app_hc } from ":hc";
import { get_by_id } from ":organizations/repositories/get_by_id";
import { ORGANISATION_EVENTS } from ":organizations/services/event";
import { useRequestContext } from "hono/jsx-renderer";
import { Edit_Domain } from "./Edit_Domain";
import { Fiche } from "./Fiche";

//

export default async function Page({ id }: { id: number }) {
  const {
    var: { moncomptepro_pg },
  } = useRequestContext<moncomptepro_pg_Context>();
  const organization = await get_by_id(moncomptepro_pg, { id });

  return (
    <main class="fr-container">
      <h1>👨‍💻 A propos de {organization.cached_libelle}</h1>
      <Fiche organization={organization} />
      <Edit_Domain organization={organization} />
      <hr />
      <br />
      <h3>Membres enregistrés dans cette organisation :</h3>
      <div
        hx-get={
          app_hc.legacy.organizations[":id"].members.$url({
            param: {
              id: organization.id.toString(),
            },
          }).pathname
        }
        hx-target="this"
        hx-trigger={`load, ${ORGANISATION_EVENTS.Enum.MEMBERS_UPDATED} from:body`}
        class="fr-table"
        id="table-organisation-members"
      ></div>
    </main>
  );
}
