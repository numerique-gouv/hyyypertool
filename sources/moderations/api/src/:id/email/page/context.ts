//

import { DescribedBy_Schema, Entity_Schema } from "@~/app.core/schema";
import type { App_Context } from "@~/app.middleware/context";
import type { Crisp_Context } from "@~/crisp.middleware";
import type { GetCripsFromSessionIdHandler } from "@~/moderations.lib/usecase/GetCripsFromSessionId";
import type { GetModerationForEmailDto } from "@~/moderations.repository";
import { type get_zammad_mail_dto } from "@~/zammad.lib/get_zammad_mail";
import { type Env } from "hono";
import { useRequestContext } from "hono/jsx-renderer";
import type { z } from "zod";

//

export interface ContextVariablesType extends Env {
  Variables: {
    MAX_ARTICLE_COUNT: number;
    //
    crisp?: Awaited<ReturnType<GetCripsFromSessionIdHandler>>;
    moderation: GetModerationForEmailDto;
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

type PageInputType = {
  out: {
    param: z.input<typeof Entity_Schema>;
    query: z.input<typeof DescribedBy_Schema>;
  };
};

export const usePageRequestContext = useRequestContext<
  ContextType,
  any,
  PageInputType
>;
