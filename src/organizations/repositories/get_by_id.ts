//

import { schema } from "@~/moncomptepro.database";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

//

export async function get_by_id(
  pg: NodePgDatabase<typeof schema>,
  { id }: { id: number },
) {
  const organization = await pg.query.organizations.findFirst({
    where: eq(schema.organizations.id, id),
  });

  if (!organization) {
    throw new Error("Organization not found");
  }

  return organization;
}

export type Organization_DTO = Awaited<ReturnType<typeof get_by_id>>;
