//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label = "Quel lien avec l'organisation ?";

export default function template() {
  const {
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Votre demande pour rejoindre l'organisation « ${organization_name} » a été prise en compte sur https://app.moncomptepro.beta.gouv.fr.

    Afin de donner suite à cette demande, pourriez vous nous préciser le lien que vous avez avec cette organisation ?

    Nous vous recommandons de demander directement à l'organisation que vous représentez d'effectuer la démarche.

    Excellente journée,
    L’équipe MonComptePro.
  `;
}
