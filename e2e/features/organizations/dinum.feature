#language: fr
Fonctionnalité: Page organisation

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    * je vois "Bonjour Hyyypertool !"
    * je clique sur le bouton "ProConnect"
    # * je me connecte en tant que user@yopmail.com sur dev-agentconnect.fr

  Scénario:
    Quand je clique sur "Organisations"
    Alors je suis redirigé sur "/organizations"
    * je vois "Liste des organisations"
    * je vois la ligne de table "13002526500013"
    * sur la même ligne je vois "DINUM"

  # Scénario: Fiche de DINUM
    Quand sur la même ligne je clique sur "➡️"
    Alors je vois "A propos de « DINUM »"
    * je vois "Creation de l'organisation : 13/07/2018 15:35:15"
    * je vois "Dernière mise à jour : 22/06/2023 14:34:34"
    * je vois "Dénomination : DINUM"
    * je vois "Nom complet : Direction interministerielle du numerique (DINUM)"
    * je vois "Tranche d'effectif : 100 à 199 salariés, en 2021 (code : 22) (liste code effectif INSEE)"
    * je vois "État administratif : A (liste état administratif INSEE)"
    * je vois "Siret : 13002526500013 (Voir la fiche annuaire entreprise de cette organisation)"

  # Scénario: domaine connu dans l'organisation DINUM
    Soit le tableau sous le title "🌐 3 domaines connu dans l'organisation"
    * je vois la ligne "beta.gouv.fr" dans le tableau
    * sur la même ligne je vois "✅"
    * sur la même ligne je vois "verified"
    * je vois la ligne "modernisation.gouv.fr" dans le tableau
    * sur la même ligne je vois "✅"
    * sur la même ligne je vois "verified"
    * je vois la ligne "prestataire.modernisation.gouv.fr" dans le tableau
    * sur la même ligne je vois "❎"
    * sur la même ligne je vois "external"

  # Scénario: Membres de DINUM
    Quand je clique sur "1 membre enregistré dans l’organisation :"
    * je vois la ligne de table "rdubigny@beta.gouv.fr"
    * sur la même ligne je vois "Raphael"
    * sur la même ligne je vois "Dubigny"
    * sur la même ligne je vois "✅"
    * sur la même ligne je vois "Chef"
