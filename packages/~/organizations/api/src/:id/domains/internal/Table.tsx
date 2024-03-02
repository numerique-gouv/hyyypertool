import { button } from "@~/app.ui/button";
import { hx_urls } from "@~/app.urls";
import type { Organization } from "@~/moncomptepro.database";

//
export function Table({
  organization,
}: {
  organization: Pick<
    Organization,
    "authorized_email_domains" | "id" | "verified_email_domains"
  >;
}) {
  const { authorized_email_domains, verified_email_domains } = organization;
  const domain_and_state = authorized_email_domains.map(
    (domain) => [domain, verified_email_domains.includes(domain)] as const,
  );

  return (
    <div class="fr-table [&>table]:table">
      <table>
        <thead>
          <tr>
            <th>Domain internes</th>
            <th>🔒</th>
          </tr>
        </thead>

        <tbody>
          {domain_and_state.map(([domain, is_verified]) => (
            <>
              <tr>
                <td safe>{domain}</td>
                <td safe>{is_verified ? "✅" : "❌"}</td>
              </tr>
              <tr>
                <td colspan={2}>
                  <button
                    class={button()}
                    {...hx_urls.organizations[":id"].domains.internal[
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
                  <button
                    class={button()}
                    {...hx_urls.organizations[":id"].domains.internal[
                      ":domain"
                    ].$patch({
                      param: {
                        id: organization.id.toString(),
                        domain,
                      },
                    })}
                    hx-swap="none"
                    hx-vals={JSON.stringify({
                      is_verified: String(!is_verified),
                    })}
                  >
                    🔄 vérifié
                  </button>
                </td>
              </tr>
            </>
          ))}
          <tr>
            <td colspan={2}>
              <form
                class="grid grid-cols-[1fr_min-content]"
                {...hx_urls.organizations[":id"].domains.internal.$put({
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
            <td colspan={2}>
              <details>
                <summary>Fonctions avancées</summary>
                <button
                  class={button({ size: "sm" })}
                  {...hx_urls.organizations[":id"].domains.internal.$delete({
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
