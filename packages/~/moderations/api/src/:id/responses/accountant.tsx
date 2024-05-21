//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { ModerationPage_Context } from "../context";

export const label = "refus prestataires";

export default function template() {
  const {
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = useContext(ModerationPage_Context);

  return dedent`
    Bonjour,

    Votre demande pour rejoindre l'organisation « ${organization_name} » a été prise en compte sur https://app.moncomptepro.beta.gouv.fr.

    Vous n'êtes pas autorisé à créer un compte au nom d'une organisation qui n'est pas la vôtre.

    Merci de bien vouloir demander à l'organisation d'effectuer elle-même la démarche ou de vous fournir une adresse mail dont le nom de domaine lui appartient.

    Excellente journée,
  `;
}
