//

import { hx_trigger_from_body } from "@~/app.core/htmx";
import { Loader } from "@~/app.ui/loader/Loader";
import { hx_urls } from "@~/app.urls";
import { ORGANISATION_EVENTS } from "@~/organizations.lib/event";
import { usePageRequestContext } from "./context";

//

export async function Domain_Organization() {
  const {
    var: {
      moderation: { organization },
    },
  } = usePageRequestContext();
  return (
    <section>
      <h3>🌐 Domaines de l'organisation</h3>

      <div
        {...await hx_urls.organizations[":id"].domains.$get({
          param: {
            id: organization.id.toString(),
          },
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
    </section>
  );
}
