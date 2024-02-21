//

import env from ":common/env";
import { HTTPError } from ":common/errors";
import consola from "consola";
import { z } from "zod";

//

export const ARTICLE_TYPE = z.nativeEnum({ EMAIL: 1 } as const);
type Article_Type = z.infer<typeof ARTICLE_TYPE>;
export const PRIORITY_TYPE = z.nativeEnum({ NORMAL: 1 } as const);
type Priority_Type = z.infer<typeof PRIORITY_TYPE>;
export const GROUP_MONCOMPTEPRO = "MonComptePro";
export const GROUP_MONCOMPTEPRO_SENDER_ID = 1;

//

export async function get_zammad_me() {
  const response = await fetch_zammad_api({
    endpoint: `/api/v1/users/me`,
    method: "GET",
    searchParams: {},
  });

  return response.json() as Promise<User>;
}

export async function get_full_ticket({ ticket_id }: { ticket_id: number }) {
  const response = await fetch_zammad_api({
    endpoint: `/api/v1/tickets/${ticket_id}`,
    method: "GET",
    searchParams: { all: "true" },
  });

  return response.json() as Promise<SearchResult>;
}

export async function get_zammad_mail({ ticket_id }: { ticket_id: number }) {
  const response = await fetch_zammad_api({
    endpoint: `/api/v1/ticket_articles/by_ticket/${ticket_id}`,
    method: "GET",
    searchParams: {
      page: String(1),
      per_page: String(1),
      sort_by: "created_at",
      order_by: "desc",
    },
  });

  return response.json() as Promise<Article[]>;
}

export async function get_zammad_attachment({
  article_id,
  attachment_id,
  ticket_id,
}: {
  article_id: number;
  attachment_id: number;
  ticket_id: number;
}) {
  const response = await fetch_zammad_api({
    endpoint: `/api/v1/ticket_attachment/${ticket_id}/${article_id}/${attachment_id}`,
    method: "GET",
    searchParams: {},
  });

  return response;
}

export async function send_zammad_new_email(body: NewTicket) {
  const response = await fetch_zammad_api({
    body,
    endpoint: `/api/v1/tickets`,
    method: "POST",
    searchParams: {},
  });

  const ticket: Ticket = await response.json();

  return ticket;
}

export async function send_zammad_response(
  ticket_id: number,
  body: UpdateTicket,
) {
  const response = await fetch_zammad_api({
    body,
    endpoint: `/api/v1/tickets/${ticket_id}`,
    method: "PUT",
    searchParams: {},
  });

  const ticket: Ticket = await response.json();

  return ticket;
}

//

export interface SearchResult {
  tickets: number[];
  tickets_count: number;
  assets: {
    Ticket?: Record<`${number}`, Ticket>;
    Group?: Record<`${number}`, unknown>;
    User?: Record<`${number}`, User>;
    Role?: Record<`${number}`, unknown>;
  };
}

export interface User {
  active: boolean;
  created_at: string;
  email: string;
  firstname: string;
  id: number;
  image: string;
  last_login: string;
  lastname: string;
  login: string;
  note: string;
  organization_id: number;
  updated_at: string;
  updated_by_id: string;
  verified: boolean;
}

export interface Ticket {
  article_ids: number[];
  customer_id: number | `guess:${string}`;
  group: string;
  id: number;
  owner_id: number | undefined;
  priority_id: Priority_Type;
  state: "closed" | "open";
  title: string;
}

export interface NewArticle
  extends Omit<Article, "id" | "created_at" | "created_by"> {}

export interface NewTicket extends Omit<Ticket, "article_ids" | "id"> {
  article: NewArticle;
}

export interface UpdateTicket
  extends Omit<Partial<Ticket>, "article_ids" | "customer_id" | "id"> {
  article: NewArticle;
}

export interface Article {
  body: string;
  content_type: "text/html";
  created_at: string;
  created_by: string;
  from?: "MonComptePro" | string;
  id: number;
  internal?: boolean;
  sender_id: number;
  subject: string;
  subtype?: "reply";
  to: string;
  type_id: Article_Type;
}

interface Zammad_Pagination {
  per_page: string;
  page: string;
}

interface Zammad_Order {
  sort_by: string;
  order_by: "asc" | "desc";
}

type Options =
  | {
      endpoint: `/api/v1/users/me`;
      method: "GET";
      searchParams: {};
    }
  | {
      endpoint: `/api/v1/tickets/${number}`;
      method: "GET";
      searchParams: { all: "true" | "false" };
    }
  | {
      endpoint: `/api/v1/tickets`;
      method: "POST";
      body: NewTicket;
      searchParams: {};
    }
  | {
      endpoint: `/api/v1/tickets/${number}`;
      method: "PUT";
      body: UpdateTicket;
      searchParams: {};
    }
  | {
      endpoint: `/api/v1/ticket_articles/by_ticket/${number}`;
      method: "GET";
      searchParams: Partial<Zammad_Pagination & Zammad_Order>;
    }
  | {
      endpoint: `/api/v1/ticket_attachment/${number}/${number}/${number}`;
      method: "GET";
      searchParams: {};
    };

async function fetch_zammad_api(options: Options) {
  const searchParams = new URLSearchParams(options.searchParams);
  const url = `${env.ZAMMAD_URL}${options.endpoint}?${searchParams.toString()}`;
  const headers = new Headers({
    "content-type": "application/json",
    Authorization: `Bearer ${env.ZAMMAD_TOKEN}`,
  });

  consola.info(`  <<-- ${options.method} ${url}`);

  const response = await fetch(url, {
    method: options.method,
    headers,
    body: options.method === "GET" ? undefined : JSON.stringify(options.body),
  });

  consola.info(
    `  -->> ${options.method} ${url} ${response.status} ${response.statusText}`,
  );

  if (!response.ok) {
    throw new HTTPError(`${url} ${response.status} ${response.statusText}`);
  }

  return response;
}
