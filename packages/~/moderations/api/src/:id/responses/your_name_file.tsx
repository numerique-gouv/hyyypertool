//

import { dedent } from "ts-dedent";
import { usePageRequestContext } from "../context";

export const label = "Titre test";

export default function template() {
  const {
    var: {
      moderation: {
        organization: { cached_libelle: organization_name },
      },
    },
  } = usePageRequestContext();

  return dedent`
    Bonjour,

    Votre demande pour rejoindre l'organisation « ${organization_name} » a été prise en compte sur https://app.moncomptepro.beta.gouv.fr.

    Vous disposez d’une adresse mail académique (educagri.fr), à ce titre, vous n’êtes pas autorisé à rattacher votre compte au Ministère de l’Agriculture.
    En fonction de votre profession et de votre périmètre d’intervention, merci de bien vouloir renouveler votre inscription en rattachant votre compte à l'établissement dans lequel vous exercez,

    Excellente journée,
    L’équipe MonComptePro.
  `;
}
