//

import type { AwilixContainer } from "@~/app.di";
import type { App_Context } from "@~/app.middleware/context";
import { urls } from "@~/app.urls";
import { type GetOrganizationMembersCount } from "@~/organizations.repository/get_organization_members_count";
import type { Env, InferRequestType } from "hono";
import { useRequestContext } from "hono/jsx-renderer";
import type { GetModeration, GetOrganizationMember } from "./repository";

//

export const RESPONSE_MESSAGE_SELECT_ID = "response-message";
export const RESPONSE_TEXTAREA_ID = "response";
export const EMAIL_SUBJECT_INPUT_ID = "mail-subject";
export const EMAIL_TO_INPUT_ID = "mail-to";

//

export type Cradle = {
  get_moderation: GetModeration;
  get_organization_members_count: GetOrganizationMembersCount;
  get_organization_member: GetOrganizationMember;
};
export interface ContextVariablesType extends Env {
  Variables: {
    domain: string;
    injector: AwilixContainer<Cradle>;
    moderation: Awaited<ReturnType<GetModeration>>;
    organization_member: Awaited<ReturnType<GetOrganizationMember>>;
    query_organization_members_count: ReturnType<GetOrganizationMembersCount>;
  };
}
export type ContextType = App_Context & ContextVariablesType;

//

const $get = typeof urls.moderations[":id"].$get;

type PageInputType = {
  out: InferRequestType<typeof $get>;
};

export const usePageRequestContext = useRequestContext<
  ContextType,
  any,
  PageInputType
>;
