//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label = "Pas de légitimité - Ministère de l'Éducation";

export default function template() {
  const {
    domain,
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Votre demande pour rejoindre l'organisation « ${organization_name} » a été prise en compte sur https://app.moncomptepro.beta.gouv.fr.

    Vous disposez d’une adresse mail académique (${domain}), à ce titre, vous n’êtes pas autorisé à rattacher votre compte au Ministère de l’Éducation Nationale et de la Jeunesse.
    En fonction de votre profession et de votre périmètre d’intervention, merci de bien vouloir renouveler votre inscription en rattachant votre compte à l’une des organisations suivantes :

    - L’établissement dans lequel vous exercez,
    - La Direction des services départementaux de l'Éducation nationale de laquelle vous dépendez,
    - Le rectorat de votre Académie.

    Bien cordialement,
    L’équipe MonComptePro.
  `;
}
