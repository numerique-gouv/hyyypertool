//

import { api_ref } from ":api_ref";
import { moncomptepro_pg, schema } from ":database:moncomptepro";
import { and, desc, count as drizzle_count, like } from "drizzle-orm";
import { Table, Table_Context } from "./Table";

//

export const SEARCH_SIRET_INPUT_ID = "search-siret";
export const ORGANIZATIONS_TABLE_ID = "organizations-table";

//

export default async function Page({
  page,
  siret,
}: {
  siret: string | undefined;
  page: number;
}) {
  const take = 10;

  const where = and(like(schema.organizations.siret, `%${siret ?? ""}%`));
  const { organizations, count } = await moncomptepro_pg.transaction(
    async () => {
      const organizations = await moncomptepro_pg
        .select()
        .from(schema.organizations)
        .where(where)
        .orderBy(desc(schema.organizations.id))
        .limit(take)
        .offset(page * take);
      const [{ value: count }] = await moncomptepro_pg
        .select({ value: drizzle_count() })
        .from(schema.organizations)
        .where(where);

      return { organizations, count };
    },
  );

  return (
    <main class="fr-container">
      <h1>Liste des organisations</h1>
      <label class="fr-label" for={SEARCH_SIRET_INPUT_ID}>
        SIRET
      </label>
      <input
        class="fr-input"
        hx-get={api_ref("/legacy/organizations", {})}
        hx-select={`#${ORGANIZATIONS_TABLE_ID} > table`}
        hx-target={`#${ORGANIZATIONS_TABLE_ID}`}
        hx-trigger="input changed delay:500ms, search"
        id={SEARCH_SIRET_INPUT_ID}
        name={SEARCH_SIRET_INPUT_ID}
        placeholder="Rechercher par SIRET"
        type="text"
      />
      <Table_Context.Provider value={{ page, take, count }}>
        <div class="fr-table" id={ORGANIZATIONS_TABLE_ID}>
          <Table organizations={organizations} />
        </div>
      </Table_Context.Provider>
    </main>
  );
}
