//

import type { App_Context } from "@~/app.middleware/context";
import { urls } from "@~/app.urls";
import type { get_orginization_domains_dto } from "@~/organizations.repository/get_orginization_domains";
import type { Env, InferRequestType } from "hono";
import { useRequestContext } from "hono/jsx-renderer";
import { z } from "zod";

//

const $get = urls.organizations[":id"].domains.$get;

type PageInputType = {
  out: InferRequestType<typeof $get>;
};

//

interface ContextVariablesType extends Env {
  Variables: {
    domains: get_orginization_domains_dto;
  };
}
export type ContextType = App_Context & ContextVariablesType;

//

export const usePageRequestContext = useRequestContext<
  ContextType,
  any,
  PageInputType
>;

export const AddDomainParams_Schema = z.object({ domain: z.string().min(1) });
