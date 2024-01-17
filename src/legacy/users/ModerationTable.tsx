//

import type { Moderation } from ":database:moncomptepro";
import { moderation_type_to_emoji } from ":legacy/moderations/moderation_type_to_emoji";
import { row } from ":ui/table";
import { createContext, useContext } from "hono/jsx";
import { match } from "ts-pattern";

//

export const ModerationTable_Context = createContext({
  page: 0,
  take: 5,
  count: 0,
  user_id: NaN,
});

const fields = ["id", "type", "created_at", "moderated_at", "comment"] as const;

export function ModerationTable({
  moderations,
}: {
  moderations: Moderation[];
}) {
  const { page, take, count, user_id } = useContext(ModerationTable_Context);

  return (
    <table>
      <thead>
        <tr>
          {fields.map((name) => (
            <th>{name}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        <tr>
          {moderations.map((moderation) => (
            <tr
              _={`on click set the window's location to '/legacy?id=${moderation.id}'`}
              class={row({ is_clickable: true })}
            >
              {fields.map((name) => (
                <td>
                  {match(moderation[name])
                    .when(
                      () => name === "type",
                      () => (
                        <span title={moderation.type}>
                          {moderation_type_to_emoji(moderation.type)}
                        </span>
                      ),
                    )
                    .when(
                      (x): x is Date => x instanceof Date,
                      (value) =>
                        `${value.toLocaleDateString()} ${value.toLocaleTimeString()}`,
                    )
                    .otherwise((value) => value)}
                </td>
              ))}
            </tr>
          ))}
        </tr>
      </tbody>

      {/* <tfoot>
        <tr>
          <th scope="row">Showing </th>
          <td colspan={2}>
            {page * take}-{page * take + take} of {count}
          </td>
          <td colspan={2} class="inline-flex justify-center">
            <input
              class="text-right"
              hx-get={`/legacy/users/${user_id}/organizations`}
              hx-trigger="input changed delay:500ms"
              hx-target="#table-user-organisations"
              id="page"
              name="page"
              type="number"
              value={String(page)}
            />
            <span> of {Math.floor(count / take)}</span>
          </td>
        </tr>
      </tfoot> */}
    </table>
  );
}
