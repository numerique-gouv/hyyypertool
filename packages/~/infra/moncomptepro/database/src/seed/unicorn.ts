//

import type { MCP_EmailDomain_Type } from "@~/moncomptepro.lib/moncomptepro.d";
import { schema, type MonComptePro_PgDatabase } from "..";

//

// Uses https://magicalunicornlife.com/the-best-unicorn-names/

//
export async function create_unicorn_organization(pg: MonComptePro_PgDatabase) {
  const [{ id: organization_id }] = await pg
    .insert(schema.organizations)
    .values({
      cached_libelle: "🦄 libelle",
      siret: "🦄 siret",
    })
    .returning({ id: schema.organizations.id });

  await pg.insert(schema.email_domains).values({
    domain: "unicorn.xyz",
    organization_id,
    verification_type: "verified" as MCP_EmailDomain_Type,
  });

  return organization_id;
}

//
export async function create_adora_pony_user(pg: MonComptePro_PgDatabase) {
  const [{ id: user_id }] = await pg
    .insert(schema.users)
    .values({
      created_at: new Date().toISOString(),
      email: "adora.pony@unicorn.xyz",
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
      email: "pink.diamond@unicorn.xyz",
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
      email: "red.diamond@unicorn.xyz",
      family_name: "Diamond",
      given_name: "Red",
      updated_at: new Date().toISOString(),
    })
    .returning({ id: schema.users.id });

  return user_id;
}
