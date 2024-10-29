//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label = "livreurs / mobilic";

export default function template() {
  const {
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Votre demande pour rejoindre l'organisation « ${organization_name} » a été prise en compte sur https://app.moncomptepro.beta.gouv.fr.

    ProConnect n'est pas dédié à votre démarche sur Mobilic.

    Si vous êtes salarié ou gestionnaire d'entreprise, cliquez sur le lien suivant pour vous connecter : [https://mobilic.beta.gouv.fr/login](https://mobilic.beta.gouv.fr/login)

    Excellente journée,
  `;
}
