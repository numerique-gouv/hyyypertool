//

import { hyper_ref } from "@~/app.core/html";
import { hx_include, hx_trigger_from_body } from "@~/app.core/htmx";
import { hx_urls } from "@~/app.urls";
import { ORGANISATION_EVENTS } from "@~/organizations.lib/event";
import { usePageRequestContext } from "./context";
import { Fiche } from "./Fiche";

//

export default async function Page() {
  const {
    var: { organization },
  } = usePageRequestContext();
  const $describedby = hyper_ref();
  const $page_ref = hyper_ref();

  const hx_get_members_query_props = await hx_urls.organizations[
    ":id"
  ].members.$get({
    param: { id: organization.id.toString() },
    query: { describedby: $describedby, page_ref: $page_ref },
  });

  const hx_get_domains_query_props = await hx_urls.organizations[
    ":id"
  ].domains.$get({
    param: { id: organization.id.toString() },
  });

  return (
    <main class="fr-container my-12">
      <h1>🏛 A propos de « {organization.cached_libelle} » </h1>
      <Fiche />
      <div
        {...hx_get_domains_query_props}
        hx-trigger={[
          "load",
          ...hx_trigger_from_body([ORGANISATION_EVENTS.Enum.DOMAIN_UPDATED]),
        ]}
      ></div>
      <hr />
      <br />
      <h3 id={$describedby}>Membres enregistrés dans cette organisation :</h3>
      <div
        {...hx_get_members_query_props}
        class="fr-table"
        hx-include={hx_include([$page_ref])}
        hx-target="this"
        hx-trigger={[
          "load",
          ...hx_trigger_from_body([ORGANISATION_EVENTS.Enum.MEMBERS_UPDATED]),
        ]}
      ></div>
    </main>
  );
}
