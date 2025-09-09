//

import { Pagination_Schema, Search_Schema } from "@~/app.core/schema";
import type { App_Context } from "@~/app.middleware/context";
import { set_context_variables } from "@~/app.middleware/set_context_variables";
import type { urls } from "@~/app.urls";
import { type Env, type InferRequestType } from "hono";
import { useRequestContext } from "hono/jsx-renderer";

//

export const query_schema = Pagination_Schema.merge(Search_Schema);

//

export interface ContextVariablesType extends Env {
  Variables: {
    $describedby: string;
    $search: string;
    $table: string;
    hx_domains_query_props: Record<"hx-get", string>;
  };
}

export const set_variables = set_context_variables<ContextVariablesType>;
export type ContextType = App_Context & ContextVariablesType;

//

type PageInputType = {
  out: InferRequestType<typeof urls.organizations.domains.$get>;
};

export const usePageRequestContext = useRequestContext<
  ContextType,
  any,
  PageInputType
>;
