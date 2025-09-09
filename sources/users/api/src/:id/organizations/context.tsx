//

import {
  DescribedBy_Schema,
  Entity_Schema,
  Pagination_Schema,
  type Pagination,
} from "@~/app.core/schema";
import type { App_Context } from "@~/app.middleware/context";
import type { GetOrganizationsByUserIdDto } from "@~/organizations.repository";
import type { Env } from "hono";
import { useRequestContext } from "hono/jsx-renderer";
import { z } from "zod";

//

export const QuerySchema = Pagination_Schema.merge(DescribedBy_Schema).extend({
  page_ref: z.string(),
});

export const ParamSchema = Entity_Schema;

//

export interface ContextVariablesType extends Env {
  Variables: {
    pagination: Pagination;
    query_organizations_collection: Promise<GetOrganizationsByUserIdDto>;
  };
}
export type ContextType = App_Context & ContextVariablesType;

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
