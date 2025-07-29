
#language: fr
Fonctionnalité: Retraiter une moderation

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je vois "Bonjour Hyyypertool !"
    Et je clique sur le bouton "ProConnect"
    Alors je vois "Liste des moderations"
    Et je clique sur "Voir les demandes traitées"
    Et je clique sur "Filtrer par jours"
    Et je tape "2011-11-12"
    Et je vois la ligne de table "44023386400014"
    Et sur la même ligne je clique sur "✅"
    Et je vois "Cette modération a été marqué comme traité"
    Et je vois "Marie Bon a rejoint une organisation avec un domain non vérifié « Bosch rexroth d.s.i. »"

  Scénario: Marie Bon à rejoindre l'organisation Bosch par erreur
    Quand je retraite la modération
    Alors je ne vois pas "Cette modération a été marqué comme traité"

    Soit le tableau sous le title "membre connu dans l’organisation"
    Alors le tableau est vide
