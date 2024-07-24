//

import type { App_Context } from "@~/app.middleware/context";
import type { urls } from "@~/app.urls";
import type { get_unverified_domains } from "@~/organizations.repository/get_unverified_domains";
import type { Env, InferRequestType } from "hono";
import { useRequestContext } from "hono/jsx-renderer";

//

export interface ContextVariablesType extends Env {
  Variables: {
    query_unverified_domains: typeof get_unverified_domains;
  };
}
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
