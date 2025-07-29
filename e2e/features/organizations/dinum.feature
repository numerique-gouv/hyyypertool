#language: fr
Fonctionnalité: Page organisation

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je vois "Bonjour Hyyypertool !"
    Et je clique sur le bouton "ProConnect"
    # Et je me connecte en tant que user@yopmail.com sur dev-agentconnect.fr

  Scénario:
    Quand je clique sur "Organisations"
    Alors je suis redirigé sur "/organizations"
    Et je vois "Liste des organisations"
    Et je vois la ligne de table "13002526500013"
    Et sur la même ligne je vois "DINUM"

  # Scénario: Fiche de DINUM
    Quand sur la même ligne je clique sur "➡️"
    Alors je vois "🏛 A propos de l'organisation"
    Et je vois "« DINUM »"
    Et je vois "Dénomination DINUM"
    Et je vois "Siret 13002526500013 Fiche annuaire"
    Et je vois "NAF/APE 84.11Z - Administration publique générale"
    Et je vois "Adresse 20 avenue de segur, 75007 Paris"
    Et je vois "Nature juridique SA nationale à conseil d'administration (Service central d'un ministère)"
    Et je vois "Tranche d effectif 100 à 199 salariés, en 2021 (code : 22) (liste code effectif INSEE)"

  # Scénario: domaine connu dans l'organisation DINUM
    Soit le tableau sous le title "🌐 3 domaines connu dans l'organisation"
    Et je vois la ligne "beta.gouv.fr" dans le tableau
    Et sur la même ligne je vois "✅"
    Et sur la même ligne je vois "verified"
    Et je vois la ligne "modernisation.gouv.fr" dans le tableau
    Et sur la même ligne je vois "✅"
    Et sur la même ligne je vois "verified"
    Et je vois la ligne "prestataire.modernisation.gouv.fr" dans le tableau
    Et sur la même ligne je vois "❎"
    Et sur la même ligne je vois "external"

  # Scénario: Membres de DINUM
    Quand je clique sur "1 membre enregistré dans l’organisation :"
    Et je vois la ligne de table "rdubigny@beta.gouv.fr"
    Et sur la même ligne je vois "Raphael"
    Et sur la même ligne je vois "Dubigny"
    Et sur la même ligne je vois "✅"
    Et sur la même ligne je vois "Chef"
