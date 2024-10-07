//

import {
  DescribedBy_Schema,
  Pagination_Schema,
  type Entity_Schema,
} from "@~/app.core/schema";
import type { App_Context } from "@~/app.middleware/context";
import type { get_organizations_by_user_id_dto } from "@~/organizations.repository/get_organizations_by_user_id";
import type { Env } from "hono";
import { useRequestContext } from "hono/jsx-renderer";
import type { z } from "zod";

//

export const query_schema = DescribedBy_Schema.merge(Pagination_Schema);

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
    query: z.input<typeof query_schema>;
  };
};

export const usePageRequestContext = useRequestContext<
  ContextType,
  any,
  PageInputType
>;
