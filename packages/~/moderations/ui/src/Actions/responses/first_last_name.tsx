//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label = "nom et prénom et fonction";

export default function template() {
  const {
    moderation: {
      organization: { cached_libelle: organization_name, siret },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Votre demande pour rejoindre l'organisation « ${organization_name} » a été prise en compte sur https://app.moncomptepro.beta.gouv.fr.

    Les comptes MonComptePro doivent être associés à une personne physique. Merci de renseigner correctement vos nom, prénom ainsi que votre fonction.

    Pour se faire :

    - connectez vous à https://app.moncomptepro.beta.gouv.fr/
    - cliquez sur le lien suivant https://app.moncomptepro.beta.gouv.fr/users/personal-information
    - corrigez vos informations
    - sélectionnez votre organisation (numéro SIRET : ${siret})

    Je reste à votre disposition pour tout complément d'information.

    Excellente journée,
    L’équipe MonComptePro.
  `;
}
