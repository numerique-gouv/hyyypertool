//

import { hyper_ref } from "@~/app.core/html";
import { z_email_domain } from "@~/app.core/schema/z_email_domain";
import { AcceptModal } from "./AcceptModal";
import { context, type Values } from "./context";
import { RefusalModal } from "./RefusalModal";
import { Toolbar } from "./Toolbar";

//

type ActionProps = {
  value: Omit<Values, "$accept" | "$decision_form" | "$reject" | "domain">;
};

export async function Actions({ value }: ActionProps) {
  const { moderation } = value;

  const { user } = moderation;

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
      <Toolbar moderation={moderation} />
      <AcceptModal userEmail={user.email} moderation={moderation} />
      <RefusalModal userEmail={user.email} />
    </context.Provider>
  );
}
