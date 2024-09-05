//

import {
  type Config,
  type ConversationMeta,
  fetch_crisp,
} from "@numerique-gouv/crisp";
import type {
  CreateConversationRoute,
  UpdateConversationMetaRoute,
} from "@numerique-gouv/crisp/router/conversation";

//

export function create_conversation_shell(config: Config) {
  return async function create_conversation({
    email,
    nickname,
    subject,
  }: Pick<ConversationMeta, "email" | "nickname" | "subject">) {
    const { session_id } = await fetch_crisp<CreateConversationRoute>(config, {
      endpoint: `/v1/website/${config.website_id}/conversation`,
      method: "POST",
      searchParams: {},
    });

    await fetch_crisp<UpdateConversationMetaRoute>(config, {
      endpoint: `/v1/website/${config.website_id}/conversation/${session_id}/meta`,
      method: "PATCH",
      searchParams: {},
      body: {
        email,
        nickname,
        segments: ["email", "moderation"],
        subject,
      },
    });

    return { session_id };
  };
}

export type create_conversation_fn = ReturnType<
  typeof create_conversation_shell
>;
