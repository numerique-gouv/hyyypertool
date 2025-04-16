
#language: fr
Fonctionnalité: Retraiter une moderation

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    * je vois "Bonjour Hyyypertool !"
    * je clique sur le bouton "ProConnect"
    Alors je vois "Liste des moderations"
    * je clique sur "Voir les demandes traitées"
    * je clique sur "Filtrer par jours"
    * je tape "2011-11-12"
    * je vois la ligne de table "44023386400014"
    * sur la même ligne je clique sur "✅"
    * je vois "Cette modération a été marqué comme traité"
    * je vois "Marie Bon a rejoint une organisation avec un domain non vérifié « Bosch rexroth d.s.i. »"

  @only
  Scénario: Marie Bon à rejoindre l'organisation Bosch par erreur
    Quand je clique sur "Retraiter"
    Alors je ne vois pas "Cette modération a été marqué comme traité"

    Soit le tableau sous le title "membre connu dans l’organisation"
    Alors le tableau est vide
