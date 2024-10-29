//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label = "Vous possédez déjà un compte ProConnect";

export default async function template() {
  const { moderation, query_suggest_same_user_emails } = useContext(context);

  const members_email = await query_suggest_same_user_emails({
    family_name: moderation.user.family_name ?? "",
    organization_id: moderation.organization.id,
  });

  return dedent`
    Bonjour,

    Votre demande pour rejoindre l'organisation « ${moderation.organization.cached_libelle} » a été prise en compte sur https://app.moncomptepro.beta.gouv.fr.

    Vous possédez déjà un compte ProConnect :

    - ${members_email.join("\n- ")}

    Merci de bien vouloir vous connecter avec le compte déjà existant.

    Je reste à votre disposition pour tout complément d'information.

    Excellente journée,
    L’équipe ProConnect.
  `;
}
