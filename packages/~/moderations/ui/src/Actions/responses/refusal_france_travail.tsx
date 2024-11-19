//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label = "Enseignant e-mail educagri.fr —> Min de l’Agriculture";

export default function template() {
  const {
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    Pour des raisons de sécurité, il ne vous est pas possible de créer directement un compte sur notre plateforme. Vous devez impérativement passer par votre fournisseur d’identité Neptune pour vous connecter.

    Pour accéder à votre service via ProConnect, voici les étapes à suivre pour garantir une connexion réussie :

    Cliquez sur le bouton "Connexion ProConnect".

    Saisissez attentivement votre adresse e-mail dans le champ prévu. Assurez-vous de ne pas faire d’erreur dans la saisie, car cette adresse est utilisée pour vous diriger automatiquement vers le bon fournisseur d’identité.

    Si votre adresse e-mail est correctement saisie, vous serez redirigé(e) vers le fournisseur d’identité Neptune pour finaliser votre connexion.

    Bien cordialement,
    L’équipe ProConnect.
  `;
}
