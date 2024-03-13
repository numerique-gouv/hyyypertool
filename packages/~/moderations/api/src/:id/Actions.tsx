//

import { hyper_ref } from "@~/app.core/html";
import { Desicison } from "./Desicison";
import { Desicison_Context } from "./Desicison_Context";
import { Member_Invalid } from "./Member_Invalid";
import { Member_Valid } from "./Member_Valid";
import { MessageInfo } from "./MessageInfo";

//

export function Moderation_Actions() {
  return (
    <div class="bg-[var(--background-alt-blue-france)] p-8">
      <h2>
        Actions de modération <small class="fr-badge fr-badge--new">beta</small>{" "}
      </h2>

      <MessageInfo />

      <hr class="bg-none" />

      <Desicison_Context.Provider
        value={{
          $accept: hyper_ref(),
          $form: hyper_ref(),
          $message: hyper_ref(),
          $reject: hyper_ref(),
          $select: hyper_ref(),
        }}
      >
        <Desicison />
        <Member_Valid />
        <Member_Invalid />
      </Desicison_Context.Provider>
    </div>
  );
}
