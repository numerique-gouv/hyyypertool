//

import { UserInfo_Context } from ":auth/userinfo.context";
import type { Moderation } from ":database:moncomptepro";
import { input_group } from ":ui/form";
import { useContext } from "hono/jsx";

//

const MODERATION_COMMENT_ID = "moderation-comment";

//

export function Comment({ moderation }: { moderation: Moderation }) {
  const { base, hint, input, label } = input_group({});

  const userinfo = useContext(UserInfo_Context);
  const from = userinfo.email;

  return (
    <div class="fr-fieldset__element fr-fieldset__element--inline fr-fieldset__element--postal">
      <div class={base()}>
        <label class={label()} for={MODERATION_COMMENT_ID}>
          Commentaire
          <span class={hint()}>Votre commentaire sera prefixé par {from}</span>
        </label>
        <input
          class={input()}
          type="text"
          id={MODERATION_COMMENT_ID}
          name={MODERATION_COMMENT_ID}
        />
      </div>
    </div>
  );
}
