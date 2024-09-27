//

import type { MCP_Moderation } from "@~/moncomptepro.lib/moncomptepro.d";
import consola from "consola";
import type { MonComptePro_PgDatabase } from "../index";
import { schema } from "../index";
import { insert_commune_de_pompierre } from "./organizations/commune_de_pompierre";
import { insert_yes_we_hack } from "./organizations/yes_we_hack";

//

export async function insert_database(db: MonComptePro_PgDatabase) {
  try {
    const raphael = await insert_raphael(db);
    consola.verbose(
      `🌱 INSERT user ${raphael.given_name} ${raphael.family_name}`,
    );
    const raphael_alpha = await insert_raphael_alpha(db);
    consola.verbose(
      `🌱 INSERT user ${raphael_alpha.given_name} ${raphael_alpha.family_name}`,
    );
    const jean_bon = await insert_jeanbon(db);
    consola.verbose(
      `🌱 INSERT user ${jean_bon.given_name} ${jean_bon.family_name}`,
    );
    const pierre_bon = await insert_pierrebon(db);
    consola.verbose(
      `🌱 INSERT user ${pierre_bon.given_name} ${pierre_bon.family_name}`,
    );
    const richard_bon = await insert_richardbon(db);
    consola.verbose(
      `🌱 INSERT user ${richard_bon.given_name} ${richard_bon.family_name}`,
    );
    const marie_bon = await insert_mariebon(db);
    consola.verbose(
      `🌱 INSERT user ${marie_bon.given_name} ${marie_bon.family_name}`,
    );

    //

    const dinum = await insert_dinum(db);
    consola.verbose(`🌱 INSERT organization ${dinum.cached_nom_complet}`);
    const aldp = await insert_aldp(db);
    consola.verbose(`🌱 INSERT organization ${aldp.cached_nom_complet}`);
    const abracadabra = await insert_abracadabra(db);
    consola.verbose(`🌱 INSERT organization ${abracadabra.cached_nom_complet}`);
    const dengi = await insert_dengi(db);
    consola.verbose(`🌱 INSERT organization ${dengi.cached_nom_complet}`);
    const bosch_france = await insert_bosch_france(db);
    consola.verbose(
      `🌱 INSERT organization ${bosch_france.cached_nom_complet}`,
    );
    const bosch_rexroth = await insert_bosch_rexroth(db);
    consola.verbose(
      `🌱 INSERT organization ${bosch_rexroth.cached_nom_complet}`,
    );
    const sak = await insert_sak(db);
    consola.verbose(`🌱 INSERT organization ${sak.cached_nom_complet}`);
    const yes_we_hack = await insert_yes_we_hack(db);
    consola.verbose(`🌱 INSERT organization yes_we_hack (id: ${yes_we_hack})`);
    const commune_de_pompierre = await insert_commune_de_pompierre(db);
    consola.verbose(
      `🌱 INSERT organization commune_de_pompierre (id: ${commune_de_pompierre})`,
    );

    //

    await insert_users_organizations(db, {
      organization_id: dinum.id,
      user_id: raphael.id,
    });
    consola.verbose(
      `🌱 INSERT ${raphael.given_name} join ${dinum.cached_libelle} `,
    );

    await insert_users_organizations(db, {
      organization_id: bosch_rexroth.id,
      user_id: marie_bon.id,
    });
    consola.verbose(
      `🌱 INSERT ${marie_bon.given_name} join ${bosch_rexroth.cached_libelle}`,
    );

    //

    await insert_moderation(db, {
      created_at: new Date("2011-11-11 11:11:11").toISOString(),
      organization_id: dinum.id,
      type: "organization_join_block" as MCP_Moderation["type"],
      user_id: jean_bon.id,
    });
    consola.verbose(
      `🌱 INSERT ${jean_bon.given_name} wants to join ${dinum.cached_libelle}`,
    );

    await insert_moderation(db, {
      created_at: new Date("2011-11-11 00:02:59").toISOString(),
      organization_id: abracadabra.id,
      type: "organization_join_block" as MCP_Moderation["type"],
      user_id: jean_bon.id,
    });
    consola.verbose(
      `🌱 INSERT ${jean_bon.given_name} wants to join ${abracadabra.cached_libelle}`,
    );

    await insert_moderation(db, {
      organization_id: aldp.id,
      type: "big_organization_join" as MCP_Moderation["type"],
      user_id: pierre_bon.id,
    });
    consola.verbose(
      `🌱 INSERT ${pierre_bon.family_name} wants to join  ${aldp.cached_libelle}`,
    );

    await insert_moderation(db, {
      organization_id: dengi.id,
      type: "organization_join_block" as MCP_Moderation["type"],
      user_id: richard_bon.id,
      moderated_at: new Date("2023-06-22 14:34:34").toISOString(),
    });
    consola.verbose(
      `🌱 INSERT ${richard_bon.given_name} wants to join ${dengi.cached_nom_complet}`,
    );

    await insert_moderation(db, {
      organization_id: dengi.id,
      type: "organization_join_block" as MCP_Moderation["type"],
      user_id: richard_bon.id,
    });
    consola.verbose(
      `🌱 INSERT ${richard_bon.given_name} wants to join ${dengi.cached_nom_complet} again...`,
    );

    await insert_moderation(db, {
      organization_id: bosch_france.id,
      type: "non_verified_domain" as MCP_Moderation["type"],
      user_id: marie_bon.id,
    });
    consola.verbose(
      `🌱 INSERT ${marie_bon.given_name} wants to join ${bosch_france.cached_nom_complet} again...`,
    );

    await insert_moderation(db, {
      organization_id: bosch_rexroth.id,
      type: "non_verified_domain" as MCP_Moderation["type"],
      user_id: marie_bon.id,
      moderated_at: new Date("2023-06-22 14:34:34").toISOString(),
    });
    consola.verbose(
      `🌱 INSERT ${marie_bon.given_name} wants to join ${bosch_rexroth.cached_nom_complet} again...`,
    );
    await insert_moderation(db, {
      organization_id: dinum.id,
      type: "non_verified_domain" as MCP_Moderation["type"],
      user_id: raphael_alpha.id,
      moderated_at: new Date("2023-06-22 14:34:34").toISOString(),
    });
    consola.verbose(
      `🌱 INSERT ${raphael_alpha.given_name} wants to join ${dinum.cached_nom_complet} again...`,
    );
  } catch (err) {
    console.error("Something went wrong...");
    console.error(err);
  }
}

