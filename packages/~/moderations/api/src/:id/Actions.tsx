//

import { button } from "@~/app.ui/button";
import { hx_urls } from "@~/app.urls";
import { useContext } from "hono/jsx";
import { Desicison } from "./Desicison";
import { Member_Invalid } from "./Member_Invalid";
import { Member_Valid } from "./Member_Valid";
import { MessageInfo } from "./MessageInfo";
import { ModerationPage_Context } from "./context";

//

export async function Moderation_Actions() {
  const { moderation } = useContext(ModerationPage_Context);

  const hx_moderation_reprocess_props = await hx_urls.moderations[
    ":id"
  ].$procedures.reprocess.$patch({
    param: { id: moderation.id.toString() },
  });

  return (
    <div class="bg-[var(--background-alt-blue-france)] p-8">
      <h2>
        Actions de modération <small class="fr-badge fr-badge--new">beta</small>{" "}
      </h2>

      <MessageInfo />

      <hr class="bg-none" />
      {moderation.moderated_at ? (
        <button
          class={button({ size: "sm", type: "tertiary" })}
          {...hx_moderation_reprocess_props}
          hx-swap="none"
        >
          Retraiter
        </button>
      ) : (
        <>
          <Desicison />
          <Member_Valid />
          <Member_Invalid />
        </>
      )}
    </div>
  );
}
