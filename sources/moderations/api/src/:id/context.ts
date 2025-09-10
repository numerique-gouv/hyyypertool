//

import type { App_Context } from "@~/app.middleware/context";
import { z_email_domain } from "@~/app.core/schema/z_email_domain";
import { urls } from "@~/app.urls";
import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect.database";
import { GetModerationWithDetails, type GetModerationWithDetailsDto } from "@~/moderations.repository";
import { GetFicheOrganizationById, type GetFicheOrganizationByIdHandler } from "@~/organizations.lib/usecase";
import {
  GetDomainCount,
  GetOrganizationMember,
  GetOrganizationMembersCount,
  type GetDomainCountDto,
  type GetOrganizationMemberDto,
  type GetOrganizationMembersCountDto,
} from "@~/organizations.repository";
import { to } from "await-to-js";
import type { Env, InferRequestType } from "hono";
import { useRequestContext } from "hono/jsx-renderer";

//

export async function loadModerationPageVariables(
  pg: IdentiteProconnect_PgDatabase,
  { id }: { id: number },
) {
  const get_moderation_with_details = GetModerationWithDetails(pg);
  const [moderation_error, moderation] = await to(
    get_moderation_with_details(id),
  );

  if (moderation_error) {
    throw moderation_error;
  }

  //

  const domain = z_email_domain.parse(moderation.user.email, {
    path: ["moderation.users.email"],
  });

  //

  const get_organization_member = GetOrganizationMember(pg);
  const organization_member = await get_organization_member({
    organization_id: moderation.organization_id,
    user_id: moderation.user.id,
  });

  //

  const get_fiche_organization_by_id = GetFicheOrganizationById({
    pg,
  });
  const organization_fiche = await get_fiche_organization_by_id(
    moderation.organization_id,
  );

  const get_organization_members_count = GetOrganizationMembersCount(pg);
  const get_domain_count = GetDomainCount(pg);

  //

  return {
    domain,
    moderation,
    organization_fiche,
    organization_member,
    query_domain_count: get_domain_count(moderation.organization_id),
    query_organization_members_count: get_organization_members_count(
      moderation.organization_id,
    ),
  };
}

export interface ModerationContext extends Env {
  Variables: {
    moderation: GetModerationWithDetailsDto;
  };
}
export interface ContextVariablesType extends Env {
  Variables: Awaited<ReturnType<typeof loadModerationPageVariables>>;
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
