//

import {
  fetch_crisp,
  type Config,
  type ConversationMeta,
  type User,
} from "@numerique-gouv/crisp";
import type {
  CreateConversationRoute,
  SendMessageInAConversationRoute,
  UpdateConversationMetaRoute,
} from "@numerique-gouv/crisp/router/conversation";
import type { OperatorsRouter } from "@numerique-gouv/crisp/router/operators";

export function CrispApi(config: Config) {
  return {
    create_conversation: CreateConversation(config),
    send_message: SendMessage(config),
    get_user: GetUserInfo(config),
  };
}

export type CrispApi = ReturnType<typeof CrispApi>;

//

function CreateConversation(config: Config) {
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

function SendMessage(config: Config) {
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

export function GetUserInfo(config: Config) {
  return async function get_user({ email }: { email: string }) {
    const operators = await fetch_crisp<OperatorsRouter>(config, {
      endpoint: `/v1/website/${config.website_id}/operators/list`,
      method: "GET",
      searchParams: {},
    });

    const operator = operators.find(({ details }) => details.email === email);

    if (!operator) throw new Error(`Operator "${email}" not found.`);

    return {
      user_id: operator.details.user_id,
      nickname: `${operator.details.first_name} ${operator.details.last_name}`,
    } as User;
  };
}
