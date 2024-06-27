//

import { hyper_ref } from "@~/app.core/html";
import { hx_trigger_from_body } from "@~/app.core/htmx";
import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import { hx_urls } from "@~/app.urls";
import { ORGANISATION_EVENTS } from "@~/organizations.lib/event";
import { get_organization_by_id } from "@~/organizations.repository/get_organization_by_id";
import { useRequestContext } from "hono/jsx-renderer";
import { Edit_Domain } from "./Edit_Domain";
import { Fiche } from "./Fiche";
import { Organization_NotFound } from "./not-found";

//

export default async function Page({ id }: { id: number }) {
  const {
    var: { moncomptepro_pg },
  } = useRequestContext<MonComptePro_Pg_Context>();
  const uuid = hyper_ref();
  const organization = await get_organization_by_id(moncomptepro_pg, { id });

  if (!organization) {
    return <Organization_NotFound organization_id={id} />;
  }

  const hx_get_members_query_props = await hx_urls.organizations[
    ":id"
  ].members.$get({
    param: { id: organization.id.toString() },
    query: { describedby: uuid },
  });

  return (
    <main class="fr-container">
      <h1>👨‍💻 A propos de {organization.cached_libelle}</h1>
      <Fiche organization={organization} />
      <Edit_Domain organization={organization} />
      <hr />
      <br />
      <h3 id={uuid}>Membres enregistrés dans cette organisation :</h3>
      <div
        {...hx_get_members_query_props}
        hx-target="this"
        hx-trigger={[
          "load",
          ...hx_trigger_from_body([ORGANISATION_EVENTS.Enum.MEMBERS_UPDATED]),
        ]}
        class="fr-table"
        id="table-organisation-members"
      ></div>
    </main>
  );
}