//

function insert_moderation(
  db: MonComptePro_PgDatabase,
  insert_moderation: typeof schema.moderations.$inferInsert,
) {
  return db.insert(schema.moderations).values(insert_moderation);
}

function insert_users_organizations(
  db: MonComptePro_PgDatabase,
  insert_users_organizations: typeof schema.users_organizations.$inferInsert,
) {
  return db
    .insert(schema.users_organizations)
    .values(insert_users_organizations);
}

async function insert_jeanbon(db: MonComptePro_PgDatabase) {
  const insert = await db
    .insert(schema.users)
    .values({
      created_at: new Date("2018-07-13 15:35:15").toISOString(),
      email: "jeanbon@yopmail.com",
      family_name: "Bon",
      given_name: "Jean",
      job: "Boucher",
      phone_number: "0123456789",
      updated_at: new Date("2023-06-22 14:34:34").toISOString(),
      verify_email_sent_at: new Date("2023-06-22 14:34:34").toISOString(),
    })
    .returning();

  return insert.at(0)!;
}

async function insert_pierrebon(db: MonComptePro_PgDatabase) {
  const insert = await db
    .insert(schema.users)
    .values({
      created_at: new Date("2022-02-03T11:23:48.375Z").toISOString(),
      email: "pierrebon@aldp-asso.fr",
      family_name: "Bon",
      given_name: "Pierre",
      job: "Médiateur sociale et interculturelle",
      email_verified: true,
      phone_number: "0123456789",
      updated_at: new Date("2022-02-03T11:25:06.312Z").toISOString(),
      verify_email_sent_at: new Date("2022-02-03T11:25:06.312Z").toISOString(),
    })
    .returning();

  return insert.at(0)!;
}

