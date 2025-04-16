//

import { hyper_ref } from "@~/app.core/html";
import { hx_include, hx_trigger_from_body } from "@~/app.core/htmx";
import { Loader } from "@~/app.ui/loader/Loader";
import { formattedPlural } from "@~/app.ui/plurial";
import { hx_urls } from "@~/app.urls";
import { ORGANISATION_EVENTS } from "@~/organizations.lib/event";
import type { User } from "@~/users.lib/entities/User";
import type { CountUserMembershipsHandler } from "@~/users.lib/usecase/CountUserMemberships";

//

type Props = {
  isOpen?: boolean;
  query_organization_count: CountUserMembershipsHandler;
  user: Pick<User, "id" | "given_name" | "family_name">;
};
export async function OrganizationsByUser(props: Props) {
  const { user, query_organization_count } = props;
  const $describedby = hyper_ref();
  const $page_ref = hyper_ref();
  const count = await query_organization_count(user.id);
  const isOpen = props.isOpen ?? false;
  const hx_get_organizations_by_user = await hx_urls.users[
    ":id"
  ].organizations.$get({
    param: { id: user.id.toString() },
    query: { describedby: $describedby, page_ref: $page_ref },
  });

  return (
    <section>
      <details open={isOpen}>
        <summary>
          <h3 class="inline-block" id={$describedby}>
            🏢 {count}{" "}
            {formattedPlural(count, {
              one: "organisation connu",
              other: "organisations connues",
            })}{" "}
            pour {user.given_name} {user.family_name}
          </h3>
        </summary>

        <div
          {...hx_get_organizations_by_user}
          class="fr-table"
          hx-include={hx_include([$page_ref])}
          hx-target="this"
          hx-trigger={[
            "load",
            hx_trigger_from_body([ORGANISATION_EVENTS.Enum.MEMBERS_UPDATED]),
          ].join(", ")}
        >
          <center>
            <Loader />
          </center>
        </div>
      </details>
    </section>
  );
}
