import { button } from "@~/app.ui/button";
import { hx_urls } from "@~/app.urls";
import { type Organization } from "@~/moncomptepro.database";

//
export function Table({ organization }: { organization: Organization }) {
  const { external_authorized_email_domains } = organization;

  return (
    <div class="fr-table [&>table]:table">
      <table>
        <thead>
          <tr>
            <th>Domain externe</th>
          </tr>
        </thead>

        <tbody>
          {external_authorized_email_domains.map((domain) => (
            <>
              <tr>
                <td>{domain}</td>
              </tr>
              <tr>
                <td colspan={2}>
                  <button
                    class={button()}
                    {...hx_urls.organizations[":id"].domains.external[
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
                </td>
              </tr>
            </>
          ))}
          <tr>
            <td colspan={2}>
              <form
                class="grid grid-cols-[1fr_min-content]"
                {...hx_urls.organizations[":id"].domains.external.$put({
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
                  {...hx_urls.organizations[":id"].domains.external.$delete({
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
        </tbody>
      </table>
    </div>
  );
}
