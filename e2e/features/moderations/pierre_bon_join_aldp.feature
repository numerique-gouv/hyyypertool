#language: fr

#

Fonctionnalité: Association Moderation

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    * je vois "Bonjour Hyyypertool !"
    * je clique sur le bouton "ProConnect"
    # * je me connecte en tant que user@yopmail.com sur dev-agentconnect.fr

  Scénario: Pierre Bon veut rejoindre l'association ALDP
    Alors je vois "Liste des moderations"
    * je vois la ligne de table "81797266400038"
    * sur la même ligne je vois "Bon"
    * sur la même ligne je vois "Pierre"
    * sur la même ligne je vois "pierrebon@aldp-asso.fr"
    Quand sur la même ligne je clique sur "➡️"
    Alors je vois "Pierre Bon a rejoint l'organisation de plus de 50 employés « ALDP »"
    * je vois "Liste dirigeants - Annuaire entreprise API"

