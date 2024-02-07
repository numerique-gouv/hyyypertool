#language: fr
Fonctionnalité: Page organisation

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    * je vois "Bonjour Hyyypertool !"
    * je clique sur le bouton "AgentConnect"
    * je me connecte en tant que user@yopmail.com sur dev-agentconnect.fr

  Scénario:
    Quand je clique sur "Organisations"
    Alors je suis redirigé sur "/legacy/organizations"
    Et je vois "Liste des organisations"
    Et je vois "DINUM"
    Et je clique sur "➡️"

  # Scénario: Fiche de DINUM
    Alors je vois "A propos de Direction interministerielle du numerique (DINUM)"
    * je vois "Creation de l'organisation : 13/07/2018 15:35:15"
    * je vois "Dernière mise à jour : 22/06/2023 14:34:34"
    * je vois "Dénomination : Direction interministerielle du numerique (DINUM)"
    * je vois "Tranche d'effectif : 100 à 199 salariés, en 2021 (code : 22) (liste code effectif INSEE)"
    * je vois "État administratif : A (liste état administratif INSEE)"
    * je vois "siret : 13002526500013 (Voir la fiche annuaire entreprise de cette organisation)"

  # @only
  # Scénario: Domain internes de DINUM
    Alors je vois "Domain internes"
    * je vois la ligne de table "beta.gouv.fr"
    * sur la même ligne je vois "✅"
    * je vois la ligne de table "modernisation.gouv.fr"
    * sur la même ligne je vois "✅"

  # Scénario: Domain externe de DINUM
    Alors je vois "Domain internes"
    * je vois "prestataire.modernisation.gouv.fr"

  # Scénario: Membres de DINUM
    Alors je vois "Membres enregistrés dans cette organisation :"
    * je vois la ligne de table "rdubigny@beta.gouv.fr"
    * sur la même ligne je vois "Raphael"
    * sur la même ligne je vois "Dubigny"
    * sur la même ligne je vois "✅"
    * sur la même ligne je vois "Chef"
