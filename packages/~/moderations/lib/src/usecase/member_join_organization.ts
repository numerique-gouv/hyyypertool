//

import { NotFoundError } from "@~/app.core/error";
import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { join_organization } from "@~/moncomptepro.lib";
import { forceJoinOrganization } from "@~/moncomptepro.lib/sdk";
import { and, eq } from "drizzle-orm";

//

export async function member_join_organization(
  { pg }: { pg: MonComptePro_PgDatabase },
  {
    moderation_id,
    is_external,
  }: { moderation_id: number; is_external: boolean },
) {
  const moderation = await pg.query.moderations.findFirst({
    columns: { organization_id: true, user_id: true },
    where: eq(schema.moderations.id, moderation_id),
  });

  if (!moderation) throw new NotFoundError("Moderation not found.");

  const { organization_id, user_id } = moderation;

  (await pg.query.users_organizations.findFirst({
    where: and(
      eq(schema.users_organizations.organization_id, organization_id),
      eq(schema.users_organizations.user_id, user_id),
    ),
  })) ??
    (await forceJoinOrganization({
      is_external,
      organization_id,
      user_id,
    }));

  // NOTE(dougladuteil): still run legacy endpoint
  await join_organization({
    is_external,
    organization_id,
    user_id,
  });
}
