//

import type { Session_Context } from ":common/session";
import type { Moderation } from ":database:moncomptepro";
import { input_group } from ":ui/form";
import { useRequestContext } from "hono/jsx-renderer";

//

const MODERATION_COMMENT_ID = "moderation-comment";


//

export function Comment({ moderation }: { moderation: Moderation }) {
  const { base, hint, input, label } = input_group({});

  const {
    var: { session },
  } = useRequestContext<Session_Context>();
  const userinfo = session.get("userinfo");
  if (!userinfo) return <></>;
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
