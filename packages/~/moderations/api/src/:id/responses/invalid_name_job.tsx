//

import { dedent } from "ts-dedent";

export const label = "job/nom/prénom compte déjà créé";

export default function template() {
  return dedent`
    Bonjour,

    Vos nom, prénom et/ou fonction ne sont pas renseignés correctement.
    Merci de bien vouloir les modifier depuis votre compte MonComptePro section "Vos informations personnelles" : https://app.moncomptepro.beta.gouv.fr

    Sans cela, nous serons obligés de supprimer votre compte prochainement.

    Merci pour votre compréhension.

    Excellente journée,
  `;
}
