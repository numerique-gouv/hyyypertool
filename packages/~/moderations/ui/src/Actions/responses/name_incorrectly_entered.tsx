//

import { dedent } from "ts-dedent";

export const label =
  "Nom et/ou prénom mal renseignés - Modération non-bloquante";

export default function template() {
  return dedent`
    Bonjour, 

    Votre nom et/ou prénom n'a pas été correctement renseigné.

    Les champs Nom et Prénom doivent correspondre à ceux d’une personne physique.

    Merci de bien vouloir corriger cela depuis la section « Vos informations personnelles » de votre compte ProConnect (anciennement : AgentConnect, MonComptePro).

    Sans cette correction, nous serons contraints de supprimer votre compte prochainement.

    Merci pour votre correction.
    Bien cordialement
    L’équipe ProConnect.
  `;
}
