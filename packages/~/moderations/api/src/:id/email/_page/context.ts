//

import type { App_Context } from "@~/app.middleware/context";
import { urls } from "@~/app.urls";
import type { get_crisp_mail_dto } from "@~/crisp.lib";
import type { Crisp_Context } from "@~/crisp.middleware";
import { type get_zammad_mail_dto } from "@~/zammad.lib/get_zammad_mail";
import type { Env, InferRequestType } from "hono";
import { useRequestContext } from "hono/jsx-renderer";
import type { Simplify } from "hono/utils/types";

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
    moderation: Simplify<
      Pick<Moderation, "ticket_id"> & { user: Pick<User, "email"> }
    >;
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
