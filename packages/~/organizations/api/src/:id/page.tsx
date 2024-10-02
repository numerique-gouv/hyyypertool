//

import { hyper_ref } from "@~/app.core/html";
import { hx_include, hx_trigger_from_body } from "@~/app.core/htmx";
import { formattedPlural } from "@~/app.ui/plurial";
import { hx_urls } from "@~/app.urls";
import { ORGANISATION_EVENTS } from "@~/organizations.lib/event";
import { usePageRequestContext } from "./context";
import { Fiche } from "./Fiche";

//

export default async function Page() {
  const {
    var: { organization },
  } = usePageRequestContext();
  const $domains_describedby = hyper_ref();

  const hx_get_domains_query_props = await hx_urls.organizations[
    ":id"
  ].domains.$get({
    param: { id: organization.id.toString() },
    query: { describedby: $domains_describedby },
  });

  return (
    <main class="fr-container my-12">
      <h1>🏛 A propos de « {organization.cached_libelle} » </h1>

      <Fiche />

      <h3 id={$domains_describedby}>🌐 domaine connu dans l'organisation</h3>
      <div
        {...hx_get_domains_query_props}
        hx-trigger={[
          "load",
          ...hx_trigger_from_body([ORGANISATION_EVENTS.Enum.DOMAIN_UPDATED]),
        ]}
      ></div>
      <hr />
      <br />
      <MembersInTheOrganization />
    </main>
  );
}

async function MembersInTheOrganization() {
  const $describedby = hyper_ref();
  const $members_describedby = hyper_ref();
  const $page_ref = hyper_ref();
  const {
    var: { organization, query_organization_members_count },
  } = usePageRequestContext();
  const count = await query_organization_members_count;

  const hx_get_members_query_props = await hx_urls.organizations[
    ":id"
  ].members.$get({
    param: { id: organization.id.toString() },
    query: { describedby: $members_describedby, page_ref: $page_ref },
  });

  return (
    <section>
      <details open={false}>
        <summary>
          <h3 class="inline-block" id={$describedby}>
            👥 {count}{" "}
            {formattedPlural(count, {
              one: "membre enregistré",
              other: "membres enregistrés ",
            })}{" "}
            dans l’organisation :
          </h3>
        </summary>

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
      </details>
    </section>
  );
}
