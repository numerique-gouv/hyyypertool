//

import env from ":common/env";
import { HTTPError } from ":common/errors";
import { z } from "zod";

//

const CLOSED_STATE_ID = "4";
const ARTICLE_TYPE = z.nativeEnum({ EMAIL: 1 } as const);
type Article_Type = z.infer<typeof ARTICLE_TYPE>;
const GROUP_MONCOMPTEPRO = "MonComptePro";
export const GROUP_MONCOMPTEPRO_SENDER_ID = 1;
const NORMAL_PRIORITY_ID = "1";

//

export async function get_zammad_me() {
  const response = await fetch_zammad_api({
    endpoint: `/api/v1/users/me`,
    method: "GET",
    searchParams: {},
  });

  return response.json() as Promise<User>;
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

  return response.json() as Promise<Zammad_Article[]>;
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

export async function send_zammad_mail({
  body,
  sender_id,
  state,
  subject,
  ticket_id,
  to,
}: {
  body: string;
  sender_id: number;
  state: UpdateTicket["state"];
  subject: string;
  ticket_id: number;
  to: string;
}) {
  const response = await fetch_zammad_api({
    body: {
      state,
      article: {
        body,
        content_type: "text/html",
        sender_id,
        subject,
        subtype: "reply",
        to,
        type_id: ARTICLE_TYPE.enum.EMAIL,
      },
    },
    endpoint: `/api/v1/tickets/${ticket_id}`,
    method: "PUT",
    searchParams: {},
  });

  const ticket: Ticket = await response.json();

  return ticket;
}

//

interface User {
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

interface Ticket {
  id: number;
  title: string;
  article_ids: number[];
}
interface UpdateTicket {
  state: "closed" | "open";
  article: {
    body: string;
    content_type: "text/html";
    from?: string;
    internal?: boolean;
    subject: string;
    subtype: "reply";
    to: string;
    sender_id: number;
    type_id: Article_Type;
  };
}

export interface Zammad_Article {
  body: string;
  created_at: string;
  created_by: string;
  id: number;
  from: string;
  sender_id: number;
  subject: string;
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

  // if (env.DO_NOT_SEND_MAIL) {
  //   console.info(`Send mail not send to ${ticket_id}:`);
  //   console.info(data);
  //   return { id: null } as Ticket;
  // }
  console.debug(`fetch_zammad_api: ${url}`);
  const response = await fetch(url, {
    method: options.method,
    headers,
    body: options.method === "GET" ? undefined : JSON.stringify(options.body),
  });

  if (!response.ok) {
    throw new HTTPError(`${url} ${response.status} ${response.statusText}`);
  }

  return response;
}
