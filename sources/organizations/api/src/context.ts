//

import {
  Entity_Schema,
  Pagination_Schema,
  Search_Schema,
} from "@~/app.core/schema";
import type { App_Context } from "@~/app.middleware/context";
import type { urls } from "@~/app.urls";
import type { GetOrganizationsListHandler } from "@~/organizations.repository";
import type { Env, InferRequestType } from "hono";
import { useRequestContext } from "hono/jsx-renderer";

//

export interface ContextVariablesType extends Env {
  Variables: {
    query_organizations: GetOrganizationsListHandler;
  };
}
export type ContextType = App_Context & ContextVariablesType;

//

export const PageQuery_Schema = Pagination_Schema.merge(Search_Schema).merge(
  Entity_Schema.partial(),
);

type PageInputType = {
  out: InferRequestType<typeof urls.organizations.$get>;
};

export const usePageRequestContext = useRequestContext<
  ContextType,
  any,
  PageInputType
>;
