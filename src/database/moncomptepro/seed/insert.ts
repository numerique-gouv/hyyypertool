//

import * as schema from "../drizzle/schema";
import type { MonComptePro_PgDatabase } from "../moncomptepro_pg";

//

export async function insert_database(db: MonComptePro_PgDatabase) {
  try {
    const raphael = await insert_raphael(db);
    console.log(`🌱 Raphael`);
    const dinum = await insert_dinum(db);
    console.log(`🌱 DINUM`);
    const raphael_dinum = await insert_users_organizations(db, {
      organization_id: dinum.id,
      user_id: raphael.id,
    });
    console.log(
      `🌱 ${raphael_dinum.command} ${raphael_dinum.rowCount} Raphael join DINUM`,
    );
  } catch (err) {
    console.error("Something went wrong...");
    console.error(err);
  }
}

//

function insert_users_organizations(
  db: MonComptePro_PgDatabase,
  insert_users_organizations: typeof schema.users_organizations.$inferInsert,
) {
  return db
    .insert(schema.users_organizations)
    .values(insert_users_organizations);
}
async function insert_raphael(db: MonComptePro_PgDatabase) {
  const insert = await db
    .insert(schema.users)
    .values({
      created_at: new Date("2018-07-13 15:35:15"),
      email: "rdubigny@beta.gouv.fr",
      family_name: "Dubigny",
      given_name: "Raphael",
      job: "Chef",
      phone_number: "0123456789",
      updated_at: new Date("2023-06-22 14:34:34"),
      verify_email_sent_at: new Date("2023-06-22 14:34:34"),
    })
    .returning();

  return insert.at(0)!;
}

async function insert_dinum(db: MonComptePro_PgDatabase) {
  const insert = await db
    .insert(schema.organizations)
    .values({
      created_at: new Date("2018-07-13 15:35:15"),
      updated_at: new Date("2023-06-22 14:34:34"),
      cached_libelle: "Direction interministerielle du numerique (DINUM)",
      siret: "13002526500013",
      cached_etat_administratif: "A",
      cached_libelle_tranche_effectif: "100 à 199 salariés, en 2021",
      cached_tranche_effectifs: "22",
      verified_email_domains: ["beta.gouv.fr", "modernisation.gouv.fr"],
      authorized_email_domains: ["beta.gouv.fr", "modernisation.gouv.fr"],
      external_authorized_email_domains: ["prestataire.modernisation.gouv.fr"],
      cached_code_officiel_geographique: "75107",
    })
    .returning();
  return insert.at(0)!;
}
