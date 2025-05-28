//

import { hyper_ref } from "@~/app.core/html";
import { hx_include } from "@~/app.core/htmx";
import { Pagination_Schema } from "@~/app.core/schema";
import { Foot } from "@~/app.ui/hx_table";
import { row } from "@~/app.ui/table";
import { LocalTime } from "@~/app.ui/time";
import { hx_urls, urls } from "@~/app.urls";
import { match } from "ts-pattern";
import {
  PageInput_Schema,
  usePageRequestContext,
  type get_users_list_dto,
} from "./context";

//

const $search = hyper_ref();
const $table = hyper_ref();
const hx_users_list_query_props = {
  ...(await hx_urls.users.$get({ query: {} })),
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

export default async function Page() {
  return (
    <main class="fr-container my-12">
      <h1>Liste des utilisateurs</h1>
      <Filter />
      <Table />
    </main>
  );
}

//

function Filter() {
  const { req } = usePageRequestContext();
  const { q } = req.valid("query");
  return (
    <form
      {...hx_users_list_query_props}
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
    var: { query_users, moncomptepro_pg },
  } = usePageRequestContext();

  const { q } = req.valid("query");
  const pagination = match(
    Pagination_Schema.safeParse(req.query(), { path: ["req.query()"] }),
  )
    .with({ success: true }, ({ data }) => data)
    .otherwise(() => Pagination_Schema.parse({}));

  const { count, users } = await query_users(moncomptepro_pg, {
    search: q ? String(q) : undefined,
    pagination: { ...pagination, page: pagination.page - 1 },
  });

  return (
    <div class="fr-table *:table!" id={$table}>
      <table>
        <thead>
          <tr>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Date de création</th>
            <th>Dernière connexion</th>
            <th>Email vérifié le</th>
            <th>ID</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <Row key={`${user.id}`} user={user} />
          ))}
        </tbody>
        <Foot
          count={count}
          hx_query_props={hx_users_list_query_props}
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
  user,
}: {
  key?: string;
  user: get_users_list_dto["users"][number];
}) {
  return (
    <tr
      _={`on click set the window's location to '${
        urls.users[":id"].$url({
          param: { id: user.id.toString() },
        }).pathname
      }'`}
      class={row({ is_clickable: true })}
      key={key}
    >
      <td>{user.given_name}</td>
      <td>{user.family_name}</td>
      <td>{user.email}</td>
      <td>
        <LocalTime date={user.created_at} />
      </td>
      <td>
        <LocalTime date={user.last_sign_in_at} />
      </td>
      <td>
        <LocalTime date={user.email_verified_at} />
      </td>
      <td>{user.id}</td>
      <td class="text-right!">➡️</td>
    </tr>
  );
}
