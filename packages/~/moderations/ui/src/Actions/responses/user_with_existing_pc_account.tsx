//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label = "Utilisateur possédant déjà un compte ProConnect";

export default function template() {
  const {
    domain,
    moderation: {
      organization: { cached_libelle: organization_name },
      user: { email },
    },
  } = useContext(context);


  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    Vous possédez déjà un compte ProConnect associé à l’adresse e-mail professionnelle : « ${email} ».
    Merci de bien vouloir vous connecter avec le compte déjà existant.

    Votre adresse e-mail associée à un nom de domaine gratuit tel que « ${domain} » ne sera pas autorisée.

    Bien cordialement,
    L’équipe ProConnect.
  `;
}
