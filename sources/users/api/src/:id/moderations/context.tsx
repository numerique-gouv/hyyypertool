//

import type { Entity_Schema, Pagination_Schema } from "@~/app.core/schema";
import type { App_Context } from "@~/app.middleware/context";
import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect.database";
import { GetModerationsByUserId, type GetModerationsByUserIdHandler } from "@~/moderations.repository/GetModerationsByUserId";
import type { Env } from "hono";
import { useRequestContext } from "hono/jsx-renderer";
import type { z } from "zod";

//

export async function loadModerationsPageVariables(
  pg: IdentiteProconnect_PgDatabase,
  { user_id }: { user_id: number },
) {
  const get_moderations_by_user_id = GetModerationsByUserId({ pg });
  const moderations = await get_moderations_by_user_id(user_id);

  return {
    moderations,
  };
}

//

export type ModerationList = Awaited<ReturnType<GetModerationsByUserIdHandler>>;
export interface ContextVariablesType extends Env {
  Variables: Awaited<ReturnType<typeof loadModerationsPageVariables>>;
}
export type ContextType = App_Context & ContextVariablesType;

//

type PageInputType = {
  out: {
    param: z.input<typeof Entity_Schema>;
    query: z.input<typeof Pagination_Schema>;
  };
};

export const usePageRequestContext = useRequestContext<
  ContextType,
  any,
  PageInputType
>;
