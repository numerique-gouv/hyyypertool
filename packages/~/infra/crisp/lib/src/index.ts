//

import { fetch_crisp, type Config } from "@numerique-gouv/crisp";
import type {
  GetConversationRoute,
  GetMessagesInAConversationRoute,
} from "@numerique-gouv/crisp/router/conversation";
import { z } from "zod";

//

export function is_crisp_ticket(session_id: string | number) {
  return z.string().startsWith("session_").safeParse(session_id).success;
}

//

export async function get_crisp_mail(
  config: Config,
  { session_id }: { session_id: string },
) {
  const conversation = await fetch_crisp<GetConversationRoute>(config, {
    endpoint: `/v1/website/${config.website_id}/conversation/${session_id}`,
    method: "GET",
    searchParams: {},
  });

  const messages = await fetch_crisp<GetMessagesInAConversationRoute>(config, {
    endpoint: `/v1/website/${config.website_id}/conversation/${session_id}/messages`,
    method: "GET",
    searchParams: {},
  });

  return { conversation, messages };
}

export type get_crisp_mail_dto = Awaited<ReturnType<typeof get_crisp_mail>>;
