//

import { NotFoundError } from "@~/app.core/error";
import { DescribedBy_Schema, Entity_Schema } from "@~/app.core/schema";
import type { App_Context } from "@~/app.middleware/context";
import type { Crisp_Context } from "@~/crisp.middleware";
import type { GetCripsFromSessionIdHandler } from "@~/moderations.lib/usecase/GetCripsFromSessionId";
import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { type get_zammad_mail_dto } from "@~/zammad.lib/get_zammad_mail";
import { eq } from "drizzle-orm";
import { type Env } from "hono";
import { useRequestContext } from "hono/jsx-renderer";
import type { z } from "zod";

//

export interface ContextVariablesType extends Env {
  Variables: {
    MAX_ARTICLE_COUNT: number;
    //
    crisp?: Awaited<ReturnType<GetCripsFromSessionIdHandler>>;
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
