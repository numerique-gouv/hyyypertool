//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label = "Coop - conseillers numériques";

export default function template() {
  const {
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Votre demande pour rejoindre l'organisation « ${organization_name} » a été prise en compte sur https://app.moncomptepro.beta.gouv.fr.

    Les adresses @conseiller-numerique.fr seront stoppées à partir du 15/11/2024.

    Afin que ProConnect identifie correctement votre nouvelle adresse email professionnelle, merci de l’ajouter via votre Espace Coop, comme indiqué sur ce tutoriel (https://aide.conseiller-numerique.gouv.fr/fr/article/fin-de-la-messagerie-conseiller-numeriquefr-mettre-a-jour-mon-adresse-professionnelle-15v1vlk/).

    Excellente journée,
    L’équipe ProConnect.
  `;
}
