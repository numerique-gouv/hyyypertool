//

import { moncomptepro_pg, schema } from ":database:moncomptepro";
import { button } from ":ui/button";
import { eq } from "drizzle-orm";
import { ok } from "node:assert";

//

export async function _04({ moderation_id }: { moderation_id: number }) {
  const moderation = await moncomptepro_pg.query.moderations.findFirst({
    where: eq(schema.moderations.id, moderation_id),
    with: {
      organizations: true,
      users: true,
    },
  });

  ok(moderation);

  return (
    <div class="prose mx-auto !max-w-6xl">
      <h1>✅ 4. la réponse est envoyée</h1>
      <hr />
      <button class={button()}>Marquer la modération comme traitée</button>
    </div>
  );
}

//
// En attente - avec parainale
// Refusé
//   - Merci de ...
// Validé
//

//
// Enquete
//
//

//
// Page 1 :
// Aller vers la gestion des comptes après recheche
//

//
// Page 2 :
// Rajouter des espaces entre les boutons
//
