//

import { hyper_ref } from "@~/app.core/html";
import { hx_trigger_from_body } from "@~/app.core/htmx";
import { hx_urls } from "@~/app.urls";
import { ORGANISATION_EVENTS } from "@~/organizations.lib/event";
import { usePageRequestContext } from "./context";
import { Edit_Domain } from "./Edit_Domain";
import { Fiche } from "./Fiche";

//

export default async function Page() {
  const {
    var: { organization },
  } = usePageRequestContext();
  const uuid = hyper_ref();

  const hx_get_members_query_props = await hx_urls.organizations[
    ":id"
  ].members.$get({
    param: { id: organization.id.toString() },
    query: { describedby: uuid },
  });

  return (
    <main class="fr-container my-12">
      <h1>🏛 A propos de « {organization.cached_libelle} » </h1>
      <Fiche />
      <Edit_Domain />
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
