//

import { type Organization } from ":database:moncomptepro";
import { LocalTime } from ":ui/time/LocalTime";
import { urls } from "@~/app.urls";
import { createContext, useContext } from "hono/jsx";
import { match } from "ts-pattern";
import { ORGANIZATIONS_TABLE_ID } from "./page";

//

const fields = [
  "cached_libelle",
  "siret",
  "authorized_email_domains",
  "external_authorized_email_domains",
  "verified_email_domains",
  "cached_code_officiel_geographique",
] as const;

export const Table_Context = createContext({
  page: 1,
  take: 10,
  count: 0,
});

export function Table({ organizations }: { organizations: Organization[] }) {
  const { page, take, count } = useContext(Table_Context);
  const page_index = page - 1;
  const last_page = Math.floor(count / take) + 1;

  return (
    <table>
      <thead>
        <tr>
          <th>Date de création</th>
          {fields.map((name) => (
            <th class="max-w-32 break-words">{name}</th>
          ))}

          <th>ID</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {organizations.map((organization) => (
          <tr>
            <td>
              <LocalTime date={organization.created_at} />
            </td>
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

            <td>{organization.id}</td>
            <td>
              <a
                class="p-3"
                href={
                  urls.legacy.organizations[":id"].$url({
                    param: {
                      id: organization.id.toString(),
                    },
                  }).pathname
                }
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
            {page_index * count}-{page_index * count + count} of {count}
          </td>
          <td colspan={3} class="inline-flex justify-center">
            <input
              class="text-right"
              hx-get={urls.legacy.organizations.$url().pathname}
              hx-replace-url="true"
              // hx-include={`#${SEARCH_EMAIL_INPUT_ID}`}
              hx-select={`#${ORGANIZATIONS_TABLE_ID} > table`}
              hx-target={`#${ORGANIZATIONS_TABLE_ID}`}
              hx-trigger="input changed delay:2s"
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
