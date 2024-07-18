//

import { hx_trigger_from_body } from "@~/app.core/htmx";
import { Loader } from "@~/app.ui/loader/Loader";
import { hx_urls } from "@~/app.urls";
import { ORGANISATION_EVENTS } from "@~/organizations.lib/event";
import { usePageRequestContext } from "./context";

//

export async function Organizations_Of_User_Table() {
  const {
    var: { moderation },
  } = usePageRequestContext();

  return (
    <section>
      <h3>
        Organisations de {moderation.user.given_name}{" "}
        {moderation.user.family_name}
      </h3>

      <div
        {...await hx_urls.users[":id"].organizations.$get({
          param: { id: moderation.user_id.toString() },
          query: {},
        })}
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
