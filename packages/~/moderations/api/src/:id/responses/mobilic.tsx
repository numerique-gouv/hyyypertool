//

import { dedent } from "ts-dedent";
import { usePageRequestContext } from "../context";

export const label = "livreurs / mobilic";

export default function template() {
  const {
    var: {
      moderation: {
        organization: { cached_libelle: organization_name },
      },
    },
  } = usePageRequestContext();

  return dedent`
    Bonjour,

    Votre demande pour rejoindre l'organisation « ${organization_name} » a été prise en compte sur https://app.moncomptepro.beta.gouv.fr.

    MonComptePro n'est pas dédié à votre démarche sur Mobilic.

    Si vous êtes salarié ou gestionnaire d'entreprise, cliquez sur le lien suivant pour vous connecter : [https://mobilic.beta.gouv.fr/login](https://mobilic.beta.gouv.fr/login)

    Excellente journée,
  `;
}
