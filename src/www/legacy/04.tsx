//

import { prisma } from ":database";
import { button } from ":ui/button";

//

export async function _04({ moderation_id }: { moderation_id: number }) {
  const moderation = await prisma.moderations.findUniqueOrThrow({
    include: { organizations: true, users: true },
    where: { id: moderation_id },
  });
  return (
    <div class="prose mx-auto !max-w-6xl">
      <h1>✅ 4. la réponse est envoyée</h1>
      <hr />
      <button class={button()}>Marquer la modération comme traitée</button>
    </div>
  );
}
