//

import type { Entity_Schema, Pagination_Schema } from "@~/app.core/schema";
import type { App_Context } from "@~/app.middleware/context";
import type { get_organizations_by_user_id_dto } from "@~/organizations.repository/get_organizations_by_user_id";
import type { Env } from "hono";
import { useRequestContext } from "hono/jsx-renderer";
import type { z } from "zod";

//

export interface ContextVariablesType extends Env {
  Variables: {
    organizations: Awaited<get_organizations_by_user_id_dto>["organizations"];
    count: Awaited<get_organizations_by_user_id_dto>["count"];
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
