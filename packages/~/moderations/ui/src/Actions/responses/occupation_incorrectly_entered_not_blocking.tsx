//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label = "Profession mal renseignée - Modération non-bloquante ";

export default function template() {
  const {
    moderation: {
      organization: { siret },
    },
  } = useContext(context);
  return dedent`
    Bonjour, 

    Votre profession n'a pas été correctement renseignée.
    
    Votre profession ne peut pas être le nom de votre organisation ou le nom d’un service de votre organisation.

    Merci de bien vouloir corriger cela depuis la section « Vos informations personnelles » de votre compte ProConnect (anciennement : AgentConnect, MonComptePro).

    Pour se faire :

    - Accédez à votre compte ProConnect en cliquant sur le lien suivant : https://app.moncomptepro.beta.gouv.fr/users/personal-information,
    - Authentifiez-vous si cela vous est demandé par l'interface,
    - Corrigez votre profession,
    - Sélectionnez votre organisation (numéro SIRET : ${siret}) pour que notre équipe puisse valider à nouveau la création de votre compte.

    Sans cette correction, nous serons contraints de supprimer votre compte prochainement.

    Merci pour votre correction.
    Bien cordialement,
    L’équipe ProConnect.
  `;
}
