//

import { hyper_ref } from "@~/app.core/html";
import { hx_include, hx_trigger_from_body } from "@~/app.core/htmx";
import { Loader } from "@~/app.ui/loader/Loader";
import { formattedPlural } from "@~/app.ui/plurial";
import { hx_urls } from "@~/app.urls";
import { ORGANISATION_EVENTS } from "@~/organizations.lib/event";
import { match, P } from "ts-pattern";
import { usePageRequestContext } from "./context";

//

export async function Members_Of_Organization_Table() {
  const $describedby = hyper_ref();
  const $page_ref = hyper_ref();
  const {
    var: { moderation, query_organization_members_count },
  } = usePageRequestContext();

  const count = await query_organization_members_count;
  const isOpen = match(count)
    .with(0, () => false)
    .with(P.number.between(1, 3), () => true)
    .otherwise(() => false);

  return (
    <section>
      <details open={isOpen}>
        <summary id={$describedby}>
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
          class="fr-table"
          {...await hx_urls.organizations[":id"].members.$get({
            param: {
              id: moderation.organization_id.toString(),
            },
            query: { describedby: $describedby, page_ref: $page_ref },
          })}
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
