import type { Pagination } from "@~/app.core/schema";
import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import { row } from "@~/app.ui/table";
import { hx_urls, urls } from "@~/app.urls";
import { get_organisations_by_user_id } from "@~/organizations.repository/get_organisations_by_user_id";
import { useContext, type PropsWithChildren } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import { match } from "ts-pattern";
import UserOrganizationTable_Context from "./context";

//

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

export async function UserOrganizationTable() {
  const { pagination, user_id, query_organizations_collection } = useContext(
    UserOrganizationTable_Context,
  );
  const { organizations, count } = await query_organizations_collection;
  const { page, page_size } = pagination;
  const page_index = page - 1;
  const last_page = Math.floor(count / page_size) + 1;
  return (
    <table>
      <thead>
        <tr>
          {fields.map((name) => (
            <th key={name} class="max-w-32 break-words">
              {name}
            </th>
          ))}

          <th>Lien</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          {organizations.map(({ organizations }) => (
            <tr key={organizations.id.toString()} class={row()}>
              {fields.map((name) => (
                <td key={name} class="break-words">
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
                    urls.organizations[":id"].$url({
                      param: {
                        id: organizations.id.toString(),
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
              {...hx_urls.users[":id"].organizations.$get({
                param: { id: user_id.toString() },
                query: {},
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

//

export { UserOrganizationTable_Context };

//
export async function UserOrganizationTable_Provider({
  value: { pagination, user_id },
  children,
}: PropsWithChildren<{
  value: { pagination: Pagination; user_id: number };
}>) {
  const {
    var: { moncomptepro_pg },
  } = useRequestContext<MonComptePro_Pg_Context>();

  const query_organizations_collection = get_organisations_by_user_id(
    moncomptepro_pg,
    { user_id, pagination: { ...pagination, page: pagination.page - 1 } },
  );

  return (
    <UserOrganizationTable_Context.Provider
      value={{ query_organizations_collection, user_id, pagination }}
    >
      {children}
    </UserOrganizationTable_Context.Provider>
  );
}
