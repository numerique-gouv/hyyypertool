import { button } from "@~/app.ui/button";
import { urls } from "@~/app.urls";
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
    <table class="!table">
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
                  hx-delete={
                    urls.legacy.organizations[":id"].domains.internal[
                      ":domain"
                    ].$url({
                      param: {
                        id: organization.id.toString(),
                        domain,
                      },
                    }).pathname
                  }
                  hx-swap="none"
                >
                  🗑️ Supprimer
                </button>
                <button
                  class={button()}
                  hx-patch={
                    urls.legacy.organizations[":id"].domains.internal[
                      ":domain"
                    ].$url({
                      param: {
                        id: organization.id.toString(),
                        domain,
                      },
                    }).pathname
                  }
                  hx-vals={JSON.stringify({
                    is_verified: !is_verified,
                  })}
                  hx-swap="none"
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
              hx-put={
                urls.legacy.organizations[":id"].domains.internal.$url({
                  param: { id: organization.id.toString() },
                }).pathname
              }
            >
              {/* TODO(douglasduteil): Should auto complete with the current domain email */}
              <input class="fr-input" type="text" name="domain" />
              <button class="fr-btn" type="submit">
                Add
              </button>
            </form>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
