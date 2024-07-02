//

import type { Pagination } from "@~/app.core/schema";
import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import { hx_urls } from "@~/app.urls";
import { useRequestContext } from "hono/jsx-renderer";
import { Table } from "./Table";
import { Table_Context, get_users_list } from "./context";

//

export const SEARCH_EMAIL_INPUT_ID = "search-email";
export const USER_TABLE_ID = "user-table";

//

//

export default async function Page({
  pagination,
  email,
}: {
  email: string | undefined;
  pagination: Pagination;
}) {
  const {
    var: { moncomptepro_pg },
  } = useRequestContext<MonComptePro_Pg_Context>();
  const { page, page_size } = pagination;
  const { count, users } = await get_users_list(moncomptepro_pg, {
    search: { email },
    pagination: { page: page - 1, take: page_size },
  });
  return (
    <main class="fr-container">
      <h1>Liste des utilisateurs</h1>
      <label class="fr-label" for={SEARCH_EMAIL_INPUT_ID}>
        Email
      </label>
      <input
        class="fr-input"
        {...await hx_urls.users.$get({ query: {} })}
        hx-select={`#${USER_TABLE_ID} > table`}
        hx-target={`#${USER_TABLE_ID}`}
        hx-trigger="input changed delay:500ms, search"
        id={SEARCH_EMAIL_INPUT_ID}
        name={SEARCH_EMAIL_INPUT_ID}
        placeholder="Recherche par Email"
        type="email"
      />
      <Table_Context.Provider value={{ page, take: page_size, count }}>
        <div class="fr-table" id={USER_TABLE_ID}>
          <Table users={users} />
        </div>
      </Table_Context.Provider>
    </main>
  );
}
