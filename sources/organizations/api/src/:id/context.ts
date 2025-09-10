//

import type { App_Context } from "@~/app.middleware/context";
import { urls } from "@~/app.urls";
import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect.database";
import type { Organization } from "@~/organizations.lib/entities/Organization";
import {
  GetFicheOrganizationById,
  GetOrganizationById,
} from "@~/organizations.lib/usecase";
import {
  GetDomainCount,
  GetOrganizationMembersCount,
} from "@~/organizations.repository";
import { to as await_to } from "await-to-js";
import type { Env, InferRequestType } from "hono";
import { useRequestContext } from "hono/jsx-renderer";

//

type FicheOrganization = Pick<
  Organization,
  | "cached_activite_principale"
  | "cached_adresse"
  | "cached_code_postal"
  | "cached_est_active"
  | "cached_etat_administratif"
  | "cached_libelle_categorie_juridique"
  | "cached_libelle_tranche_effectif"
  | "cached_libelle"
  | "cached_nom_complet"
  | "cached_tranche_effectifs"
  | "created_at"
  | "id"
  | "siret"
  | "updated_at"
>;

export async function loadOrganizationPageVariables(
  pg: IdentiteProconnect_PgDatabase,
  { id }: { id: number },
) {
  const get_organization_by_id = GetOrganizationById({ pg });
  const [error, organization] = await await_to(
    get_organization_by_id(id, {
      columns: {
        cached_activite_principale: true,
        cached_adresse: true,
        cached_code_postal: true,
        cached_est_active: true,
        cached_etat_administratif: true,
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
    }),
  );

  if (error) {
    throw error;
  }

  //

  const get_fiche_organization_by_id = GetFicheOrganizationById({ pg });
  const organization_fiche = await get_fiche_organization_by_id(id);

  const query_organization_domains_count = GetDomainCount(pg)(id);
  const query_organization_members_count = GetOrganizationMembersCount(pg)(id);

  return {
    organization_fiche,
    organization,
    query_organization_domains_count,
    query_organization_members_count,
  };
}

export interface ContextVariablesType extends Env {
  Variables: Awaited<ReturnType<typeof loadOrganizationPageVariables>>;
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
