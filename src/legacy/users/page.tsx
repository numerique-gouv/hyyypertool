//

import { api_ref } from ":api_ref";
import { moncomptepro_pg, schema } from ":database:moncomptepro";
import { and, desc, count as drizzle_count, ilike } from "drizzle-orm";
import { Table, Table_Context } from "./Table";

//

export const SEARCH_EMAIL_INPUT_ID = "search-email";
export const USER_TABLE_ID = "user-table";

//

export default async function Page({
  page,
  email,
}: {
  email: string | undefined;
  page: number;
}) {
  const take = 10;
  const where = and(ilike(schema.users.email, `%${email ?? ""}%`));
  const { users, count } = await moncomptepro_pg.transaction(async () => {
    const users = await moncomptepro_pg
      .select()
      .from(schema.users)
      .where(where)
      .orderBy(desc(schema.users.id))
      .limit(take)
      .offset(page * take);
    const [{ value: count }] = await moncomptepro_pg
      .select({ value: drizzle_count() })
      .from(schema.users)
      .where(where);

    return { users, count };
  });

  return (
    <main class="fr-container">
      <h1>Liste des utilisateurs</h1>
      <label class="fr-label" for={SEARCH_EMAIL_INPUT_ID}>
        Email
      </label>
      <input
        class="fr-input"
        hx-get={api_ref("/legacy/users", {})}
        hx-select={`#${USER_TABLE_ID} > table`}
        hx-target={`#${USER_TABLE_ID}`}
        hx-trigger="input changed delay:500ms, search"
        id={SEARCH_EMAIL_INPUT_ID}
        name={SEARCH_EMAIL_INPUT_ID}
        placeholder="Recherche par Email"
        type="email"
      />
      <Table_Context.Provider value={{ page, take, count }}>
        <div class="fr-table" id={USER_TABLE_ID}>
          <Table users={users} />
        </div>
      </Table_Context.Provider>
    </main>
  );
}
