//

import { OpenInZammad, SearchInZammad } from ":common/zammad";
import { schema } from ":database:moncomptepro";
import { app_hc } from ":hc";
import { get_zammad_mail } from ":legacy/services/zammad_api";
import to from "await-to-js";
import { and, asc, eq } from "drizzle-orm";
import { use_MonComptePro_PgClient } from "../../database/moncomptepro/MonComptePro_PgClient_Provider";

//
export async function Duplicate_Warning({
  organization_id,
  user_id,
}: {
  organization_id: number;
  user_id: number;
}) {
  const moderations = await get_duplicate_moderations({
    organization_id,
    user_id,
  });
  const moderation_count = moderations.length;

  if (moderation_count <= 1) return <></>;
  const user = await get_user({ user_id });
  if (!user) return <p>Utilisateur introuvable</p>;

  const moderation_ticket = await Promise.all(
    moderations.map(async (moderation) => {
      if (!moderation.ticket_id) return { moderation };
      const [, zammad_ticket] = await to(
        get_zammad_mail({ ticket_id: moderation.ticket_id }),
      );
      return { moderation, zammad_ticket };
    }),
  );

  return (
    <div class="fr-alert fr-alert--warning">
      <h3 class="fr-alert__title">Attention : demande multiples</h3>
      <p>Il s'agit de la {moderation_count}e demande pour cette organisation</p>
      <SearchInZammad search={user.email}>
        Trouver les echanges pour l'email « {user.email} » dans Zammad
      </SearchInZammad>
      <ul>
        {moderation_ticket.map(({ moderation, zammad_ticket }) => (
          <li>
            <a
              href={
                app_hc.legacy.moderations[":id"].$url({
                  param: { id: moderation.id.toString() },
                }).pathname
              }
            >
              Moderation#{moderation.id}
            </a>{" "}
            {moderation.moderated_at ? "✔️" : "❌"}:{" "}
            {moderation.ticket_id && zammad_ticket ? (
              <OpenInZammad ticket_id={moderation.ticket_id}>
                Ouvrir Ticket#{moderation.ticket_id} dans Zammad
              </OpenInZammad>
            ) : (
              "Pas de ticket"
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

async function get_duplicate_moderations({
  organization_id,
  user_id,
}: {
  organization_id: number;
  user_id: number;
}) {
  const pg = use_MonComptePro_PgClient();
  return await pg
    .select()
    .from(schema.moderations)
    .where(
      and(
        eq(schema.moderations.organization_id, organization_id),
        eq(schema.moderations.user_id, user_id),
      ),
    )
    .orderBy(asc(schema.moderations.created_at));
}

async function get_user({ user_id }: { user_id: number }) {
  const pg = use_MonComptePro_PgClient();
  return pg.query.users.findFirst({
    where: eq(schema.users.id, user_id),
  });
}
