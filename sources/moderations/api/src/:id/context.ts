//

import type { App_Context } from "@~/app.middleware/context";
import { urls } from "@~/app.urls";
import type { GetModerationWithDetailsDto } from "@~/moderations.repository";
import type { GetFicheOrganizationByIdHandler } from "@~/organizations.lib/usecase";
import {
  type GetDomainCountDto,
  type GetOrganizationMemberDto,
  type GetOrganizationMembersCountDto,
} from "@~/organizations.repository";
import type { Env, InferRequestType } from "hono";
import { useRequestContext } from "hono/jsx-renderer";

//

export interface ModerationContext extends Env {
  Variables: {
    moderation: GetModerationWithDetailsDto;
  };
}
export interface ContextVariablesType extends Env {
  Variables: {
    domain: string;
    moderation: GetModerationWithDetailsDto;
    organization_member: GetOrganizationMemberDto;
    organization_fiche: Awaited<ReturnType<GetFicheOrganizationByIdHandler>>;
    query_organization_members_count: Promise<GetOrganizationMembersCountDto>;
    query_domain_count: Promise<GetDomainCountDto>;
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

//
