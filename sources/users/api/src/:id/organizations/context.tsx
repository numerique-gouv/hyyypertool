//

import {
  DescribedBy_Schema,
  Entity_Schema,
  Pagination_Schema,
} from "@~/app.core/schema";
import type { App_Context } from "@~/app.middleware/context";
import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect.database";
import { GetOrganizationsByUserId } from "@~/organizations.repository";
import { match } from "ts-pattern";
import type { Env } from "hono";
import { useRequestContext } from "hono/jsx-renderer";
import { z } from "zod";

//

export async function loadOrganizationsPageVariables(
  pg: IdentiteProconnect_PgDatabase,
  { user_id, query }: { user_id: number; query: any },
) {
  const pagination = match(
    Pagination_Schema.safeParse(query, { path: ["query"] }),
  )
    .with({ success: true }, ({ data }) => data)
    .otherwise(() => Pagination_Schema.parse({}));

  const get_organizations_by_user_id = GetOrganizationsByUserId(pg);
  const query_organizations_collection = get_organizations_by_user_id({
    user_id,
    pagination: { ...pagination, page: pagination.page - 1 },
  });

  return {
    pagination,
    query_organizations_collection,
  };
}

//

export const QuerySchema = Pagination_Schema.merge(DescribedBy_Schema).extend({
  page_ref: z.string(),
});

export const ParamSchema = Entity_Schema;

//

export interface ContextVariablesType extends Env {
  Variables: Awaited<ReturnType<typeof loadOrganizationsPageVariables>>;
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
