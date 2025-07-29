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

    Quand je vais à l'intérieur du tableau nommé "Liste des domaines à vérifier"
    Alors je vois 2 éléments
    Et je réinitialise le contexte
    Quand je vais à l'intérieur de la rangée nommée "Domaine non vérifié yeswehack.com pour Yes we hack"
    Alors je vois "Yes we hack"
    Et je clique sur "➡️"
    Et je réinitialise le contexte
    Alors je vois "🏛 A propos de l'organisation"
    Et je vois "« Yes we hack »"
    Et je vois "Dénomination Yes we hack"

    Quand je vais à l'intérieur du tableau nommé "domaine connu dans l'organisation"
    Alors je vois "yeswehack.com"
    Et je vois "❓"

    Quand je clique sur "Menu"
    Et je clique sur "✅ Domaine autorisé"
    Alors je vois "yeswehack.com"
    Et je vois "✅"
    Et je réinitialise le contexte

    Quand je clique sur "Domaines à vérifier"
    Et je clique sur "Rafraichir"
    Quand je vais à l'intérieur du tableau nommé "Liste des domaines à vérifier"
    Alors je vois 1 éléments
