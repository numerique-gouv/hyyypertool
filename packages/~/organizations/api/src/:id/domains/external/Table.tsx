import { button } from "@~/app.ui/button";
import { menu_item } from "@~/app.ui/menu";
import { Horizontal_Menu } from "@~/app.ui/menu/components/Horizontal_Menu";
import { hx_urls } from "@~/app.urls";
import { type Organization } from "@~/moncomptepro.database";

//
export async function Table({ organization }: { organization: Organization }) {
  const { external_authorized_email_domains } = organization;

  return (
    <div class="fr-table [&>table]:table">
      <table>
        <thead>
          <tr>
            <th>Domain externe</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {external_authorized_email_domains.map((domain) => (
            <tr key={domain}>
              <td>{domain}</td>
              <td class="!text-end">
                <Row_Actions
                  domain={domain}
                  organization_id={organization.id}
                />
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr>
            <td colspan={2}>
              <form
                class="grid grid-cols-[1fr_min-content]"
                {...await hx_urls.organizations[":id"].domains.external.$put({
                  param: {
                    id: organization.id.toString(),
                  },
                })}
              >
                <input class="fr-input" type="text" name="domain" />
                <button class="fr-btn" type="submit">
                  Add
                </button>
              </form>
            </td>
          </tr>
          <tr>
            <td>
              <details>
                <summary>Fonctions avancées</summary>
                <button
                  class={button({ size: "sm" })}
                  {...await hx_urls.organizations[
                    ":id"
                  ].domains.external.$delete({
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
  organization_id,
}: {
  domain: string;
  organization_id: number;
}) {
  return (
    <Horizontal_Menu>
      <ul class="list-none p-0">
        <li>
          <button
            class={menu_item()}
            {...await hx_urls.organizations[":id"].domains.external[
              ":domain"
            ].$delete({
              param: {
                id: organization_id.toString(),
                domain,
              },
            })}
            hx-swap="none"
          >
            🗑️ Supprimer
          </button>
        </li>
      </ul>
    </Horizontal_Menu>
  );
}
