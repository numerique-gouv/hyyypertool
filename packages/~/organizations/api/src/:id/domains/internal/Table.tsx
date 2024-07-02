import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import { button } from "@~/app.ui/button";
import { Horizontal_Menu } from "@~/app.ui/menu/components/Horizontal_Menu";
import { hx_urls } from "@~/app.urls";
import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { eq } from "drizzle-orm";
import { createContext, useContext, type PropsWithChildren } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";

//

//

export async function Table() {
  const { domain_and_state, organization } = useContext(Table.Context);

  return (
    <div class="fr-table [&>table]:table">
      <table>
        <thead>
          <tr>
            <th>Domain internes</th>
            <th class="!text-end">🔒</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {domain_and_state.map(([domain, is_verified]) => (
            <tr key={domain}>
              <td>{domain}</td>
              <td class="!text-end">{is_verified ? "✅" : "❌"}</td>
              <td class="!text-end">
                <Row_Actions domain={domain} is_verified={is_verified} />
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr>
            <td colspan={3}>
              <form
                class="grid grid-cols-[1fr_min-content]"
                {...await hx_urls.organizations[":id"].domains.internal.$put({
                  param: {
                    id: organization.id.toString(),
                  },
                })}
              >
                {/* TODO(douglasduteil): Should auto complete with the current domain email */}
                <input class="fr-input" type="text" name="domain" />
                <button class="fr-btn" type="submit">
                  Add
                </button>
              </form>
            </td>
          </tr>
          <tr>
            <td colspan={3}>
              <details>
                <summary>Fonctions avancées</summary>
                <button
                  class={button({ size: "sm" })}
                  {...await hx_urls.organizations[
                    ":id"
                  ].domains.internal.$delete({
                    param: {
                      id: organization.id.toString(),
                    },
                  })}
                  hx-swap="none"
                >
                  🗑️ Supprimer les entrées vides
                </button>
              </details>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

async function Row_Actions({
  domain,
  is_verified,
}: {
  domain: string;
  is_verified: boolean;
}) {
  const { organization } = useContext(Table.Context);
  return (
    <Horizontal_Menu>
      <ul class="list-none p-0">
        <li>
          <button
            class="block w-full px-4 py-2 text-left text-sm text-gray-700"
            role="menuitem"
            tabindex={-1}
            {...await hx_urls.organizations[":id"].domains.internal[
              ":domain"
            ].$delete({
              param: {
                id: organization.id.toString(),
                domain,
              },
            })}
            hx-swap="none"
          >
            🗑️ Supprimer
          </button>
        </li>
        <li>
          <button
            class="block w-full px-4 py-2 text-left text-sm text-gray-700"
            role="menuitem"
            tabindex={-1}
            {...await hx_urls.organizations[":id"].domains.internal[
              ":domain"
            ].$patch({
              param: {
                id: organization.id.toString(),
                domain,
              },
              form: { is_verified: String(!is_verified) },
            })}
            hx-swap="none"
          >
            🔄 vérifié
          </button>
        </li>
      </ul>
    </Horizontal_Menu>
  );
}

Table.Context = createContext<{
  domain_and_state: (readonly [string, boolean])[];
  organization: NonNullable<Awaited<get_organization_domains_dto>>;
}>({} as any);

Table.Provider = async function Provider({
  children,
  organization_id,
}: PropsWithChildren<{ organization_id: number }>) {
  const {
    status,
    var: { moncomptepro_pg },
  } = useRequestContext<MonComptePro_Pg_Context>();
  const organization = await get_organization_domains(moncomptepro_pg, {
    id: organization_id,
  });

  if (!organization) {
    status(404);
    return <></>;
  }

  const { authorized_email_domains, verified_email_domains } = organization;
  const domain_and_state = authorized_email_domains.map(
    (domain) => [domain, verified_email_domains.includes(domain)] as const,
  );
  return (
    <Table.Context.Provider value={{ domain_and_state, organization }}>
      {children}
    </Table.Context.Provider>
  );
};

function get_organization_domains(
  pg: MonComptePro_PgDatabase,
  { id }: { id: number },
) {
  return pg.query.organizations.findFirst({
    where: eq(schema.organizations.id, id),
    columns: {
      authorized_email_domains: true,
      id: true,
      verified_email_domains: true,
    },
  });
}

type get_organization_domains_dto = ReturnType<typeof get_organization_domains>;
