//

import { schema } from ":database:moncomptepro";
import { and, count, eq } from "drizzle-orm";
import { use_MonComptePro_PgClient } from "../../database/moncomptepro/MonComptePro_PgClient_Provider";

//
export async function Duplicate_Warning({
  organization_id,
  user_id,
}: {
  organization_id: number;
  user_id: number;
}) {
  const moderation_count = await get_moderation_count({
    organization_id,
    user_id,
  });

  if (moderation_count <= 1) return <></>;

  return (
    <div class="fr-alert fr-alert--warning">
      <h3 class="fr-alert__title">Attention : demande multiples</h3>
      <p>Il s'agit de la {moderation_count}e demande pour cette organisation</p>
    </div>
  );
}

async function get_moderation_count({
  organization_id,
  user_id,
}: {
  organization_id: number;
  user_id: number;
}) {
  const pg = use_MonComptePro_PgClient();
  const [{ value: moderation_count }] = await pg
    .select({ value: count() })
    .from(schema.moderations)
    .where(
      and(
        eq(schema.moderations.organization_id, organization_id),
        eq(schema.moderations.user_id, user_id),
      ),
    );

  return moderation_count;
}
