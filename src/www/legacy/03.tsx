//

import { prisma } from ":database";
import { button } from ":ui/button";

//

export async function _03({ moderation_id }: { moderation_id: number }) {
  const moderation = await prisma.moderations.findUniqueOrThrow({
    include: { organizations: true, users: true },
    where: { id: moderation_id },
  });
  const mailto_query = new URLSearchParams({
    subject: `[MonComptePro] Demande pour rejoindre ${moderation.organizations.cached_libelle}`,
    cc: `moncomptepro@beta.gouv.fr`,
  });
  return (
    <div class="mx-auto !max-w-4xl">
      <h1>
        ✉️ 3. J'ai pris ma décision, je copie le message que je souhaite
        répondre par mail
      </h1>
      <hr />

      <button class={button()}>
        🪄 Action en un click : Envoyer l'email « Votre demande a été traitée »
      </button>

      <h6>A) Copier le message à envoyer en réponse :</h6>
      <h6>B) Coller le texte en réponse à l'email correspondant :</h6>
      <a
        href={`mailto:${moderation.users.email}?${mailto_query}`}
        class={button()}
      >
        Envoyer un nouvel email
      </a>
    </div>
  );
}
