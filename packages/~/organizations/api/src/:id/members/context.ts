//

import type { Pagination } from "@~/app.core/schema";
import type { App_Context } from "@~/app.middleware/context";
import { urls } from "@~/app.urls";
import { type get_users_by_organization_id_dto } from "@~/users.repository/get_users_by_organization_id";
import type { Env, InferRequestType } from "hono";
import { createContext } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";

//

export const Member_Context = createContext({
  user: {} as Awaited<get_users_by_organization_id_dto>["users"][number],
});

//

export interface ContextVariablesType extends Env {
  Variables: {
    organization_id: number;
    pagination: Pagination;
    query_members_collection: get_users_by_organization_id_dto;
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
