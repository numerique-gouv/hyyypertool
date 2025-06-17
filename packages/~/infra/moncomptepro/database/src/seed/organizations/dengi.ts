import type { EmailDomainVerificationType } from "@~/moncomptepro.lib";
import type { MonComptePro_PgDatabase } from "../..";
import { schema } from "../../index";

export async function insert_dengi(db: MonComptePro_PgDatabase) {
  const insert = await db
    .insert(schema.organizations)
    .values({
      cached_activite_principale: "47.11F",
      cached_categorie_juridique: "SAS, société par actions simplifiée",
      cached_code_officiel_geographique: "75107",
      cached_est_active: true,
      cached_etat_administratif: "A",
      cached_libelle_tranche_effectif: "50 à 99 salariés, en 2021",
      cached_libelle: "Dengi - Leclerc",
      cached_nom_complet: "Dengi",
      cached_tranche_effectifs: "21",
      created_at: new Date("2018-07-13 15:35:15").toISOString(),
      siret: "38514019900014",
      updated_at: new Date("2023-06-22 14:34:34").toISOString(),
    })
    .returning();

  const organization = insert.at(0)!;
  await db.insert(schema.email_domains).values({
    domain: "scapartois.fr",
    organization_id: organization.id,
    verification_type: "verified" satisfies EmailDomainVerificationType,
  });
  return organization;
}
