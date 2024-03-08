//

import { Loader } from "@~/app.ui/loader/Loader";
import { hx_urls } from "@~/app.urls";
import { useContext } from "hono/jsx";
import { ModerationPage_Context } from "./context";

//

export function Organizations_Of_User_Table() {
  const { moderation } = useContext(ModerationPage_Context);

  return (
    <section>
      <h3>
        Organisations de {moderation.users.given_name}{" "}
        {moderation.users.family_name}
      </h3>

      <div
        {...hx_urls.users[":id"].organizations.$get({
          param: { id: moderation.user_id.toString() },
          query: {},
        })}
        hx-target="this"
        hx-trigger="load"
      >
        <center>
          <Loader />
        </center>
      </div>
    </section>
  );
}
