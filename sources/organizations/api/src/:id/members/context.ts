//

import type { Pagination } from "@~/app.core/schema";
import type { App_Context } from "@~/app.middleware/context";
import { urls } from "@~/app.urls";
import { type GetUsersByOrganizationIdDto } from "@~/users.repository";
import type { Env, InferRequestType } from "hono";
import { createContext } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";

//

export const Member_Context = createContext({
  user: {} as GetUsersByOrganizationIdDto["users"][number],
});

//

export interface ContextVariablesType extends Env {
  Variables: {
    organization_id: number;
    pagination: Pagination;
    query_members_collection: Promise<GetUsersByOrganizationIdDto>;
  };
}
export type ContextType = App_Context & ContextVariablesType;

//

const $get = typeof urls.organizations[":id"].members.$get;
type PageInputType = {
  out: InferRequestType<typeof $get>;
};

export const usePageRequestContext = useRequestContext<
  ContextType,
  any,
  PageInputType
>;
