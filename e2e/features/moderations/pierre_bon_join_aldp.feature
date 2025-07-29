#language: fr

#

Fonctionnalité: Association Moderation

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je vois "Bonjour Hyyypertool !"
    Et je clique sur le bouton "ProConnect"
    # Et je me connecte en tant que user@yopmail.com sur dev-agentconnect.fr

  Scénario: Pierre Bon veut rejoindre l'association ALDP
    Alors je vois "Liste des moderations"
    Et je vois la ligne de table "81797266400038"
    Et sur la même ligne je vois "Bon"
    Et sur la même ligne je vois "Pierre"
    Et sur la même ligne je vois "pierrebon@aldp-asso.fr"
    Quand sur la même ligne je clique sur "➡️"
    Alors je vois "Pierre Bon a rejoint l'organisation de plus de 50 employés « ALDP »"
    Et je vois "Liste dirigeants - Annuaire entreprise API"
