//

import { zValidator } from "@hono/zod-validator";
import { date_to_dom_string } from "@~/app.core/date/date_format";
import { hyper_ref } from "@~/app.core/html";
import { hx_include } from "@~/app.core/htmx";
import { Pagination_Schema, Search_Schema } from "@~/app.core/schema";
import { Main_Layout } from "@~/app.layout";
import type { App_Context } from "@~/app.middleware/context";
import { Foot } from "@~/app.ui/hx_table";
import { FrNumberConverter } from "@~/app.ui/number/index";
import { row } from "@~/app.ui/table";
import { Time } from "@~/app.ui/time/LocalTime";
import { hx_urls, urls } from "@~/app.urls";
import {
  get_unverified_organizations,
  type get_unverified_organizations_dto,
} from "@~/organizations.repository/get_unverified_organizations";
import consola from "consola";
import { Hono, type Env, type InferRequestType } from "hono";
import { jsxRenderer, useRequestContext } from "hono/jsx-renderer";
import { match } from "ts-pattern";

//

type RequestType = InferRequestType<typeof urls.organizations.domains.$get>;

interface ContextVariablesType extends Env {
  Variables: {
    query_organizations: typeof get_unverified_organizations;
  };
}
type ContextType = App_Context & ContextVariablesType;

type InputType = {
  out: RequestType;
};

const usePageRequestContext = useRequestContext<ContextType, any, InputType>;

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
  ({ set }, next) => {
    set("query_organizations", get_unverified_organizations);
    return next();
  },
  zValidator("query", PageInput_Schema, function hook(result, { redirect }) {
    if (result.success) return undefined;
    consola.error(result.error);
    return redirect(urls.organizations.domains.$url().pathname);
  }),
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
            <th>Statut</th>
            <th>Date de création</th>
            <th>Siret</th>
            <th>Dénomination</th>
            <th>Nombre de membres modérés</th>
            <th>Domains non vérifiés</th>
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
  organization,
}: {
  key?: string;
  organization: get_unverified_organizations_dto["organizations"][number];
}) {
  const unverified_domains = organization.authorized_email_domains
    .filter((domain) => !organization.verified_email_domains.includes(domain))
    .filter(
      (domain) => !organization.trackdechets_email_domains.includes(domain),
    );
  const unverified_domains_and_more =
    unverified_domains.length > 2
      ? `${unverified_domains.slice(0, 2).join(", ")} et ${unverified_domains.length - 2} autre${unverified_domains.length > 3 ? "s" : ""}`
      : unverified_domains.join(", ");
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
      <td class="!text-center">
        {organization.moderation_to_process_count > 0 ? "🕵️" : "🔓"}
      </td>
      <td>
        <Time date={organization.created_at}>
          {date_to_dom_string(new Date(organization.created_at))}
        </Time>
      </td>
      <td>{organization.siret}</td>
      <td>{organization.cached_libelle}</td>
      <td>
        {FrNumberConverter.format(organization.member_count)} /{" "}
        {FrNumberConverter.format(
          organization.member_count + organization.moderation_to_process_count,
        )}
      </td>
      <td>{unverified_domains_and_more}</td>
      <td>{organization.id}</td>
      <td class="!text-right">➡️</td>
    </tr>
  );
}
