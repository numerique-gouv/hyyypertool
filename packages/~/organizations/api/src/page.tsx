//

import type { Pagination } from "@~/app.core/schema";
import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import { urls } from "@~/app.urls";
import { get_organizations_list } from "@~/organizations.repository/get_organizations_list";
import { useRequestContext } from "hono/jsx-renderer";
import { z } from "zod";
import { Table, Table_Context } from "./Table";

//

export const SEARCH_SIRET_INPUT_ID = "search-siret";
export const ORGANIZATIONS_TABLE_ID = "organizations-table";

export const Search_Schema = z.object({
  [SEARCH_SIRET_INPUT_ID]: z.string().default(""),
});
export type Search = z.infer<typeof Search_Schema>;

//

export default async function Page({
  pagination,
  search,
}: {
  pagination: Pagination;
  search: Search;
}) {
  const {
    var: { moncomptepro_pg },
  } = useRequestContext<MonComptePro_Pg_Context>();
  const { page, page_size } = pagination;
  const { [SEARCH_SIRET_INPUT_ID]: siret } = search;
  const { count, organizations } = await get_organizations_list(
    moncomptepro_pg,
    {
      search: { siret },
      pagination: { page: page - 1, take: page_size },
    },
  );

  return (
    <main class="fr-container my-12">
      <h1>Liste des organisations</h1>
      <label class="fr-label" for={SEARCH_SIRET_INPUT_ID}>
        SIRET
      </label>
      <input
        class="fr-input"
        hx-get={urls.organizations.$url().pathname}
        hx-replace-url="true"
        hx-select={`#${ORGANIZATIONS_TABLE_ID} > table`}
        hx-target={`#${ORGANIZATIONS_TABLE_ID}`}
        hx-trigger="input changed delay:500ms, search"
        id={SEARCH_SIRET_INPUT_ID}
        name={SEARCH_SIRET_INPUT_ID}
        placeholder="Rechercher par SIRET"
        type="text"
        value={siret}
      />
      <Table_Context.Provider value={{ page, take: page_size, count }}>
        <div class="fr-table" id={ORGANIZATIONS_TABLE_ID}>
          <Table organizations={organizations} />
        </div>
      </Table_Context.Provider>
    </main>
  );
}
