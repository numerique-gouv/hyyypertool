//

import { schema, type MonComptePro_PgDatabase } from "../..";

//

export async function insert_bosch_france(pg: MonComptePro_PgDatabase) {
  const [{ id: organization_id }] = await pg
    .insert(schema.organizations)
    .values({
      cached_activite_principale: "29.32Z",
      cached_categorie_juridique: "SAS, société par actions simplifiée",
      cached_code_officiel_geographique: "93070",
      cached_est_active: true,
      cached_etat_administratif: "A",
      cached_libelle_activite_principale:
        "29.32Z - Fabrication d'autres équipements automobiles",
      cached_libelle_tranche_effectif: "500 à 999 salariés, en 2021",
      cached_libelle: "Robert bosch france",
      cached_nom_complet: "Robert bosch france",
      cached_tranche_effectifs: "41",
      created_at: new Date("2024-01-19T21:27:42.009Z").toISOString(),
      siret: "57206768400017",
      updated_at: new Date("2024-02-15T13:45:32.598Z").toISOString(),
    })
    .returning({ id: schema.organizations.id });

  return organization_id;
}
