//

import { api_ref } from ":api_ref";
import { Id_Schema, Pagination_Schema } from ":common/schema";
import {
  moncomptepro_pg,
  schema,
  type Organization,
} from ":database:moncomptepro";
import { row } from ":ui/table";
import { zValidator } from "@hono/zod-validator";
import { and, asc, count as drizzle_count, eq } from "drizzle-orm";
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

const router = new Hono();
export default router;

//

router.get(
  "/",

  zValidator("param", Id_Schema),
  zValidator("query", Pagination_Schema),
  async function ({ html, req, notFound }) {
    const { id } = req.valid("param");
    const { page } = req.valid("query");
    const take = 5;

    const where = and(eq(schema.users_organizations.user_id, id));
    const { organizations, count } = await moncomptepro_pg.transaction(
      async () => {
        const organizations = await moncomptepro_pg
          .select()
          .from(schema.organizations)
          .innerJoin(
            schema.users_organizations,
            eq(
              schema.users_organizations.organization_id,
              schema.organizations.id,
            ),
          )
          .where(where)
          .orderBy(asc(schema.organizations.id))
          .limit(take)
          .offset(page * take);
        const [{ value: count }] = await moncomptepro_pg
          .select({ value: drizzle_count() })
          .from(schema.users)
          .innerJoin(
            schema.users_organizations,
            eq(schema.users.id, schema.users_organizations.user_id),
          )
          .where(where);
        return { organizations, count };
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

export function Table({
  organizations,
}: {
  organizations: { organizations: Organization }[];
}) {
  const { page, take, count, user_id } = useContext(Table_Context);

  return (
    <table>
      <thead>
        <tr>
          {fields.map((name) => (
            <th>{name}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        <tr>
          {organizations.map(({ organizations }) => (
            <tr
              _={`on click set the window's location to '${api_ref(
                "/legacy/organizations/:id",
                { id: String(organizations.id) },
              )}'`}
              class={row({ is_clickable: true })}
            >
              {fields.map((name) => (
                <td>
                  {match(organizations[name])
                    .when(
                      (x): x is Array<string> => x instanceof Array,
                      (value) => value.join(", "),
                    )
                    .otherwise((value) => value)}
                </td>
              ))}
            </tr>
          ))}
        </tr>
      </tbody>

      <tfoot>
        <tr>
          <th scope="row">Showing </th>
          <td colspan={2}>
            {page * take}-{page * take + take} of {count}
          </td>
          <td colspan={2} class="inline-flex justify-center">
            <input
              class="text-right"
              hx-get={`/legacy/users/${user_id}/organizations`}
              hx-trigger="input changed delay:500ms"
              hx-target="#table-user-organisations"
              id="page"
              name="page"
              type="number"
              value={String(page)}
            />
            <span> of {Math.floor(count / take)}</span>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
