//

import type { App_Context } from "@~/app.middleware/context";
import { urls } from "@~/app.urls";
import type { get_user_by_id_dto } from "@~/users.repository/get_user_by_id";
import type { Env, InferRequestType } from "hono";
import { useRequestContext } from "hono/jsx-renderer";

//

export interface ContextVariablesType extends Env {
  Variables: {
    user: NonNullable<get_user_by_id_dto>;
  };
}
export type ContextType = App_Context & ContextVariablesType;

//

const $get = typeof urls.users[":id"].$get;

type PageInputType = {
  out: InferRequestType<typeof $get>;
};

export const usePageRequestContext = useRequestContext<
  ContextType,
  any,
  PageInputType
>;
