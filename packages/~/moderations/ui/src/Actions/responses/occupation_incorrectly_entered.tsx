//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label = "Profession mal renseignée";

export default function template() {
  const {
    moderation: {
      organization: { cached_libelle: organization_name, siret },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    Afin que votre demande puisse être validée, merci de renseigner correctement votre profession sur le champ « Profession ou rôle au sein de votre organisation ». 
    Votre profession ne peut pas être le nom de votre organisation ou le nom d’un service de votre organisation.

    Pour se faire :

    - Videz le cache de votre navigateur puis rafraîchissez votre page internet, (lien)
    - Accédez à ProConnect : https://identite.proconnect.gouv.fr/users/personal-information, puis authentifiez-vous,
    - Cliquez sur l'onglet « Vos Informations Personnelles »,
    - Corrigez votre profession,
    - Sélectionnez votre organisation (numéro SIRET : ${siret}) pour que notre équipe puisse valider à nouveau la création de votre compte.

    Merci pour votre correction.
    Bien cordialement,
    L’équipe ProConnect.
  `;
}
