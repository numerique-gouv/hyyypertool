//

import { useContext } from "hono/jsx";
import { dedent } from "ts-dedent";
import { context } from "../context";

export const label =
  "Nom de domaine existant —> utilisation adresse e-mail personnelle ou domaine gratuit ";

export default async function template() {
  const {
    moderation: {
      organization: { cached_libelle: organization_name, id },
    },
    query_suggest_organization_domains,
  } = useContext(context);
  const domains = await query_suggest_organization_domains(id);
  console.log(useContext(context), "🥳🥳🥳🥳");

  return dedent`
    Bonjour,

    Nous avons bien reçu votre demande de rattachement à l'organisation « ${organization_name} » sur ProConnect (anciennement : AgentConnect, MonComptePro).

    D’après nos recherches, l’organisation « ${organization_name} » dispose d’un nom de domaine officiel.
    Conformément à nos règles, nous ne pouvons pas accepter votre demande de rattachement avec votre adresse e-mail personnelle ou associée à un domaine grand public (gmail, orange, wanadoo, yahoo…).
    Veuillez créer à nouveau votre compte utilisateur avec votre adresse e-mail professionnelle, associée au nom de domaine : ${domains.map((domain) => `« ${domain} »`).join(", ")}.

    Bien cordialement,
    L’équipe ProConnect.
  `;
}
