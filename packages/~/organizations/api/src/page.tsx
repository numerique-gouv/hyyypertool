//

import { date_to_dom_string } from "@~/app.core/date/date_format";
import { hyper_ref } from "@~/app.core/html";
import { hx_include } from "@~/app.core/htmx";
import { Pagination_Schema } from "@~/app.core/schema";
import { Foot } from "@~/app.ui/hx_table";
import { row } from "@~/app.ui/table";
import { Time } from "@~/app.ui/time";
import { hx_urls, urls } from "@~/app.urls";
import type { get_organizations_dto } from "@~/organizations.repository/get_organizations_list";
import { match } from "ts-pattern";
import { PageQuery_Schema, usePageRequestContext } from "./context";

//

const $table = hyper_ref();
const $search = hyper_ref();

const hx_organizations_query_props = {
  ...(await hx_urls.organizations.$get({ query: {} })),
  "hx-include": hx_include([
    $table,
    $search,
    PageQuery_Schema.keyof().enum.page,
  ]),
  "hx-replace-url": true,
  "hx-select": `#${$table} > table`,
  "hx-target": `#${$table}`,
};
//

export default async function Page() {
  return (
    <main class="fr-container my-12">
      <h1>Liste des organisations</h1>
      <Filter />
      <Table />
    </main>
  );
}

function Filter() {
  const { req } = usePageRequestContext();
  const { q } = req.valid("query");
  return (
    <form
      {...hx_organizations_query_props}
      hx-trigger={[`keyup changed delay:500ms from:#${$search}`].join(", ")}
    >
      <div class="fr-search-bar" role="search">
        <label class="fr-label" for={$search}>
          Recherche
        </label>
        <input
          class="fr-input"
          id={$search}
          name={PageQuery_Schema.keyof().enum.q}
          placeholder="Rechercher par nom ou SIRET"
          value={q}
          type="search"
        />
        <button class="fr-btn" title="Rechercher">
          Rechercher
        </button>
      </div>
    </form>
  );
}

async function Table() {
  const {
    req,
    var: { query_organizations, moncomptepro_pg },
  } = usePageRequestContext();
  const { q } = req.valid("query");
  const pagination = match(
    Pagination_Schema.safeParse(req.query(), { path: ["req.query()"] }),
  )
    .with({ success: true }, ({ data }) => data)
    .otherwise(() => Pagination_Schema.parse({}));

  const { count, organizations } = await query_organizations(moncomptepro_pg, {
    pagination: { ...pagination, page: pagination.page - 1 },
    search: q ? String(q) : undefined,
  });

  return (
    <div class="fr-table [&>table]:table" id={$table}>
      <table>
        <thead>
          <tr>
            <th>Date de création</th>
            <th>Siret</th>
            <th>Dénomination</th>
            <th>Domaines</th>
            <th>Code officiel géographique</th>
            <th>ID</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((organization) => (
            <Row key={`${organization.id}`} organization={organization} />
          ))}
        </tbody>
        <Foot
          count={count}
          hx_query_props={hx_organizations_query_props}
          id={$table}
          name={PageQuery_Schema.keyof().enum.page}
          pagination={pagination}
        />
      </table>
    </div>
  );
}

function Row({
  key,
  organization,
}: {
  key?: string;
  organization: get_organizations_dto["organizations"][number];
}) {
  return (
    <tr
      _={`on click set the window's location to '${
        urls.organizations[":id"].$url({
          param: { id: organization.id.toString() },
        }).pathname
      }'`}
      class={row({ is_clickable: true })}
      key={key}
    >
      <td>
        <Time date={organization.created_at}>
          {date_to_dom_string(new Date(organization.created_at))}
        </Time>
      </td>
      <td>{organization.siret}</td>
      <td>{organization.cached_libelle}</td>
      <td>
        {organization.email_domains.map((domain) => domain.domain).join(", ")}
      </td>
      <td>{organization.cached_code_officiel_geographique}</td>
      <td>{organization.id}</td>
      <td class="!text-right">➡️</td>
    </tr>
  );
}
