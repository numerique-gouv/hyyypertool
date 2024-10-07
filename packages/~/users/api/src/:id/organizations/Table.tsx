//

import { date_to_dom_string } from "@~/app.core/date/date_format";
import { Pagination_Schema } from "@~/app.core/schema";
import { Foot } from "@~/app.ui/hx_table";
import { notice } from "@~/app.ui/notice";
import { Time } from "@~/app.ui/time/LocalTime";
import { hx_urls, urls } from "@~/app.urls";
import type { get_organizations_by_user_id_dto } from "@~/organizations.repository/get_organizations_by_user_id";
import { match } from "ts-pattern";
import { usePageRequestContext } from "./context";

//

export async function Table() {
  const {
    req,
    var: { count, organizations },
  } = usePageRequestContext();
  const { id: user_id } = req.valid("param");
  const { describedby } = req.valid("query");

  const pagination = match(
    Pagination_Schema.safeParse(req.query(), { path: ["req.query()"] }),
  )
    .with({ success: true }, ({ data }) => data)
    .otherwise(() => Pagination_Schema.parse({}));

  const hx_get_organizations_query_props = hx_urls.users[
    ":id"
  ].organizations.$get({
    param: {
      id: user_id.toString(),
    },
    query: {},
  });

  return (
    <div class="fr-table [&>table]:table">
      <table aria-describedby={describedby}>
        <thead>
          <tr>
            <th>Date de création</th>
            <th class="break-words">Siret</th>
            <th class="break-words">Libellé</th>
            <th class="break-words">Domains</th>
            <th class="max-w-32 break-words">Code géographique officiel</th>

            <th></th>
          </tr>
        </thead>

        <tbody>
          {organizations.map((organization) => (
            <Row key={organization.id.toString()} organization={organization} />
          ))}
        </tbody>

        <Foot
          count={count}
          hx_query_props={hx_get_organizations_query_props}
          pagination={pagination}
        />
      </table>
    </div>
  );
}

//

export function Row({
  key,
  organization,
}: {
  key?: string;
  organization: Awaited<get_organizations_by_user_id_dto>["organizations"][number];
}) {
  const {
    cached_code_officiel_geographique,
    cached_libelle,
    created_at,
    email_domains,
    id,
    siret,
  } = organization;

  return (
    <tr key={key}>
      <td>
        <Time date={created_at}>
          {date_to_dom_string(new Date(created_at))}
        </Time>
      </td>
      <td>{siret}</td>
      <td>{cached_libelle}</td>
      <td>{email_domains.map(({ domain }) => domain).join(", ")}</td>
      <td>{cached_code_officiel_geographique}</td>
      <td class="!text-right">
        <a
          class="p-3"
          href={
            urls.organizations[":id"].$url({ param: { id: id.toString() } })
              .pathname
          }
        >
          ➡️
        </a>
      </td>
    </tr>
  );
}

export function EmptyTable() {
  const { base, container, body, title } = notice();
  return (
    <div class={base()}>
      <div class={container()}>
        <div class={body()}>
          <p class={title()}>
            🥹 Aucune organisation n'a été trouvée pour cet utilisateur.
          </p>
        </div>
      </div>
    </div>
  );
}
