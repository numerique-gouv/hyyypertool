//

import { schema, type MonComptePro_PgDatabase } from "..";

//

// Uses https://magicalunicornlife.com/the-best-unicorn-names/

//
export async function create_unicorn_organization(pg: MonComptePro_PgDatabase) {
  const [{ id: organization_id }] = await pg
    .insert(schema.organizations)
    .values({
      authorized_email_domains: [],
      cached_libelle: "🦄 libelle",
      external_authorized_email_domains: [],
      siret: "🦄 siret",
      trackdechets_email_domains: [],
      verified_email_domains: [],
    })
    .returning({ id: schema.organizations.id });

  return organization_id;
}

//
export async function create_adora_pony_user(pg: MonComptePro_PgDatabase) {
  const [{ id: user_id }] = await pg
    .insert(schema.users)
    .values({
      created_at: new Date().toISOString(),
      email: "adora.pony@uni.corn",
      family_name: "Pony",
      given_name: "Adora",
      updated_at: new Date().toISOString(),
    })
    .returning({ id: schema.users.id });

  return user_id;
}

//

export async function create_pink_diamond_user(pg: MonComptePro_PgDatabase) {
  const [{ id: user_id }] = await pg
    .insert(schema.users)
    .values({
      created_at: new Date().toISOString(),
      email: "pink.diamond@uni.corn",
      family_name: "Diamond",
      given_name: "Pink",
      updated_at: new Date().toISOString(),
    })
    .returning({ id: schema.users.id });

  return user_id;
}

export async function create_red_diamond_user(pg: MonComptePro_PgDatabase) {
  const [{ id: user_id }] = await pg
    .insert(schema.users)
    .values({
      created_at: new Date().toISOString(),
      email: "red.diamond@uni.corn",
      family_name: "Diamond",
      given_name: "Red",
      updated_at: new Date().toISOString(),
    })
    .returning({ id: schema.users.id });

  return user_id;
}
