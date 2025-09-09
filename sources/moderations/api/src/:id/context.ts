//

import type { App_Context } from "@~/app.middleware/context";
import { urls } from "@~/app.urls";
import {
  schema,
  type IdentiteProconnect_PgDatabase,
} from "@~/identite-proconnect.database";
import type { GetModerationWithDetailsDto } from "@~/moderations.repository";
import type { GetFicheOrganizationByIdHandler } from "@~/organizations.lib/usecase";
import { type get_domain_count_dto } from "@~/organizations.repository/get_domain_count";
import { type get_organization_members_count_dto } from "@~/organizations.repository/get_organization_members_count";
import { and, eq } from "drizzle-orm";
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
    organization_member: get_organization_member_dto;
    organization_fiche: Awaited<ReturnType<GetFicheOrganizationByIdHandler>>;
    query_organization_members_count: Promise<get_organization_members_count_dto>;
    query_domain_count: Promise<get_domain_count_dto>;
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

export async function get_organization_member(
  { pg }: { pg: IdentiteProconnect_PgDatabase },
  { user_id, organization_id }: { user_id: number; organization_id: number },
) {
  return pg.query.users_organizations.findFirst({
    columns: { is_external: true },
    where: and(
      eq(schema.users_organizations.user_id, user_id),
      eq(schema.users_organizations.organization_id, organization_id),
    ),
  });
}
export type get_organization_member_dto = Awaited<
  ReturnType<typeof get_organization_member>
>;
