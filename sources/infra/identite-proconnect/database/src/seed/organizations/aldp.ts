import type { EmailDomainVerificationType } from "@~/identite-proconnect.lib";
import type { IdentiteProconnect_PgDatabase } from "../..";
import { schema } from "../../index";

export async function insert_aldp(db: IdentiteProconnect_PgDatabase) {
  const insert = await db
    .insert(schema.organizations)
    .values({
      cached_activite_principale:
        "94.99Z - Autres organisations fonctionnant par adhésion volontaire",
      cached_categorie_juridique: "Association déclarée",
      cached_est_active: true,
      cached_etat_administratif: "A",
      cached_libelle_tranche_effectif: "50 à 99 salariés, en 2019",
      cached_libelle: "ALDP",
      cached_nom_complet:
        "Association des loisirs de la diversite et du partage (ALDP)",
      cached_tranche_effectifs: "21",
      created_at: new Date("2022-02-03T12:27:30.000Z").toISOString(),
      siret: "81797266400038",
      updated_at: new Date("2022-02-03T12:27:30.000Z").toISOString(),
    })
    .returning();
  const organization = insert.at(0)!;
  await db.insert(schema.email_domains).values({
    domain: "aldp-asso.fr",
    organization_id: organization.id,
    verification_type: "verified" satisfies EmailDomainVerificationType,
  });
  return organization;
}
