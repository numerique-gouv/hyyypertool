import { button } from "@~/app.ui/button";
import { urls } from "@~/app.urls";
import { type Organization } from "@~/moncomptepro.database";

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
                  hx-delete={
                    urls.legacy.organizations[":id"].domains.external[
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
              </td>
            </tr>
          </>
        ))}
        <tr>
          <td colspan={2}>
            <form
              class="grid grid-cols-[1fr_min-content]"
              hx-put={
                urls.legacy.organizations[":id"].domains.external.$url({
                  param: { id: organization.id.toString() },
                }).pathname
              }
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
