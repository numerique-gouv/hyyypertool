//

import { api_ref } from ":api_ref";
import { schema, type MonComptePro_PgDatabase } from ":database:moncomptepro";
import type { moncomptepro_pg_Context } from ":database:moncomptepro/middleware";
import type { Pagination } from "@~/app.core/schema";
import { and, desc, count as drizzle_count, ilike } from "drizzle-orm";
import { useRequestContext } from "hono/jsx-renderer";
import { Table, Table_Context } from "./Table";

//

export const SEARCH_EMAIL_INPUT_ID = "search-email";
export const USER_TABLE_ID = "user-table";

//

function get_users_list(
  pg: MonComptePro_PgDatabase,
  {
    search,
    pagination = { page: 0, take: 10 },
  }: {
    search: {
      email?: string;
    };
    pagination?: { page: number; take: number };
  },
) {
  const { page, take } = pagination;
  const { email } = search;

  const where = and(ilike(schema.users.email, `%${email ?? ""}%`));

  return pg.transaction(async function users_with_count() {
    const users = await pg
      .select()
      .from(schema.users)
      .where(where)
      .orderBy(desc(schema.users.created_at))
      .limit(take)
      .offset(page * take);
    const [{ value: count }] = await pg
      .select({ value: drizzle_count() })
      .from(schema.users)
      .where(where);
    return { users, count };
  });
}
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
  } = useRequestContext<moncomptepro_pg_Context>();
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
        hx-get={api_ref("/legacy/users", {})}
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
