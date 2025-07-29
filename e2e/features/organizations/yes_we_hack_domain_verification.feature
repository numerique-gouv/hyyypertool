#language: fr
Fonctionnalité: Page organisation - domaine à vérifier

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je vois "Bonjour Hyyypertool !"
    Et je clique sur le bouton "ProConnect"

  Scénario:
    Quand je clique sur "Domaines à vérifier"
    Alors je suis redirigé sur "/organizations/domains"
    Et je vois "Liste des domaines à vérifier"

    Soit le tableau sous le title "Liste des domaines à vérifier"
    Et je vois 2 lignes dans le tableau
    Et je vois la ligne de table "81403721400016"
    Et sur la même ligne je vois "Yes we hack"

    Quand sur la même ligne je clique sur "➡️"
    Alors je vois "🏛 A propos de l'organisation"
    Et je vois "« Yes we hack »"
    Et je vois "Dénomination Yes we hack"

    Soit le tableau sous le title "domaine connu dans l'organisation"
    Et je vois la ligne "yeswehack.com" dans le tableau
    Et sur la même ligne je vois "❓"

    Quand j'ouvre le menu déroulant sur la même ligne
    Et je clique sur "✅ Domaine autorisé"
    Alors je vois la ligne "yeswehack.com" dans le tableau
    Et sur la même ligne je vois "✅"

    Quand je clique sur "Domaines à vérifier"
    Et je clique sur "Rafraichir"
    Soit le tableau sous le title "Liste des domaines à vérifier"
    Alors je vois 1 lignes dans le tableau
