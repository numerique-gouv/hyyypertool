//

import { type Config, type User, fetch_crisp } from "@numerique-gouv/crisp";
import type { SendMessageInAConversationRoute } from "@numerique-gouv/crisp/router/conversation";

//

export function send_message_shell(config: Config) {
  return async function send_message({
    content,
    session_id,
    user,
  }: {
    content: string;
    user: Partial<User>;
    session_id: string;
  }) {
    return fetch_crisp<SendMessageInAConversationRoute>(config, {
      endpoint: `/v1/website/${config.website_id}/conversation/${session_id}/message`,
      method: "POST",
      searchParams: {},
      body: {
        content,
        from: "operator",
        origin: config.plugin_urn as `urn:${string}`,
        type: "text",
        user,
      },
    });
  };
}

export type send_message_fn = ReturnType<typeof send_message_shell>;
