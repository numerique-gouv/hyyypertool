//

import { hyper_ref } from "@~/app.core/html";
import { hx_include, hx_trigger_from_body } from "@~/app.core/htmx";
import { Loader } from "@~/app.ui/loader";
import { formattedPlural } from "@~/app.ui/plurial";
import { hx_urls } from "@~/app.urls";
import type { Organization } from "@~/organizations.lib/entities/Organization";
import { ORGANISATION_EVENTS } from "@~/organizations.lib/event";
import { match, P } from "ts-pattern";

//

type Props = {
  isOpen?: boolean;
  organization: Pick<Organization, "id">;
  query_members_count: Promise<number>;
};
export async function UsersByOrganization(props: Props) {
  const $describedby = hyper_ref();
  const $page_ref = hyper_ref();
  const { organization, query_members_count } = props;
  const count = await query_members_count;
  const isOpen =
    props.isOpen ??
    match(count)
      .with(0, () => false)
      .with(P.number.between(1, 3), () => true)
      .otherwise(() => false);
  const hx_get_users_by_organization_props = {
    ...(await hx_urls.organizations[":id"].members.$get({
      param: { id: organization.id.toString() },
      query: { describedby: $describedby, page_ref: $page_ref },
    })),
  };

  return (
    <section>
      <details open={isOpen}>
        <summary>
          <h3 class="inline-block" id={$describedby}>
            👥 {count}{" "}
            {formattedPlural(count, {
              one: "membre connu",
              other: "membres connus",
            })}{" "}
            dans l’organisation
          </h3>
        </summary>

        <div
          {...hx_get_users_by_organization_props}
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
