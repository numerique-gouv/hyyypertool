//

import { dedent } from "ts-dedent";

export const label = "Profession mal renseignée - Modération non-bloquante ";

export default function template() {
  return dedent`
    Bonjour, 

    Votre profession n'a pas été correctement renseignée.

    Merci de bien vouloir corriger cela depuis la section « Vos informations personnelles » de votre compte ProConnect (anciennement : AgentConnect, MonComptePro).

    Votre profession ne peut pas être le nom de votre organisation ou le nom d’un service de votre organisation.

    Sans cette correction, nous serons contraints de supprimer votre compte prochainement.

    Merci pour votre correction.
    Bien cordialement,
    L’équipe ProConnect.
  `;
}
