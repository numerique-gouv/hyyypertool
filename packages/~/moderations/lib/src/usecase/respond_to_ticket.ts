//

import { NotFoundError } from "@~/app.core/error";
import { is_crisp_ticket } from "@~/crisp.lib";
import { is_zammad_ticket } from "@~/zammad.lib/is_zammad_ticket";
import { match } from "ts-pattern";
import type { RejectedFullMessage } from "../context/rejected";
import type { respond_in_conversation_fn } from "./respond_in_conversation";
import type { respond_to_zammad_ticket_fn } from "./respond_to_zammad_ticket";

//

export function respond_to_ticket_usecase(
  respond_in_conversation: respond_in_conversation_fn,
  respond_to_zammad_ticket: respond_to_zammad_ticket_fn,
  ticket_id: string | null,
) {
  return async function respond_to_ticket(full_message: RejectedFullMessage) {
    return match(ticket_id)
      .with(null, () => {
        throw new NotFoundError("No existing ticket.");
      })
      .when(is_crisp_ticket, () => respond_in_conversation(full_message))
      .when(is_zammad_ticket, () => respond_to_zammad_ticket(full_message))
      .otherwise(() => {
        throw new NotFoundError(`Unknown provider for "${ticket_id}"`);
      });
  };
}

export type respond_to_ticket_fn = ReturnType<typeof respond_to_ticket_usecase>;
