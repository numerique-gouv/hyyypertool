import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label = "Nom et/ou Prénom manquants";

export default function template() {
  const {
    moderation: {
      organization: { cached_libelle: organization_name, siret },
    },
  } = useContext(context);

  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    Les comptes utilisateurs ProConnect doivent être associés à une personne physique.
    Afin de donner suite à votre demande, merci de renseigner correctement votre nom et votre prénom.

    Pour se faire :

    - Videz le cache de votre navigateur (lien FAQ MCP) puis rafraîchissez votre page internet, 
    - Accédez à ProConnect : https://app.moncomptepro.beta.gouv.fr/, puis authentifiez-vous,
    - Cliquez sur l'onglet « Vos Informations Personnelles »,
    - Corrigez votre prénom et votre nom,
    - Sélectionnez votre organisation (numéro SIRET : ${siret}) pour que notre équipe puisse valider à nouveau la création de votre compte.

    Merci pour votre correction.
    Bien cordialement,
    L’équipe ProConnect.
  `;
}
