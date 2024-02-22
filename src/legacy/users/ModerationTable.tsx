//

import { row } from ":ui/table";
import { urls } from "@~/app.urls";
import { moderation_type_to_emoji } from "@~/moderations.lib/moderation_type.mapper";
import type { Moderation } from "@~/moncomptepro.database";
import { createContext } from "hono/jsx";
import { match } from "ts-pattern";

//

export const ModerationTable_Context = createContext({
  page: 0,
  take: 10,
  count: 0,
  user_id: NaN,
});

const fields = ["id", "type", "created_at", "moderated_at", "comment"] as const;

export function ModerationTable({
  moderations,
}: {
  moderations: Moderation[];
}) {
  // const { page, take, count, user_id } = useContext(ModerationTable_Context);

  return (
    <table>
      <thead>
        <tr>
          {fields.map((name) => (
            <th key={name}>{name}</th>
          ))}
          <th>Lien</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          {moderations.map((moderation) => (
            <tr class={row()} key={moderation.id}>
              {fields.map((name) => (
                <td key={name}>
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
              <td>
                <a
                  class="p-3"
                  href={
                    urls.legacy.moderations[":id"].$url({
                      param: { id: moderation.id.toString() },
                    }).pathname
                  }
                >
                  ➡️
                </a>
              </td>
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
