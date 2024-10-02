//

import { hyper_ref } from "@~/app.core/html";
import { hx_trigger_from_body } from "@~/app.core/htmx";
import { Loader } from "@~/app.ui/loader/Loader";
import { formattedPlural } from "@~/app.ui/plurial";
import { hx_urls } from "@~/app.urls";
import { ORGANISATION_EVENTS } from "@~/organizations.lib/event";
import { usePageRequestContext } from "./context";

//

export async function Domain_Organization() {
  const $describedby = hyper_ref();
  const {
    var: {
      moderation: { organization },
      query_domain_count,
    },
  } = usePageRequestContext();
  const count = await query_domain_count;
  return (
    <section>
      <details>
        <summary>
          <h3 class="inline-block" id={$describedby}>
            🌐 {count}{" "}
            {formattedPlural(count, {
              one: "domaine connu",
              other: "domaine connus",
            })}{" "}
            dans l'organisation
          </h3>
        </summary>
        <div
          {...await hx_urls.organizations[":id"].domains.$get({
            param: {
              id: organization.id.toString(),
            },
            query: { describedby: $describedby },
          })}
          hx-trigger={[
            "load",
            ...hx_trigger_from_body([ORGANISATION_EVENTS.Enum.DOMAIN_UPDATED]),
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
