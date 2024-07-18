//

import { hyper_ref } from "@~/app.core/html";
import { hx_include, hx_trigger_from_body } from "@~/app.core/htmx";
import { Loader } from "@~/app.ui/loader/Loader";
import { hx_urls } from "@~/app.urls";
import { ORGANISATION_EVENTS } from "@~/organizations.lib/event";
import { usePageRequestContext } from "./context";

//

export async function Members_Of_Organization_Table() {
  const $describedby = hyper_ref();
  const $page_ref = hyper_ref();
  const {
    var: { moderation },
  } = usePageRequestContext();

  return (
    <section>
      <h3 id={$describedby}>👥 Membres connus dans l’organisation</h3>

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
    </section>
  );
}
