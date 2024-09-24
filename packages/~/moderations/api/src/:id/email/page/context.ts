//

import { NotFoundError } from "@~/app.core/error";
import type { App_Context } from "@~/app.middleware/context";
import { urls } from "@~/app.urls";
import type { get_crisp_mail_dto } from "@~/crisp.lib";
import type { Crisp_Context } from "@~/crisp.middleware";
import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { type get_zammad_mail_dto } from "@~/zammad.lib/get_zammad_mail";
import { eq } from "drizzle-orm";
import type { Env, InferRequestType } from "hono";
import { useRequestContext } from "hono/jsx-renderer";

//

export interface ContextVariablesType extends Env {
  Variables: {
    MAX_ARTICLE_COUNT: number;
    //
    crisp:
      | undefined
      | {
          conversation: get_crisp_mail_dto["conversation"];
          messages: get_crisp_mail_dto["messages"];
          session_id: string;
          show_more: boolean;
          subject: string;
        };
    moderation: get_moderation_dto;
    zammad:
      | undefined
      | {
          articles: get_zammad_mail_dto;
          show_more: boolean;
          subject: string;
          ticket_id: string;
        };
  };
}
export type ContextType = App_Context & Crisp_Context & ContextVariablesType;

//

const $get = typeof urls.moderations[":id"].email.$get;
type PageInputType = {
  out: InferRequestType<typeof $get>;
};

export const usePageRequestContext = useRequestContext<
  ContextType,
  any,
  PageInputType
>;

//

export async function get_moderation(
  pg: MonComptePro_PgDatabase,
  { moderation_id }: { moderation_id: number },
) {
  const moderation = await pg.query.moderations.findFirst({
    columns: { ticket_id: true },
    where: eq(schema.moderations.id, moderation_id),
    with: { user: { columns: { email: true } } },
  });

  if (!moderation) {
    throw new NotFoundError("Moderation not found");
  }

  return moderation;
}

export type get_moderation_dto = Awaited<ReturnType<typeof get_moderation>>;