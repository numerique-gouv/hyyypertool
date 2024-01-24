import { api_ref } from ":api_ref";
import { type Organization } from ":database:moncomptepro";
import { createContext, useContext } from "hono/jsx";
import { match } from "ts-pattern";
import { ORGANIZATIONS_TABLE_ID } from "./page";

const fields = [
  "id",
  "cached_libelle",
  "siret",
  "authorized_email_domains",
  "external_authorized_email_domains",
  "verified_email_domains",
  "cached_code_officiel_geographique",
] as const;

export const Table_Context = createContext({
  page: 0,
  take: 10,
  count: 0,
});

export function Table({ organizations }: { organizations: Organization[] }) {
  const { page, take, count } = useContext(Table_Context);

  return (
    <table>
      <thead>
        <tr>
          {fields.map((name) => (
            <th class="max-w-32 break-words">{name}</th>
          ))}

          <th>Lien</th>
        </tr>
      </thead>
      <tbody>
        {organizations.map((organization) => (
          <tr>
            {fields.map((name) => (
              <td class="break-words">
                {match(organization[name])
                  .when(
                    () => name === "authorized_email_domains",
                    () => organization.authorized_email_domains.join(", "),
                  )
                  .otherwise((value) => value)}
              </td>
            ))}

            <td>
              <a
                href={api_ref("/legacy/organizations/:id", {
                  id: String(organization.id),
                })}
              >
                ➡️
              </a>
            </td>
          </tr>
        ))}
      </tbody>

      <tfoot>
        <tr>
          <th scope="row">Showing </th>
          <td colspan={2}>
            {page * take}-{page * take + take} of {count}
          </td>
          <td colspan={3} class="inline-flex justify-center">
            <input
              class="text-right"
              hx-get={api_ref("/legacy/organizations", {})}
              // hx-include={`#${SEARCH_EMAIL_INPUT_ID}`}
              hx-select={`#${ORGANIZATIONS_TABLE_ID} > table`}
              hx-target={`#${ORGANIZATIONS_TABLE_ID}`}
              hx-trigger="input changed delay:2s"
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
