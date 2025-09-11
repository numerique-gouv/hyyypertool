//

import { Entity_Schema } from "@~/app.core/schema";
import type { App_Context } from "@~/app.middleware/context";
import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect.database";
import { Duplicate_Warning } from "./Duplicate_Warning";
import type { Env } from "hono";
import { useRequestContext } from "hono/jsx-renderer";
import { z } from "zod";

//

export async function loadDuplicateWarningPageVariables(
  pg: IdentiteProconnect_PgDatabase,
  { moderation_id, organization_id, user_id }: { 
    moderation_id: number; 
    organization_id: number; 
    user_id: number; 
  },
) {
  const value = await Duplicate_Warning.queryContextValues(pg, {
    moderation_id,
    organization_id,
    user_id,
  });

  return value;
}

//

export interface ContextVariablesType extends Env {
  Variables: Awaited<ReturnType<typeof loadDuplicateWarningPageVariables>>;
}
export type ContextType = App_Context & ContextVariablesType;

//

export const QuerySchema = z.object({
  organization_id: z.string().pipe(z.coerce.number().int().nonnegative()),
  user_id: z.string().pipe(z.coerce.number().int().nonnegative()),
});

export const ParamSchema = Entity_Schema;

//

type PageInputType = {
  out: {
    param: z.input<typeof ParamSchema>;
    query: z.input<typeof QuerySchema>;
  };
};

export const usePageRequestContext = useRequestContext<
  ContextType,
  any,
  PageInputType
>;