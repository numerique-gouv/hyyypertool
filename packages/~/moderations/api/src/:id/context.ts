//

import { NotFoundError } from "@~/app.core/error";
import type { App_Context } from "@~/app.middleware/context";
import { urls } from "@~/app.urls";
import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import type { GetFicheOrganizationByIdHandler } from "@~/organizations.lib/usecase";
import { type get_domain_count_dto } from "@~/organizations.repository/get_domain_count";
import { type get_organization_members_count_dto } from "@~/organizations.repository/get_organization_members_count";
import { and, eq } from "drizzle-orm";
import type { Env, InferRequestType } from "hono";
import { useRequestContext } from "hono/jsx-renderer";

//

export interface ModerationContext extends Env {
  Variables: {
    moderation: get_moderation_dto;
  };
}
export interface ContextVariablesType extends Env {
  Variables: {
    domain: string;
    moderation: get_moderation_dto;
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
  { pg }: { pg: MonComptePro_PgDatabase },
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

//

export async function get_moderation(
  { pg }: { pg: MonComptePro_PgDatabase },
  { moderation_id }: { moderation_id: number },
) {
  const moderation = await pg.query.moderations.findFirst({
    where: eq(schema.moderations.id, moderation_id),
    with: {
      organization: {
        columns: {
          cached_activite_principale: true,
          cached_adresse: true,
          cached_code_postal: true,
          cached_est_active: true,
          cached_etat_administratif: true,
          cached_libelle_activite_principale: true,
          cached_libelle_categorie_juridique: true,
          cached_libelle_tranche_effectif: true,
          cached_libelle: true,
          cached_nom_complet: true,
          cached_tranche_effectifs: true,
          created_at: true,
          id: true,
          siret: true,
          updated_at: true,
        },
      },
      user: {
        columns: {
          created_at: true,
          email: true,
          family_name: true,
          given_name: true,
          id: true,
          job: true,
          last_sign_in_at: true,
          phone_number: true,
          sign_in_count: true,
        },
      },
    },
  });

  if (!moderation) throw new NotFoundError("Moderation not found.");
  return moderation;
}
export type get_moderation_dto = Awaited<ReturnType<typeof get_moderation>>;
