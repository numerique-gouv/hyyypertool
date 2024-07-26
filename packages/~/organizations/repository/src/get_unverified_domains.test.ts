//

import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import {
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/moncomptepro.database/seed/unicorn";
import { empty_database, migrate, pg } from "@~/moncomptepro.database/testing";
import type {
  MCP_EmailDomain_Type,
  MCP_Moderation,
} from "@~/moncomptepro.lib/moncomptepro.d";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { get_unverified_domains } from "./get_unverified_domains";

//

beforeAll(migrate);
beforeEach(empty_database);

//

test("returns bi.corn organization", async () => {
  await create_cactus_organization(pg);
  await create_troll_organization(pg);

  const unicorn_organization_id = await create_unicorn_organization(pg);
  const adora_pony_user_id = await create_adora_pony_user(pg);
  await pg.insert(schema.users_organizations).values({
    organization_id: unicorn_organization_id,
    user_id: adora_pony_user_id,
  });

  await pg.insert(schema.moderations).values({
    organization_id: unicorn_organization_id,
    user_id: adora_pony_user_id,
    type: "" as MCP_Moderation["type"],
  });

  await pg.insert(schema.email_domains).values({
    domain: "bi.corn",
    organization_id: unicorn_organization_id,
    verification_type: "authorized" as MCP_EmailDomain_Type,
  });

  const result = await get_unverified_domains(pg, {});

  expect(result).toEqual({
    count: 1,
    domains: [
      {
        domain: "bi.corn",
        id: expect.any(Number),
        organization_id: unicorn_organization_id,
        organization: {
          cached_libelle: "🦄 libelle",
          created_at: "1970-01-01T00:00:00+00:00",
          id: unicorn_organization_id,
          siret: "🦄 siret",
        },
      },
    ],
  });
});

test("returns no organizations", async () => {
  await create_unicorn_organization(pg);
  const result = await get_unverified_domains(pg, {});
  expect(result).toEqual({ count: 0, domains: [] });
});

//

async function create_cactus_organization(pg: MonComptePro_PgDatabase) {
  const [{ id: organization_id }] = await pg
    .insert(schema.organizations)
    .values({
      cached_libelle: "🌵 libelle",
      siret: "🌵 siret",
    })
    .returning({ id: schema.organizations.id });

  await pg.insert(schema.email_domains).values({
    domain: "cactus.corn",
    organization_id,
    verification_type: "verified" as MCP_EmailDomain_Type,
  });

  return organization_id;
}

async function create_troll_organization(pg: MonComptePro_PgDatabase) {
  const [{ id: organization_id }] = await pg
    .insert(schema.organizations)
    .values({
      cached_libelle: "🧌 libelle",
      siret: "🧌 siret",
    })
    .returning({ id: schema.organizations.id });

  return organization_id;
}
