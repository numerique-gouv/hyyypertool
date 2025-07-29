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
    Quand je vais à l'intérieur de la rangée nommée "Modération big organisation de Pierre Bon pour 81797266400038"
    Alors je vois "Bon"
    Et je vois "Pierre"
    Et je vois "pierrebon@aldp-asso.fr"
    Et je clique sur "➡️"
    Et je réinitialise le contexte
    Alors je vois "Pierre Bon a rejoint l'organisation de plus de 50 employés « ALDP »"
    Et je vois "Liste dirigeants - Annuaire entreprise API"
