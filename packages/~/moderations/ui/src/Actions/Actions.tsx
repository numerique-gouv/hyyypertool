//

import { hyper_ref } from "@~/app.core/html";
import { z_email_domain } from "@~/app.core/schema/z_email_domain";
import { button } from "@~/app.ui/button";
import { hx_urls } from "@~/app.urls";
import { MessageInfo } from "@~/moderations.ui/MessageInfo";
import { context, type Values } from "./context";
import { Desicison } from "./Desicison";
import { MemberInvalid } from "./MemberInvalid";
import { MemberValid } from "./MemberValid";

//

type ActionProps = {
  value: Omit<Values, "$accept" | "$decision_form" | "$reject" | "domain">;
};

export async function Actions({ value }: ActionProps) {
  const { moderation } = value;

  const hx_moderation_reprocess_props = await hx_urls.moderations[
    ":id"
  ].$procedures.reprocess.$patch({
    param: { id: moderation.id.toString() },
  });

  const domain = z_email_domain.parse(moderation.user.email, {
    path: ["user.email"],
  });

  return (
    <context.Provider
      value={{
        $accept: hyper_ref(),
        $decision_form: hyper_ref(),
        $reject: hyper_ref(),
        domain,
        ...value,
      }}
    >
      <div class="bg-[var(--background-alt-blue-france)] p-8">
        <h2>Actions de modération</h2>

        <MessageInfo moderation={moderation} />

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
            <MemberValid />
            <MemberInvalid />
          </>
        )}
      </div>
    </context.Provider>
  );
}
