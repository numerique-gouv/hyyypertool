//

import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import { OpenInZammad } from "@~/app.ui/zammad/components/OpenInZammad";
import { SearchInZammad } from "@~/app.ui/zammad/components/SearchInZammad";
import { urls } from "@~/app.urls";
import { get_duplicate_moderations } from "@~/moderations.repository/get_duplicate_moderations";
import { get_user_by_id } from "@~/users.repository/get_user_by_id";
import { get_zammad_mail } from "@~/zammad.lib";
import to from "await-to-js";
import { useRequestContext } from "hono/jsx-renderer";

//

export async function Duplicate_Warning({
  organization_id,
  user_id,
}: {
  organization_id: number;
  user_id: number;
}) {
  const {
    var: { moncomptepro_pg },
  } = useRequestContext<MonComptePro_Pg_Context>();

  const moderations = await get_duplicate_moderations(moncomptepro_pg, {
    organization_id,
    user_id,
  });
  const moderation_count = moderations.length;

  if (moderation_count <= 1) return <></>;
  const user = await get_user_by_id(moncomptepro_pg, { id: user_id });
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
          <li key={moderation.id.toString()}>
            <a
              href={
                urls.moderations[":id"].$url({
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