async function insert_richardbon(db: MonComptePro_PgDatabase) {
  const insert = await db
    .insert(schema.users)
    .values({
      created_at: new Date("2022-02-03T11:23:48.375Z").toISOString(),
      email: "richardbon@leclerc.fr",
      family_name: "Bon",
      given_name: "Richard",
      job: "Dirigeant",
      email_verified: true,
      phone_number: "0123456789",
      updated_at: new Date("2022-02-03T11:25:06.312Z").toISOString(),
      verify_email_sent_at: new Date("2022-02-03T11:25:06.312Z").toISOString(),
    })
    .returning();

  return insert.at(0)!;
}

async function insert_mariebon(db: MonComptePro_PgDatabase) {
  const insert = await db
    .insert(schema.users)
    .values({
      created_at: new Date("2014-02-13T17:25:09.000Z").toISOString(),
      email_verified: true,
      email: "marie.bon@fr.bosch.com",
      family_name: "Bon",
      given_name: "Marie",
      job: "Gestionnaire données sociales",
      last_sign_in_at: new Date("2024-02-15T12:48:00.106Z").toISOString(),
      sign_in_count: 3,
      updated_at: new Date("2014-02-15T13:48:00.000Z").toISOString(),
    })
    .returning();

  return insert.at(0)!;
}

async function insert_raphael(db: MonComptePro_PgDatabase) {
  const insert = await db
    .insert(schema.users)
    .values({
      created_at: new Date("2018-07-13 15:35:15").toISOString(),
      email: "rdubigny@beta.gouv.fr",
      family_name: "Dubigny",
      given_name: "Raphael",
      job: "Chef",
      phone_number: "0123456789",
      updated_at: new Date("2023-06-22 14:34:34").toISOString(),
      verify_email_sent_at: new Date("2023-06-22 14:34:34").toISOString(),
    })
    .returning();

  return insert.at(0)!;
}

async function insert_raphael_alpha(db: MonComptePro_PgDatabase) {
  const insert = await db
    .insert(schema.users)
    .values({
      created_at: new Date("2018-07-13 15:35:15").toISOString(),
      email: "rdubigny@alpha.gouv.fr",
      family_name: "Dubigny",
      given_name: "Raphael",
      job: "Chef",
      phone_number: "0123456789",
      updated_at: new Date("2023-06-22 14:34:34").toISOString(),
      verify_email_sent_at: new Date("2023-06-22 14:34:34").toISOString(),
    })
    .returning();

  return insert.at(0)!;
}

//

async function insert_abracadabra(db: MonComptePro_PgDatabase) {
  const insert = await db
    .insert(schema.organizations)
    .values({
      cached_activite_principale:
        "90.02Z - Activités de soutien au spectacle vivant",
      cached_categorie_juridique:
        "Société à responsabilité limitée (sans autre indication)",
      cached_est_active: false,
      cached_etat_administratif: "A",
      cached_libelle_tranche_effectif: "10 à 19 salariés, en 2019",
      cached_libelle: "Abracadabra",
      cached_nom_complet: "Abracadabra (ABRACADABRA)",
      cached_tranche_effectifs: "11",
      created_at: new Date("2022-08-08T15:43:15.501Z").toISOString(),
      organization_info_fetched_at: new Date(
        "2022-08-08T15:43:15.501Z",
      ).toISOString(),
      siret: "51935970700022",
      updated_at: new Date("2022-08-08T15:43:15.501Z").toISOString(),
    })
    .returning();

  const organization = insert.at(0)!;
  await db.insert(schema.email_domains).values([
    // TODO(douglasduteil): add more domains
    // {
    //   domain: "abracadabra.com",
    //   organization_id: organization.id,
    //   verification_type: "verified",
    // },
    {
      domain: "yopmail.com",
      organization_id: organization.id,
      verification_type: null,
    },
    // {
    //   domain: "mailslurp.com",
    //   organization_id: organization.id,
    //   verification_type: "external",
    // },
    // {
    //   domain: "gmail.com",
    //   organization_id: organization.id,
    //   verification_type: "blacklisted",
    // },
    // {
    //   domain: "shazam.com",
    //   organization_id: organization.id,
    //   verification_type: "official_contact",
    // },
    // {
    //   domain: "flipendo.com",
    //   organization_id: organization.id,
    //   verification_type: "trackdechets_postal_mail",
    // },
  ]);

  return organization;
}

