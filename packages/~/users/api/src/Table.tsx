//

import { LocalTime } from "@~/app.ui/time/LocalTime";
import { hx_urls, urls } from "@~/app.urls";
import { useContext } from "hono/jsx";
import { match } from "ts-pattern";
import { Table_Context, type get_users_list_dto } from "./context";
import { USER_TABLE_ID } from "./page";

const fields = [
  "id",
  "email",
  "given_name",
  "family_name",
  "created_at",
  "last_sign_in_at",
  "email_verified_at",
] as const;

export async function Table({ users }: { users: get_users_list_dto["users"] }) {
  const { page, take, count } = useContext(Table_Context);

  return (
    <table class="!table">
      <thead>
        <tr>
          {fields.map((name) => (
            <th key={name}>{name}</th>
          ))}
          <th>Lien</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id.toString()}>
            {fields.map((name) => (
              <td key={name}>
                {match(user[name])
                  .when(
                    (_x): _x is string =>
                      name === "email_verified_at" ||
                      name === "last_sign_in_at" ||
                      name === "created_at",
                    (value) => <LocalTime date={value} />,
                  )
                  .otherwise((value) => value)}
              </td>
            ))}
            <td>
              <a
                class="p-3"
                href={
                  urls.users[":id"].$url({
                    param: { id: user.id.toString() },
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
            {page * take}-{page * take + take} of {count}
          </td>
          <td colspan={3} class="inline-flex justify-center">
            <input
              class="text-right"
              {...await hx_urls.users.$get({ query: {} })}
              // hx-include={`#${SEARCH_EMAIL_INPUT_ID}`}
              hx-select={`#${USER_TABLE_ID} > table`}
              hx-target={`#${USER_TABLE_ID}`}
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
