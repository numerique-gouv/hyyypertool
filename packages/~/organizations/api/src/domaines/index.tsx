//

import { zValidator } from "@hono/zod-validator";
import { hyper_ref } from "@~/app.core/html";
import { hx_include } from "@~/app.core/htmx";
import { Pagination_Schema, Search_Schema } from "@~/app.core/schema";
import { Main_Layout } from "@~/app.layout";
import { Foot } from "@~/app.ui/hx_table";
import { row } from "@~/app.ui/table";
import { hx_urls, urls } from "@~/app.urls";
import {
  get_unverified_domains,
  type get_unverified_domains_dto,
} from "@~/organizations.repository/get_unverified_domains";
import consola from "consola";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { match } from "ts-pattern";
import { usePageRequestContext, type ContextType } from "./context";

//

const PageInput_Schema = Pagination_Schema.merge(Search_Schema);
const $table = hyper_ref();
const $search = hyper_ref();
const hx_domains_query_props = {
  ...(await hx_urls.organizations.domains.$get({ query: {} })),
  "hx-include": hx_include([
    $table,
    $search,
    PageInput_Schema.keyof().enum.page,
  ]),
  "hx-replace-url": true,
  "hx-select": `#${$table} > table`,
  "hx-target": `#${$table}`,
};

//

export default new Hono<ContextType>().use("/", jsxRenderer(Main_Layout)).get(
  "/",
  zValidator("query", PageInput_Schema, function hook(result, { redirect }) {
    if (result.success) return undefined;
    consola.error(result.error);
    return redirect(urls.organizations.domains.$url().pathname);
  }),
  async function set_query_organizations({ set }, next) {
    set("query_unverified_domains", get_unverified_domains);
    return next();
  },
  async function GET({ render }) {
    return render(<Page />);
  },
);

//

async function Page() {
  return (
    <main
      class="fr-container my-12"
      {...hx_domains_query_props}
      hx-sync="this"
      hx-trigger={[
        `load delay:1s`,
        `every 11s [document.visibilityState === 'visible']`,
        `visibilitychange[document.visibilityState === 'visible'] from:document`,
      ].join(", ")}
    >
      <h1>Liste des domaines à vérifier</h1>
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
      {...hx_domains_query_props}
      hx-trigger={[`keyup changed delay:500ms from:#${$search}`].join(", ")}
    >
      <div class="fr-search-bar" role="search">
        <label class="fr-label" for={$search}>
          Recherche
        </label>
        <input
          class="fr-input"
          id={$search}
          name={PageInput_Schema.keyof().enum.q}
          placeholder="Recherche"
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
    var: { query_unverified_domains, moncomptepro_pg },
  } = usePageRequestContext();
  const { q } = req.valid("query");
  const pagination = match(
    Pagination_Schema.safeParse(req.query(), { path: ["req.query()"] }),
  )
    .with({ success: true }, ({ data }) => data)
    .otherwise(() => Pagination_Schema.parse({}));

  const { count, domains } = await query_unverified_domains(moncomptepro_pg, {
    pagination: { ...pagination, page: pagination.page - 1 },
    search: q ? String(q) : undefined,
  });

  return (
    <div class="fr-table [&>table]:table" id={$table}>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Domaine</th>
            <th>Siret</th>
            <th>Dénomination</th>
            <th>ID</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {domains.map((domain) => (
            <Row key={`${domain.id}`} domains={domain} />
          ))}
        </tbody>
        <Foot
          count={count}
          hx_query_props={hx_domains_query_props}
          id={$table}
          name={PageInput_Schema.keyof().enum.page}
          pagination={pagination}
        />
      </table>
    </div>
  );
}

function Row({
  key,
  domains: { organization, domain },
}: {
  key?: string;
  domains: get_unverified_domains_dto["domains"][number];
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
      <td></td>
      <td>{domain}</td>
      <td>{organization.siret}</td>
      <td>{organization.cached_libelle}</td>
      <td>{organization.id}</td>
      <td class="!text-right">➡️</td>
    </tr>
  );
}
