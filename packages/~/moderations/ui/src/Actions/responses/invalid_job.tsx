//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label = "modification fonction";

export default function template() {
  const {
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Votre demande pour rejoindre l'organisation « ${organization_name} » a été prise en compte sur https://app.moncomptepro.beta.gouv.fr.

    Merci de renseigner correctement correctement votre fonction.

    Pour se faire :

    - connectez-vous à https://app.moncomptepro.beta.gouv.fr/
    - cliquez sur le lien suivant https://app.moncomptepro.beta.gouv.fr/users/personal-information
    - corrigez votre fonction
    - sélectionnez votre organisation (exemple : numéro SIRET 18890001300015)

    Excellente journée,
  `;
}
