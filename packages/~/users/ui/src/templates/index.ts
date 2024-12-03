//

import { dedent } from "ts-dedent";

//

export function ResetMFA_Message() {
  return dedent`
    Bonjour,

    Nous avons réinitialiser votre mot de passe et vos clé d'accès.
    Votre compte ProConnect n'est plus protégé par la validation en deux étapes.
    Vous serez obligé de définir un nouveau mot de passe ou de vous connecter avec un lien magique à la prochaine connexion.

    Excellente journée,
    L'équipe ProConnect.
  `;
}
