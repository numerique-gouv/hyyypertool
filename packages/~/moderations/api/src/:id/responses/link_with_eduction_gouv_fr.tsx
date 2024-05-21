//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { ModerationPage_Context } from "../context";

export const label = "Quel lien avec le Ministère de l'Éduc Nat";

export default function template() {
  const {
    domain,
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = useContext(ModerationPage_Context);

  return dedent`
    Bonjour,

    Votre demande pour rejoindre l'organisation « ${organization_name} » a été prise en compte sur https://app.moncomptepro.beta.gouv.fr.

    Afin de donner suite à cette demande, pourriez vous nous préciser le lien que vous avez avec cette organisation ? Votre adresse mail correspond au rectorat ${domain}.
    Merci de bien vouloir rejoindre ce dernier ou utiliser une adresse mail dont le nom de domaine est : education.gouv.fr

    Nous vous recommandons de demander directement à l'organisation que vous représentez d'effectuer la démarche.

    Excellente journée,
  `;
}
