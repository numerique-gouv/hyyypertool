import { api_ref } from ":api_ref";
import { type User } from ":database:moncomptepro";
import { createContext, useContext } from "hono/jsx";
import { match } from "ts-pattern";
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

export const Table_Context = createContext({
  page: 0,
  take: 10,
  count: 0,
});

export function Table({ users }: { users: User[] }) {
  const { page, take, count } = useContext(Table_Context);

  return (
    <table class="!table">
      <thead>
        <tr>
          {fields.map((name) => (
            <th>{name}</th>
          ))}
          <th>Lien</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr>
            {fields.map((name) => (
              <td>
                {match(user[name])
                  .when(
                    (x): x is Date => x instanceof Date,
                    (value) =>
                      `${value.toLocaleDateString()} ${value.toLocaleTimeString()}`,
                  )
                  .otherwise((value) => value)}
              </td>
            ))}
            <td>
              <a
                class="p-3"
                href={api_ref("/legacy/users/:id", {
                  id: String(user.id),
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
              hx-get={api_ref("/legacy/users", {})}
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
