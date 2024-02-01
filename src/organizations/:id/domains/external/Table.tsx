import { type Organization } from ":database:moncomptepro";
import { button } from ":ui/button";

//
export function Table({ organization }: { organization: Organization }) {
  const { external_authorized_email_domains } = organization;

  return (
    <table class="!table">
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
                  hx-delete={`/legacy/organizations/${organization.id}/domains/external/${domain}`}
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
              hx-put={`/legacy/organizations/${organization.id}/domains/external`}
            >
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
