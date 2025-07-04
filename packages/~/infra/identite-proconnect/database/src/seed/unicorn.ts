//

import type { MCP_EmailDomain_Type } from "@~/identite-proconnect.lib/identite-proconnect.d";
import { eq } from "drizzle-orm";
import { schema, type IdentiteProconnect_PgDatabase } from "..";

//

// Uses https://magicalunicornlife.com/the-best-unicorn-names/

//
export async function create_unicorn_organization(
  pg: IdentiteProconnect_PgDatabase,
) {
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

export async function create_adora_pony_user(
  pg: IdentiteProconnect_PgDatabase,
) {
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

export async function create_adora_pony_moderation(
  pg: IdentiteProconnect_PgDatabase,
  moderation: Omit<
    typeof schema.moderations.$inferInsert,
    "organization_id" | "user_id"
  >,
) {
  const unicorn_organization = await pg.query.organizations.findFirst({
    columns: { id: true },
    where: eq(schema.organizations.siret, "🦄 siret"),
  });
  const adora_pony_user = await pg.query.users.findFirst({
    columns: { id: true },
    where: eq(schema.users.email, "adora.pony@unicorn.xyz"),
  });
  const [{ id: moderation_id }] = await pg
    .insert(schema.moderations)
    .values({
      ...moderation,
      organization_id: unicorn_organization!.id,
      user_id: adora_pony_user!.id,
    })
    .returning({ id: schema.moderations.id });
  return moderation_id;
}

//

export async function create_pink_diamond_user(
  pg: IdentiteProconnect_PgDatabase,
) {
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

export async function create_red_diamond_user(
  pg: IdentiteProconnect_PgDatabase,
) {
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
