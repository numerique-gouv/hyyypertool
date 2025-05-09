//

import { fetch_crisp } from "@gouvfr-lasuite/proconnect.crisp/client";
import type {
  CreateConversationRoute,
  GetConversationRoute,
  GetMessagesInAConversationRoute,
  OperatorsRouter,
  SendMessageInAConversationRoute,
  UpdateConversationMetaRoute,
} from "@gouvfr-lasuite/proconnect.crisp/router";
import type {
  Config,
  ConversationMeta,
  User,
} from "@gouvfr-lasuite/proconnect.crisp/types";
import { z } from "zod";
import type { CrispApi } from "./api";

//

export type CrispApiCradle = {
  crisp: CrispApi;
};

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

/**
 * @deprecated Use `crisp.send_message` instead.
 */
export async function send_message(
  config: Config,
  {
    content,
    session_id,
    user,
  }: { content: string; user: Partial<User>; session_id: string },
) {
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
}

/**
 * @deprecated Use `crisp.get_user` instead.
 */
export async function get_user(config: Config, { email }: { email: string }) {
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
}

/**
 * @deprecated Use `crisp.create_conversation` instead.
 */
export async function create_conversation(
  config: Config,
  {
    email,
    nickname,
    subject,
  }: Pick<ConversationMeta, "email" | "nickname" | "subject">,
) {
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
}

export type get_crisp_mail_dto = Awaited<ReturnType<typeof get_crisp_mail>>;