async function insert_aldp(db: MonComptePro_PgDatabase) {
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
    verification_type: "authorized",
  });
  return organization;
}

async function insert_dinum(db: MonComptePro_PgDatabase) {
  const insert = await db
    .insert(schema.organizations)
    .values({
      cached_activite_principale: "84.11Z - Administration publique générale",
      cached_adresse: "20 avenue de segur, 75007 Paris",
      cached_categorie_juridique: "Service central d'un ministère",
      cached_code_officiel_geographique: "75107",
      cached_code_postal: "75015",
      cached_est_active: true,
      cached_etat_administratif: "A",
      cached_libelle_activite_principale:
        "84.11Z - Administration publique générale",
      cached_libelle_categorie_juridique:
        "SA nationale à conseil d'administration",
      cached_libelle_tranche_effectif: "100 à 199 salariés, en 2021",
      cached_libelle: "DINUM",
      cached_nom_complet: "Direction interministerielle du numerique (DINUM)",
      cached_tranche_effectifs: "22",
      created_at: new Date("2018-07-13 15:35:15").toISOString(),
      siret: "13002526500013",
      updated_at: new Date("2023-06-22 14:34:34").toISOString(),
    })
    .returning();

  const organization = insert.at(0)!;
  await db.insert(schema.email_domains).values({
    domain: "beta.gouv.fr",
    organization_id: organization.id,
    verification_type: "verified",
  });
  await db.insert(schema.email_domains).values({
    domain: "modernisation.gouv.fr",
    organization_id: organization.id,
    verification_type: "verified",
  });
  await db.insert(schema.email_domains).values({
    domain: "prestataire.modernisation.gouv.fr",
    organization_id: organization.id,
    verification_type: "external",
  });
  return organization;
}

async function insert_dengi(db: MonComptePro_PgDatabase) {
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
    verification_type: "verified",
  });
  return organization;
}

async function insert_bosch_france(db: MonComptePro_PgDatabase) {
  const insert = await db
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
    .returning();
  return insert.at(0)!;
}

async function insert_bosch_rexroth(db: MonComptePro_PgDatabase) {
  const insert = await db
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
    .returning();
  const organization = insert.at(0)!;
  await db.insert(schema.email_domains).values({
    domain: "fr.bosch.com",
    organization_id: organization.id,
    verification_type: "verified",
  });
  return organization;
}

async function insert_sak(db: MonComptePro_PgDatabase) {
  const insert = await db
    .insert(schema.organizations)
    .values({
      siret: "20006967200018",
      created_at: "1970-01-01 00:00:00+00",
      updated_at: "1970-01-01 00:00:00+00",
      cached_libelle: "Cc du ternois",
      cached_nom_complet: "Cc du ternois",
      cached_enseigne: null,
      cached_tranche_effectifs: "31",
      cached_tranche_effectifs_unite_legale: "32",
      cached_libelle_tranche_effectif: "200 à 249 salariés, en 2019",
      cached_etat_administratif: "F",
      cached_est_active: false,
      cached_statut_diffusion: "O",
      cached_est_diffusible: true,
      cached_adresse:
        "8 place francois mitterrand, 62130 Saint-pol-sur-ternoise",
      cached_code_postal: "62130",
      cached_activite_principale: "84.11Z",
      cached_libelle_activite_principale:
        "84.11Z - Administration publique générale",
      cached_categorie_juridique: "7346",
      cached_libelle_categorie_juridique: "Communauté de communes",
      organization_info_fetched_at: "2022-08-08 16:17:39.373+00",
      cached_code_officiel_geographique: null,
    })
    .returning();

  const organization = insert.at(0)!;
  await db.insert(schema.email_domains).values([
    {
      organization_id: organization.id,
      domain: "ternoiscom.fr",
      verification_type: null,
      can_be_suggested: true,
      verified_at: null,
      created_at: "1970-01-01 00:00:00+00",
      updated_at: "1970-01-01 00:00:00+00",
    },
  ]);

  return organization;
}
