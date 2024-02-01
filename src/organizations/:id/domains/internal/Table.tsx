import type { Organization } from ":database:moncomptepro";
import { button } from ":ui/button";

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
                  hx-delete={`/legacy/organizations/${organization.id}/domains/internal/${domain}`}
                  hx-swap="none"
                >
                  🗑️ Supprimer
                </button>
                <button
                  class={button()}
                  hx-patch={`/legacy/organizations/${organization.id}/domains/internal/${domain}`}
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
              hx-put={`/legacy/organizations/${organization.id}/domains/internal`}
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
