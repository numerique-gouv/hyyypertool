//

import { api_ref } from ":api_ref";
import { schema, type Organization } from ":database:moncomptepro";
import type { moncomptepro_pg_Context } from ":database:moncomptepro/middleware";
import { row } from ":ui/table";
import { zValidator } from "@hono/zod-validator";
import {
  Entity_Schema,
  Pagination_Schema,
  type Pagination,
} from "@~/app.core/schema";
import { urls } from "@~/app.urls";
import { and, asc, count as drizzle_count, eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Hono } from "hono";
import { createContext, useContext } from "hono/jsx";
import { match } from "ts-pattern";

//

const Table_Context = createContext({
  page: 0,
  take: 5,
  count: 0,
  user_id: NaN,
});

//

function organisations_by_user_id(
  pg: NodePgDatabase<typeof schema>,
  {
    id,
    pagination = { page: 0, page_size: 10 },
  }: { id: number; pagination?: Pagination },
) {
  const { page, page_size: take } = pagination;

  const where = and(eq(schema.users_organizations.user_id, id));

  return pg.transaction(async function organization_with_count() {
    const organizations = await pg
      .select()
      .from(schema.organizations)
      .innerJoin(
        schema.users_organizations,
        eq(schema.users_organizations.organization_id, schema.organizations.id),
      )
      .where(where)
      .orderBy(asc(schema.users_organizations.created_at))
      .limit(take)
      .offset(page * take);
    const [{ value: count }] = await pg
      .select({ value: drizzle_count() })
      .from(schema.users)
      .innerJoin(
        schema.users_organizations,
        eq(schema.users.id, schema.users_organizations.user_id),
      )
      .where(where);
    return { organizations, count };
  });
}

//

export default new Hono<moncomptepro_pg_Context>().get(
  "/",
  zValidator("param", Entity_Schema),
  zValidator("query", Pagination_Schema),
  async function ({ html, req, var: { moncomptepro_pg } }) {
    const { id } = req.valid("param");
    const { page, page_size } = req.valid("query");
    const take = 5;

    const { organizations, count } = await organisations_by_user_id(
      moncomptepro_pg,
      {
        id,
        pagination: { page: page - 1, page_size },
      },
    );

    return html(
      <Table_Context.Provider value={{ page, take, count, user_id: id }}>
        <Table organizations={organizations} />
      </Table_Context.Provider>,
    );
  },
);

const fields = [
  "siret",
  "cached_libelle",
  // "Interne",
  "verified_email_domains",
  "authorized_email_domains",
  "external_authorized_email_domains",
  "cached_code_officiel_geographique",
  // "authentication_by_peers_type",
  // "has_been_greeted",
  // "sponsor_id",
  // "needs_official_contact_email_verification",
  // "official_contact_email_verification_token",
  // "official_contact_email_verification_sent_at",
] as const;

function Table({
  organizations,
}: {
  organizations: { organizations: Organization }[];
}) {
  const { page, take, count, user_id } = useContext(Table_Context);
  const page_index = page - 1;
  const last_page = Math.floor(count / take) + 1;

  return (
    <table>
      <thead>
        <tr>
          {fields.map((name) => (
            <th class="max-w-32 break-words">{name}</th>
          ))}

          <th>Lien</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          {organizations.map(({ organizations }) => (
            <tr class={row()}>
              {fields.map((name) => (
                <td class="break-words">
                  {match(organizations[name])
                    .when(
                      (x): x is Array<string> => x instanceof Array,
                      (value) => value.join(", "),
                    )
                    .otherwise((value) => value)}
                </td>
              ))}

              <td>
                <a
                  class="p-3"
                  href={
                    urls.legacy.organizations[":id"].$url({
                      param: {
                        id: String(organizations.id),
                      },
                    }).pathname
                  }
                >
                  ➡️
                </a>
              </td>
            </tr>
          ))}
        </tr>
      </tbody>

      <tfoot>
        <tr>
          <th scope="row">Showing </th>
          <td colspan={2}>
            {page_index * count}-{page_index * count + count} of {count}
          </td>
          <td colspan={2} class="inline-flex justify-center">
            <input
              class="text-right"
              hx-get={api_ref(`/legacy/users/:id/organizations`, {
                id: user_id.toString(),
              })}
              hx-trigger="input changed delay:2s"
              hx-target="#table-user-organisations"
              id="page"
              name="page"
              type="number"
              value={String(page)}
            />
            <span> of {last_page}</span>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
