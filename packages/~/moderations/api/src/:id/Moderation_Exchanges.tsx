//

import { hx_trigger_from_body } from "@~/app.core/htmx";
import { Loader } from "@~/app.ui/loader/Loader";
import { urls } from "@~/app.urls";
import { MODERATION_EVENTS } from "@~/moderations.lib/event";
import { useContext } from "hono/jsx";
import { ModerationPage_Context } from "./context";

//

export function Moderation_Exchanges() {
  const { moderation } = useContext(ModerationPage_Context);

  return (
    <section>
      <h2>Échanges entre {moderation.users.given_name} et nous : </h2>

      <div
        hx-get={
          urls.moderations[":id"].email.$url({
            param: { id: moderation.id.toString() },
          }).pathname
        }
        hx-trigger={[
          "load",
          hx_trigger_from_body([
            MODERATION_EVENTS.Enum.MODERATION_EMAIL_UPDATED,
          ]),
        ].join(", ")}
      >
        <div class="my-24 flex flex-col items-center justify-center">
          Chargement des échanges avec {moderation.users.given_name}
          <br />
          <Loader />
        </div>
      </div>
    </section>
  );
}
