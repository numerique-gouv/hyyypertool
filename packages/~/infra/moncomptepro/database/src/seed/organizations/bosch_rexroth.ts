//

import { schema, type MonComptePro_PgDatabase } from "../..";

export async function insert_bosch_rexroth(pg: MonComptePro_PgDatabase) {
  const [{ id: organization_id }] = await pg
    .insert(schema.organizations)
    .values({
      cached_activite_principale: "28.12Z",
      cached_categorie_juridique: "SAS, société par actions simplifiée",
      cached_code_officiel_geographique: "69259",
      cached_est_active: true,
      cached_etat_administratif: "A",
      cached_libelle_activite_principale:
        "29.12Z - Fabrication d'autres équipements automobiles",
      cached_libelle_tranche_effectif: "250 à 499 salariés, en 2021",
      cached_libelle: "Bosch rexroth d.s.i.",
      cached_nom_complet: "Bosch rexroth d.s.i.",
      cached_tranche_effectifs: "41",
      created_at: new Date("2024-01-19T21:27:42.009Z").toISOString(),
      siret: "44023386400014 ",
      updated_at: new Date("2024-02-15T13:45:32.598Z").toISOString(),
    })
    .returning({ id: schema.organizations.id });

  await pg.insert(schema.email_domains).values({
    domain: "fr.bosch.com",
    organization_id,
    verification_type: "verified",
    can_be_suggested: true,
    verified_at: "2022-05-11 15:31:44.199+00",
    created_at: "2022-04-11 15:31:44.199+00",
    updated_at: "2022-04-11 15:31:44.199+00",
  });

  return organization_id;
}
