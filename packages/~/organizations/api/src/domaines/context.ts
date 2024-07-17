//

import type { App_Context } from "@~/app.middleware/context";
import type { urls } from "@~/app.urls";
import type { get_unverified_organizations } from "@~/organizations.repository/get_unverified_organizations";
import type { Env } from "bun";
import type { InferRequestType } from "hono";
import { useRequestContext } from "hono/jsx-renderer";

//

export interface ContextVariablesType extends Env {
  Variables: {
    query_organizations: typeof get_unverified_organizations;
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
