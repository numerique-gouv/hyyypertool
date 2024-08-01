//

import type { MCP_EmailDomain_Type } from "@~/moncomptepro.lib/types";
import { schema, type MonComptePro_PgDatabase } from "..";

//

export async function create_cactus_organization(pg: MonComptePro_PgDatabase) {
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
