//

import type { Entity_Schema, Pagination_Schema } from "@~/app.core/schema";
import type { App_Context } from "@~/app.middleware/context";
import type { GetModerationsByUserIdHandler } from "@~/moderations.repository/GetModerationsByUserId";
import type { Env } from "hono";
import { useRequestContext } from "hono/jsx-renderer";
import type { z } from "zod";

//

export type ModerationList = Awaited<ReturnType<GetModerationsByUserIdHandler>>;
export interface ContextVariablesType extends Env {
  Variables: {
    moderations: ModerationList;
  };
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
