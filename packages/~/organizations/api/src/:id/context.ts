//

import type { App_Context } from "@~/app.middleware/context";
import { urls } from "@~/app.urls";
import type { Organization } from "@~/moncomptepro.database";
import type { Env, InferRequestType } from "hono";
import { useRequestContext } from "hono/jsx-renderer";
//

type FicheOrganization = Pick<
  Organization,
  | "cached_activite_principale"
  | "cached_adresse"
  | "cached_code_postal"
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

export interface ContextVariablesType extends Env {
  Variables: {
    organization: FicheOrganization;
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
