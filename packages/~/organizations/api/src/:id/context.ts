//

import type { App_Context } from "@~/app.middleware/context";
import { urls } from "@~/app.urls";
import type { get_organization_by_id_dto } from "@~/organizations.repository/get_organization_by_id";
import type { Env } from "bun";
import type { InferRequestType } from "hono";
import { useRequestContext } from "hono/jsx-renderer";

//

interface ContextVariablesType extends Env {
  Variables: {
    organization: NonNullable<get_organization_by_id_dto>;
  };
}
export type ContextType = App_Context & ContextVariablesType;

//

const $get = typeof urls.organizations[":id"].$get;
type PageInputType = {
  out: InferRequestType<typeof $get>;
};

export const usePageRequestContext = useRequestContext<
  ContextType,
  any,
  PageInputType
>;
