//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { ModerationPage_Context } from "../context";

export const label = "Erreur Chorus Pro";

export default function template() {
  const {
    moderation: {
      organization: { cached_libelle: organization_name },
    },
  } = useContext(ModerationPage_Context);

  return dedent`
    Bonjour,

    Votre demande pour rejoindre l'organisation « ${organization_name} » a été prise en compte sur https://app.moncomptepro.beta.gouv.fr.
    
    Vous tentez de rattacher votre compte à l’organisation à laquelle sont facturés les achats de votre administration.
    Il ne s’agit donc pas de l’organisation dans laquelle vous exercez.
    Pour information, seuls les Agents du Ministre de l'Économie et des Finances peuvent rejoindre l’organisation « ${organization_name} ».
    
    Afin de donner suite à votre demande, veuillez renouveler votre inscription en vous rattachant à l'Administration publique ou le Ministère dont vous dépendez.
    
    Bien à vous.
    Cordialement,
  `;
}
